import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { WeeklyActivity } from '../../utils/types';

interface ActivityChartProps {
  weeklyActivity: WeeklyActivity[];
}

function formatWeekLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ActivityChart({ weeklyActivity }: ActivityChartProps) {
  if (weeklyActivity.length === 0) {
    return (
      <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4">
        <h2 className="text-base font-semibold text-[#e6edf3] mb-4">Weekly Activity</h2>
        <p className="text-[#8b949e] text-sm text-center py-8">No recent activity</p>
      </div>
    );
  }

  const data = weeklyActivity.map((w) => ({
    ...w,
    label: formatWeekLabel(w.week),
  }));

  return (
    <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4">
      <h2 className="text-base font-semibold text-[#e6edf3] mb-4">Weekly Activity</h2>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#238636" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#238636" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#8b949e' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#8b949e' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#e6edf3',
            }}
            formatter={(value: any) => [value, 'Events']}
            labelFormatter={(label: any) => `Week of ${label}`}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#3fb950"
            strokeWidth={2}
            fill="url(#areaFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
