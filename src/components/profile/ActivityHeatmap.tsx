import { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import type { HeatmapDay } from '../../utils/types';

interface ActivityHeatmapProps {
  heatmap: HeatmapDay[];
}

const CELL_SIZE = 14;
const GAP = 3;
const COLORS = ['#ebedf0', '#c4b5fd', '#8b5cf6', '#6d28d9'];

function getColor(count: number): string {
  if (count === 0) return COLORS[0];
  if (count <= 2) return COLORS[1];
  if (count <= 5) return COLORS[2];
  return COLORS[3];
}

function formatDateLabel(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export default function ActivityHeatmap({ heatmap }: ActivityHeatmapProps) {
  const { grid, monthLabels } = useMemo(() => {
    // Build a lookup map
    const lookup = new Map<string, number>();
    for (const d of heatmap) {
      lookup.set(d.date, d.count);
    }

    // Build 91 days (13 weeks) ending today
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

    // Find the first Sunday on or before startDate to align the grid
    const gridStart = new Date(startDate);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay());

    const cur = new Date(gridStart);
    let col = 0;
    const months: { label: string; col: number }[] = [];
    let lastMonth = -1;

    while (cur <= today) {
      const row = cur.getDay(); // 0=Sun, 6=Sat
      if (row === 0 && col > 0) col++;

      const key = cur.toISOString().slice(0, 10);
      const count = lookup.get(key) ?? 0;

      // Track month labels
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
  const labelWidth = 32;
  const topOffset = 18;
  const svgWidth = labelWidth + (maxCol + 1) * (CELL_SIZE + GAP) + GAP;
  const svgHeight = topOffset + 7 * (CELL_SIZE + GAP) + GAP;

  return (
    <div className="bg-white rounded-xl border border-black/8 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity (90 days)</h2>

      <div className="overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="block">
          {/* Month labels */}
          {monthLabels.map((m, i) => (
            <text
              key={i}
              x={labelWidth + m.col * (CELL_SIZE + GAP)}
              y={12}
              fontSize={10}
              fill="#9ca3af"
            >
              {m.label}
            </text>
          ))}

          {/* Day labels */}
          {DAY_LABELS.map((label, i) =>
            label ? (
              <text
                key={i}
                x={0}
                y={topOffset + i * (CELL_SIZE + GAP) + CELL_SIZE - 2}
                fontSize={10}
                fill="#9ca3af"
              >
                {label}
              </text>
            ) : null
          )}

          {/* Cells */}
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
              data-tooltip-content={`${formatDateLabel(cell.date)}: ${cell.count} event${cell.count !== 1 ? 's' : ''}`}
              className="cursor-pointer"
            />
          ))}
        </svg>
      </div>

      <Tooltip id="heatmap-tooltip" />

      {/* Color legend */}
      <div className="flex items-center gap-1 mt-3 text-xs text-gray-400 justify-end">
        <span>Less</span>
        {COLORS.map((c, i) => (
          <span
            key={i}
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: c }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
