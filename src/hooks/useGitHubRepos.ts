import { useState, useEffect } from 'react';
import { ghFetch, getStoredToken } from '../utils/api';
import { getLanguageColor } from '../utils/languageColors';
import type { GitHubRepo, LanguageStat } from '../utils/types';

function groupTopLanguages(sorted: LanguageStat[]): LanguageStat[] {
  if (sorted.length <= 6) return sorted;
  const top6 = sorted.slice(0, 6);
  const otherCount = sorted.slice(6).reduce((sum, l) => sum + l.count, 0);
  const otherPct = sorted.slice(6).reduce((sum, l) => sum + l.percentage, 0);
  top6.push({ name: 'Other', count: otherCount, percentage: otherPct, color: '#94a3b8' });
  return top6;
}

export function useGitHubRepos(username: string | undefined) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [languages, setLanguages] = useState<LanguageStat[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function fetchRepos() {
      const signal = controller.signal;
      try {
        const page1 = await ghFetch<GitHubRepo[]>(
          `/users/${username}/repos?per_page=100&sort=updated&page=1`, { signal }
        );
        let allRepos = page1;
        if (page1.length === 100) {
          const page2 = await ghFetch<GitHubRepo[]>(
            `/users/${username}/repos?per_page=100&sort=updated&page=2`, { signal }
          );
          allRepos = [...page1, ...page2];
        }

        const ownRepos = allRepos.filter(r => !r.fork);
        if (signal.aborted) return;
        setRepos(allRepos);
        setTotalStars(ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0));

        // Enhanced mode (PAT available): fetch per-repo language bytes
        const hasToken = !!getStoredToken();
        if (hasToken && ownRepos.length <= 50) {
          const langBytes: Record<string, number> = {};
          const batchSize = 5;
          for (let i = 0; i < ownRepos.length; i += batchSize) {
            if (signal.aborted) return;
            const batch = ownRepos.slice(i, i + batchSize);
            const results = await Promise.all(
              batch.map(r => ghFetch<Record<string, number>>(
                `/repos/${r.full_name}/languages`, { signal }
              ).catch(() => ({})))
            );
            for (const langs of results) {
              for (const [lang, bytes] of Object.entries(langs)) {
                langBytes[lang] = (langBytes[lang] || 0) + bytes;
              }
            }
          }
          const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0);
          if (totalBytes > 0) {
            const sorted = Object.entries(langBytes)
              .sort((a, b) => b[1] - a[1])
              .map(([name, bytes]) => ({
                name,
                count: bytes,
                percentage: Math.round((bytes / totalBytes) * 100),
                color: getLanguageColor(name),
              }));
            setLanguages(groupTopLanguages(sorted));
            return;
          }
        }

        // Simple mode: count repos per primary language
        const langCount: Record<string, number> = {};
        for (const repo of ownRepos) {
          if (repo.language) {
            langCount[repo.language] = (langCount[repo.language] || 0) + 1;
          }
        }
        const total = Object.values(langCount).reduce((a, b) => a + b, 0);
        const sorted = Object.entries(langCount)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({
            name,
            count,
            percentage: Math.round((count / total) * 100),
            color: getLanguageColor(name),
          }));
        setLanguages(groupTopLanguages(sorted));
      } catch (err: any) {
        if (!signal.aborted) setError(err.message);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    }

    fetchRepos();
    return () => controller.abort();
  }, [username]);

  return { repos, languages, totalStars, loading, error };
}
