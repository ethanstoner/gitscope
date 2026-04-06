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
      <div className="bg-white rounded-xl border border-black/8 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h2>
        <p className="text-gray-400 text-sm text-center py-8">No recent activity</p>
      </div>
    );
  }

  const data = weeklyActivity.map((w) => ({
    ...w,
    label: formatWeekLabel(w.week),
  }));

  return (
    <div className="bg-white rounded-xl border border-black/8 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h2>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#c4b5fd" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '8px',
              fontSize: '13px',
            }}
            formatter={(value: any) => [value, 'Events']}
            labelFormatter={(label: any) => `Week of ${label}`}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#7c3aed"
            strokeWidth={2}
            fill="url(#areaFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
