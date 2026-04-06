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
      <div className="animate-fade-up flex flex-wrap items-center gap-3" style={{ animationDelay: '0ms' }}>
        <button
          onClick={() => navigate(`/compare/${username2}/${username1}`)}
          className="px-4 py-2 text-sm font-medium bg-[#161B22] border border-[#30363D] rounded-lg text-[#8B949E] hover:border-[#58A6FF]/40 hover:text-[#58A6FF] transition-colors"
        >
          Swap users
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-sm font-medium bg-[#161B22] border border-[#30363D] rounded-lg text-[#8B949E] hover:border-[#58A6FF]/40 hover:text-[#58A6FF] transition-colors"
        >
          Edit
        </button>
        <Link
          to={`/user/${username1}`}
          className="text-sm text-[#58A6FF] hover:text-[#4C94E8] transition-colors"
        >
          @{username1} profile
        </Link>
        <Link
          to={`/user/${username2}`}
          className="text-sm text-[#58A6FF] hover:text-[#4C94E8] transition-colors"
        >
          @{username2} profile
        </Link>
      </div>

      {/* Side-by-side profiles */}
      <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
      <ComparisonLayout
        user1={user1}
        user2={user2}
        totalStars1={r1.totalStars}
        totalStars2={r2.totalStars}
      />
      </div>

      {/* Winner badges */}
      <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
      <WinnerBadges
        metrics={winnerMetrics}
        username1={user1.login}
        username2={user2.login}
      />
      </div>

      {/* Metric comparison chart */}
      <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
      <ComparisonBars
        user1={user1}
        user2={user2}
        totalStars1={r1.totalStars}
        totalStars2={r2.totalStars}
        activeDays1={e1.activeDays}
        activeDays2={e2.activeDays}
      />
      </div>

      {/* Language charts side by side */}
      <div className="animate-fade-up grid grid-cols-1 md:grid-cols-2 gap-6" style={{ animationDelay: '400ms' }}>
        <div>
          <p className="text-sm text-[#8B949E] mb-2 font-medium font-mono">@{user1.login}</p>
          <LanguageChart languages={r1.languages} />
        </div>
        <div>
          <p className="text-sm text-[#8B949E] mb-2 font-medium font-mono">@{user2.login}</p>
          <LanguageChart languages={r2.languages} />
        </div>
      </div>

      {/* Activity overlay chart */}
      {activityData.length > 0 && (
        <div className="animate-fade-up bg-[#161B22] rounded-lg border border-[#30363D] p-6" style={{ animationDelay: '500ms' }}>
          <h2 className="font-display text-lg font-semibold text-[#E6EDF3] mb-4">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={activityData}>
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#484F58' }} />
              <YAxis tick={{ fontSize: 12, fill: '#484F58' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1C2128',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#E6EDF3',
                }}
              />
              <Legend wrapperStyle={{ color: '#8B949E' }} />
              <Area
                type="monotone"
                dataKey={user1.login}
                stroke="#58A6FF"
                fill="#58A6FF"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey={user2.login}
                stroke="#3FB950"
                fill="#3FB950"
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
