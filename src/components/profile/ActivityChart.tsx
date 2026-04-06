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
      <div className="bg-[#13151A] rounded-lg border border-white/6 p-6">
        <h2 className="font-display text-lg font-semibold text-[#E8E9ED] mb-4">Weekly Activity</h2>
        <p className="text-[#8B8F96] text-sm text-center py-8">No recent activity</p>
      </div>
    );
  }

  const data = weeklyActivity.map((w) => ({
    ...w,
    label: formatWeekLabel(w.week),
  }));

  return (
    <div className="bg-[#13151A] rounded-lg border border-white/6 p-6">
      <h2 className="font-display text-lg font-semibold text-[#E8E9ED] mb-4">Weekly Activity</h2>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5CE0D8" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#5CE0D8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#6B6F77' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6B6F77' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1D24',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#E8E9ED',
            }}
            formatter={(value: any) => [value, 'Events']}
            labelFormatter={(label: any) => `Week of ${label}`}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#5CE0D8"
            strokeWidth={2}
            fill="url(#areaFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
