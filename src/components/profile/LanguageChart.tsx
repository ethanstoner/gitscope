import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { LanguageStat } from '../../utils/types';

interface LanguageChartProps {
  languages: LanguageStat[];
}

export default function LanguageChart({ languages }: LanguageChartProps) {
  if (languages.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-black/8 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Languages</h2>
        <p className="text-gray-400 text-sm text-center py-8">No language data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-black/8 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Languages</h2>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={languages}
            dataKey="percentage"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            strokeWidth={0}
          >
            {languages.map((lang, i) => (
              <Cell key={i} fill={lang.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any, name: any) => [`${Number(value).toFixed(1)}%`, name]}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '8px',
              fontSize: '13px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 justify-center">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5 text-sm text-gray-600">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: lang.color }}
            />
            <span>{lang.name}</span>
            <span className="text-gray-400">{lang.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
