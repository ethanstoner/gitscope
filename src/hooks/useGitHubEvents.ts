import { useState, useEffect } from 'react';
import { ghFetch, isLiteMode } from '../utils/api';
import { getDayKey, getWeekStart } from '../utils/dateUtils';
import type { GitHubEvent, HeatmapDay, WeeklyActivity } from '../utils/types';

const CODING_EVENTS = ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'PullRequestReviewEvent'];

export function useGitHubEvents(username: string | undefined) {
  const [heatmap, setHeatmap] = useState<HeatmapDay[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);
  const [activeDays, setActiveDays] = useState(0);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (!username) return;
    if (isLiteMode()) {
      setSkipped(true);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setSkipped(false);

    async function fetchEvents() {
      const signal = controller.signal;
      try {
        let allEvents: GitHubEvent[] = [];
        for (let page = 1; page <= 3; page++) {
          const events = await ghFetch<GitHubEvent[]>(
            `/users/${username}/events?per_page=100&page=${page}`, { signal }
          );
          allEvents = [...allEvents, ...events];
          if (events.length < 100) break;
        }

        if (signal.aborted) return;

        const codingEvents = allEvents.filter(e => CODING_EVENTS.includes(e.type));
        setEvents(codingEvents);

        const dayCounts: Record<string, number> = {};
        for (const event of codingEvents) {
          const day = getDayKey(event.created_at);
          dayCounts[day] = (dayCounts[day] || 0) + 1;
        }
        const heatmapData = Object.entries(dayCounts)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));

        const weekCounts: Record<string, number> = {};
        for (const event of codingEvents) {
          const week = getWeekStart(event.created_at);
          weekCounts[week] = (weekCounts[week] || 0) + 1;
        }
        const weeklyData = Object.entries(weekCounts)
          .map(([week, count]) => ({ week, count }))
          .sort((a, b) => a.week.localeCompare(b.week));

        setHeatmap(heatmapData);
        setWeeklyActivity(weeklyData);
        setActiveDays(Object.keys(dayCounts).length);
      } catch (err: any) {
        if (!signal.aborted) setError(err.message);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    }

    fetchEvents();
    return () => controller.abort();
  }, [username]);

  return { heatmap, weeklyActivity, activeDays, events, loading, error, skipped };
}
