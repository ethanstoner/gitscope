import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { GitHubUser } from '../../utils/types';
import { getAccountAgeDays } from '../../utils/dateUtils';

interface ComparisonBarsProps {
  user1: GitHubUser;
  user2: GitHubUser;
  totalStars1: number;
  totalStars2: number;
  activeDays1: number;
  activeDays2: number;
}

export default function ComparisonBars({
  user1,
  user2,
  totalStars1,
  totalStars2,
  activeDays1,
  activeDays2,
}: ComparisonBarsProps) {
  const ageYears1 = Math.round((getAccountAgeDays(user1.created_at) / 365) * 10) / 10;
  const ageYears2 = Math.round((getAccountAgeDays(user2.created_at) / 365) * 10) / 10;

  const data = [
    { metric: 'Public Repos', [user1.login]: user1.public_repos, [user2.login]: user2.public_repos },
    { metric: 'Stars', [user1.login]: totalStars1, [user2.login]: totalStars2 },
    { metric: 'Followers', [user1.login]: user1.followers, [user2.login]: user2.followers },
    { metric: 'Following', [user1.login]: user1.following, [user2.login]: user2.following },
    { metric: 'Account Age (yrs)', [user1.login]: ageYears1, [user2.login]: ageYears2 },
    { metric: 'Active Days (90d)', [user1.login]: activeDays1, [user2.login]: activeDays2 },
  ];

  return (
    <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4">
      <h2 className="text-base font-semibold text-[#e6edf3] mb-4">Metric Comparison</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
          <XAxis type="number" tick={{ fontSize: 12, fill: '#8b949e' }} />
          <YAxis
            type="category"
            dataKey="metric"
            width={130}
            tick={{ fontSize: 12, fill: '#8b949e' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#e6edf3',
            }}
          />
          <Legend wrapperStyle={{ color: '#8b949e' }} />
          <Bar dataKey={user1.login} fill="#58a6ff" radius={[0, 4, 4, 0]} />
          <Bar dataKey={user2.login} fill="#3fb950" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
