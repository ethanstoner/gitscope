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

function formatNum(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return n.toLocaleString();
}

interface MetricRowProps {
  label: string;
  value1: number;
  value2: number;
  name1: string;
  name2: string;
}

function MetricRow({ label, value1, value2, name1, name2 }: MetricRowProps) {
  const max = Math.max(value1, value2, 1);
  const pct1 = (value1 / max) * 100;
  const pct2 = (value2 / max) * 100;
  const winner = value1 > value2 ? 1 : value2 > value1 ? 2 : 0;

  return (
    <div className="py-3 border-b border-[#21262d] last:border-b-0">
      <div className="text-xs text-[#8b949e] mb-2">{label}</div>
      {/* User 1 */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`text-xs font-mono w-16 text-right ${winner === 1 ? 'text-[#e6edf3] font-semibold' : 'text-[#8b949e]'}`}>
          {formatNum(value1)}
        </span>
        <div className="flex-1 h-4 bg-[#21262d] rounded-sm overflow-hidden">
          <div
            className="h-full rounded-sm transition-all duration-500"
            style={{ width: `${pct1}%`, backgroundColor: '#58a6ff' }}
          />
        </div>
        <span className={`text-[10px] w-20 truncate ${winner === 1 ? 'text-[#e6edf3]' : 'text-[#6e7681]'}`}>
          {name1}
        </span>
      </div>
      {/* User 2 */}
      <div className="flex items-center gap-2">
        <span className={`text-xs font-mono w-16 text-right ${winner === 2 ? 'text-[#e6edf3] font-semibold' : 'text-[#8b949e]'}`}>
          {formatNum(value2)}
        </span>
        <div className="flex-1 h-4 bg-[#21262d] rounded-sm overflow-hidden">
          <div
            className="h-full rounded-sm transition-all duration-500"
            style={{ width: `${pct2}%`, backgroundColor: '#3fb950' }}
          />
        </div>
        <span className={`text-[10px] w-20 truncate ${winner === 2 ? 'text-[#e6edf3]' : 'text-[#6e7681]'}`}>
          {name2}
        </span>
      </div>
    </div>
  );
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

  const metrics = [
    { label: 'Stars', value1: totalStars1, value2: totalStars2 },
    { label: 'Followers', value1: user1.followers, value2: user2.followers },
    { label: 'Public Repos', value1: user1.public_repos, value2: user2.public_repos },
    { label: 'Following', value1: user1.following, value2: user2.following },
    { label: 'Account Age (years)', value1: ageYears1, value2: ageYears2 },
    { label: 'Active Days (90d)', value1: activeDays1, value2: activeDays2 },
  ];

  return (
    <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold text-[#e6edf3]">Metric Comparison</h2>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#58a6ff]" />
            <span className="text-[#8b949e]">{user1.login}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#3fb950]" />
            <span className="text-[#8b949e]">{user2.login}</span>
          </span>
        </div>
      </div>

      {metrics.map((m) => (
        <MetricRow
          key={m.label}
          label={m.label}
          value1={m.value1}
          value2={m.value2}
          name1={user1.login}
          name2={user2.login}
        />
      ))}
    </div>
  );
}
