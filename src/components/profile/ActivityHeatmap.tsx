import { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import type { HeatmapDay } from '../../utils/types';

interface ActivityHeatmapProps {
  heatmap: HeatmapDay[];
}

const CELL_SIZE = 11;
const GAP = 2;
// GitHub's exact 5-level contribution colors (dark mode)
const COLORS = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

function getColor(count: number): string {
  if (count === 0) return COLORS[0];
  if (count <= 1) return COLORS[1];
  if (count <= 3) return COLORS[2];
  if (count <= 6) return COLORS[3];
  return COLORS[4];
}

function formatDateLabel(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export default function ActivityHeatmap({ heatmap }: ActivityHeatmapProps) {
  const { grid, monthLabels } = useMemo(() => {
    const lookup = new Map<string, number>();
    for (const d of heatmap) {
      lookup.set(d.date, d.count);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 90);

    const cells: {
      date: Date;
      dateStr: string;
      count: number;
      col: number;
      row: number;
    }[] = [];

    const gridStart = new Date(startDate);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay());

    const cur = new Date(gridStart);
    let col = 0;
    const months: { label: string; col: number }[] = [];
    let lastMonth = -1;

    while (cur <= today) {
      const row = cur.getDay();
      if (row === 0 && col > 0) col++;

      const key = cur.toISOString().slice(0, 10);
      const count = lookup.get(key) ?? 0;

      if (cur.getMonth() !== lastMonth) {
        months.push({
          label: cur.toLocaleDateString('en-US', { month: 'short' }),
          col: row === 0 ? col : col,
        });
        lastMonth = cur.getMonth();
      }

      if (cur >= startDate) {
        cells.push({ date: new Date(cur), dateStr: key, count, col, row });
      }

      cur.setDate(cur.getDate() + 1);
    }

    return { grid: cells, monthLabels: months };
  }, [heatmap]);

  const maxCol = grid.reduce((m, c) => Math.max(m, c.col), 0);
  const labelWidth = 30;
  const topOffset = 16;
  const svgWidth = labelWidth + (maxCol + 1) * (CELL_SIZE + GAP) + GAP;
  const svgHeight = topOffset + 7 * (CELL_SIZE + GAP) + GAP;

  return (
    <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4">
      <h2 className="text-base font-semibold text-[#e6edf3] mb-3">Activity (90 days)</h2>

      <div className="overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="block">
          {monthLabels.map((m, i) => (
            <text
              key={i}
              x={labelWidth + m.col * (CELL_SIZE + GAP)}
              y={10}
              fontSize={10}
              fill="#8b949e"
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif"
            >
              {m.label}
            </text>
          ))}

          {DAY_LABELS.map((label, i) =>
            label ? (
              <text
                key={i}
                x={0}
                y={topOffset + i * (CELL_SIZE + GAP) + CELL_SIZE - 2}
                fontSize={9}
                fill="#8b949e"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif"
              >
                {label}
              </text>
            ) : null
          )}

          {grid.map((cell) => (
            <rect
              key={cell.dateStr}
              x={labelWidth + cell.col * (CELL_SIZE + GAP)}
              y={topOffset + cell.row * (CELL_SIZE + GAP)}
              width={CELL_SIZE}
              height={CELL_SIZE}
              rx={2}
              fill={getColor(cell.count)}
              data-tooltip-id="heatmap-tooltip"
              data-tooltip-content={`${cell.count} contribution${cell.count !== 1 ? 's' : ''} on ${formatDateLabel(cell.date)}`}
              className="cursor-pointer outline-none"
              style={{ outlineOffset: '-1px' }}
            />
          ))}
        </svg>
      </div>

      <Tooltip
        id="heatmap-tooltip"
        style={{
          backgroundColor: '#1c2128',
          border: '1px solid #30363d',
          borderRadius: '6px',
          color: '#e6edf3',
          fontSize: '12px',
          padding: '6px 10px',
        }}
      />

      {/* Legend — matches GitHub exactly */}
      <div className="flex items-center gap-1 mt-2 text-xs text-[#8b949e] justify-end">
        <span>Less</span>
        {COLORS.map((c, i) => (
          <span
            key={i}
            className="inline-block w-[10px] h-[10px] rounded-sm"
            style={{ backgroundColor: c }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
