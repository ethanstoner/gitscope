import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useGitHubUser } from '../hooks/useGitHubUser';
import { useGitHubRepos } from '../hooks/useGitHubRepos';
import { useGitHubEvents } from '../hooks/useGitHubEvents';
import { getAccountAgeDays } from '../utils/dateUtils';
import ComparisonLayout from '../components/compare/ComparisonLayout';
import ComparisonBars from '../components/compare/ComparisonBars';
import WinnerBadges from '../components/compare/WinnerBadges';
import LanguageChart from '../components/profile/LanguageChart';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import type { WeeklyActivity } from '../utils/types';

export default function ComparePage() {
  const { user1: username1, user2: username2 } = useParams<{ user1: string; user2: string }>();
  const navigate = useNavigate();

  const u1 = useGitHubUser(username1);
  const u2 = useGitHubUser(username2);
  const r1 = useGitHubRepos(username1);
  const r2 = useGitHubRepos(username2);
  const e1 = useGitHubEvents(username1);
  const e2 = useGitHubEvents(username2);

  const loading = u1.loading || u2.loading || r1.loading || r2.loading || e1.loading || e2.loading;
  const error = u1.error || u2.error || r1.error || r2.error || e1.error || e2.error;

  if (loading) return <LoadingSpinner />;

  if (error) {
    const failedUser = u1.error ? username1 : u2.error ? username2 : r1.error ? username1 : r2.error ? username2 : e1.error ? username1 : username2;
    return <ErrorMessage error={`Failed to load data for @${failedUser}: ${error}`} />;
  }

  if (!u1.user || !u2.user) return <ErrorMessage error="Could not load user profiles" />;

  const user1 = u1.user;
  const user2 = u2.user;

  // Build winner badge metrics
  const ageYears1 = Math.round((getAccountAgeDays(user1.created_at) / 365) * 10) / 10;
  const ageYears2 = Math.round((getAccountAgeDays(user2.created_at) / 365) * 10) / 10;

  const winnerMetrics = [
    { label: 'Repos', value1: user1.public_repos, value2: user2.public_repos },
    { label: 'Stars', value1: r1.totalStars, value2: r2.totalStars },
    { label: 'Followers', value1: user1.followers, value2: user2.followers },
    { label: 'Following', value1: user1.following, value2: user2.following },
    { label: 'Account age', value1: ageYears1, value2: ageYears2 },
    { label: 'Active days', value1: e1.activeDays, value2: e2.activeDays },
  ];

  // Merge weekly activity for overlay chart
  const weekMap = new Map<string, { week: string; [key: string]: number | string }>();
  const mergeWeeks = (data: WeeklyActivity[], key: string) => {
    for (const w of data) {
      const existing = weekMap.get(w.week) || { week: w.week };
      existing[key] = w.count;
      weekMap.set(w.week, existing);
    }
  };
  mergeWeeks(e1.weeklyActivity, user1.login);
  mergeWeeks(e2.weeklyActivity, user2.login);
  const activityData = Array.from(weekMap.values()).sort((a, b) =>
    (a.week as string).localeCompare(b.week as string)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Navigation bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => navigate(`/compare/${username2}/${username1}`)}
          className="px-4 py-2 text-sm font-medium bg-white border border-black/8 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Swap users
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-sm font-medium bg-white border border-black/8 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Edit
        </button>
        <Link
          to={`/user/${username1}`}
          className="text-sm text-violet-600 hover:underline"
        >
          @{username1} profile
        </Link>
        <Link
          to={`/user/${username2}`}
          className="text-sm text-violet-600 hover:underline"
        >
          @{username2} profile
        </Link>
      </div>

      {/* Side-by-side profiles */}
      <ComparisonLayout
        user1={user1}
        user2={user2}
        totalStars1={r1.totalStars}
        totalStars2={r2.totalStars}
      />

      {/* Winner badges */}
      <WinnerBadges
        metrics={winnerMetrics}
        username1={user1.login}
        username2={user2.login}
      />

      {/* Metric comparison chart */}
      <ComparisonBars
        user1={user1}
        user2={user2}
        totalStars1={r1.totalStars}
        totalStars2={r2.totalStars}
        activeDays1={e1.activeDays}
        activeDays2={e2.activeDays}
      />

      {/* Language charts side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-2 font-medium">@{user1.login}</p>
          <LanguageChart languages={r1.languages} />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2 font-medium">@{user2.login}</p>
          <LanguageChart languages={r2.languages} />
        </div>
      </div>

      {/* Activity overlay chart */}
      {activityData.length > 0 && (
        <div className="bg-white rounded-xl border border-black/8 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={activityData}>
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey={user1.login}
                stroke="#7c3aed"
                fill="#7c3aed"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey={user2.login}
                stroke="#c4b5fd"
                fill="#c4b5fd"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
