import { useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import type { GitHubEvent, HeatmapDay } from '../../utils/types';
import { getDayKey } from '../../utils/dateUtils';

interface ActivityHeatmapProps {
  heatmap: HeatmapDay[];
  events: GitHubEvent[];
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

function formatDateFull(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatDateShort(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const EVENT_LABELS: Record<string, string> = {
  PushEvent: 'Pushed to',
  CreateEvent: 'Created',
  PullRequestEvent: 'Pull request on',
  PullRequestReviewEvent: 'Reviewed PR on',
};

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export default function ActivityHeatmap({ heatmap, events }: ActivityHeatmapProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  // Get events for selected date
  const selectedEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter(e => getDayKey(e.created_at) === selectedDate);
  }, [selectedDate, events]);

  const selectedDateObj = selectedDate ? new Date(selectedDate + 'T00:00:00') : null;

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
              stroke={selectedDate === cell.dateStr ? '#58a6ff' : 'none'}
              strokeWidth={selectedDate === cell.dateStr ? 2 : 0}
              data-tooltip-id="heatmap-tooltip"
              data-tooltip-content={`${cell.count} contribution${cell.count !== 1 ? 's' : ''} on ${formatDateShort(cell.date)}`}
              className="cursor-pointer outline-none"
              onClick={() => setSelectedDate(selectedDate === cell.dateStr ? null : cell.dateStr)}
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

      {/* Legend */}
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

      {/* Detail panel — shown when a day is clicked */}
      {selectedDate && selectedDateObj && (
        <div className="mt-4 border-t border-[#21262d] pt-4 animate-fade-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#e6edf3]">
              {formatDateFull(selectedDateObj)}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-[#8b949e] hover:text-[#e6edf3] text-xs transition-colors"
            >
              Close
            </button>
          </div>

          {selectedEvents.length === 0 ? (
            <p className="text-xs text-[#8b949e]">No activity on this day.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedEvents.map((event) => {
                const repoName = event.repo.name.split('/').pop() || event.repo.name;
                const label = EVENT_LABELS[event.type] || event.type;
                const time = new Date(event.created_at).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                });
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 text-xs p-2 rounded-md bg-[#0d1117] border border-[#21262d]"
                  >
                    {/* Event type icon */}
                    <div className="mt-0.5 text-[#8b949e] flex-shrink-0">
                      {event.type === 'PushEvent' && (
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25ZM6 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
                        </svg>
                      )}
                      {event.type === 'CreateEvent' && (
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                        </svg>
                      )}
                      {event.type === 'PullRequestEvent' && (
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" />
                        </svg>
                      )}
                      {event.type === 'PullRequestReviewEvent' && (
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M1.5 2.75a.25.25 0 0 1 .25-.25h8.5a.25.25 0 0 1 .25.25v5.5a.25.25 0 0 1-.25.25h-3.5a.75.75 0 0 0-.53.22L3.5 11.44V9.25a.75.75 0 0 0-.75-.75h-1a.25.25 0 0 1-.25-.25Zm.25-1.75A1.75 1.75 0 0 0 0 2.75v5.5C0 9.216.784 10 1.75 10H2v1.543a1.458 1.458 0 0 0 2.487 1.03L7.061 10h3.189A1.75 1.75 0 0 0 12 8.25v-5.5A1.75 1.75 0 0 0 10.25 1ZM12.5 6.5a.75.75 0 0 1 .75-.75h1A1.75 1.75 0 0 1 16 7.5v5.5A1.75 1.75 0 0 1 14.25 14H14v1.543a1.457 1.457 0 0 1-2.487 1.03L8.939 14H8.75a.75.75 0 0 1 0-1.5h.564L11.78 14.85a.25.25 0 0 0 .22.15.25.25 0 0 0 .25-.25V13.25a.75.75 0 0 1 .75-.75h1.25a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-1a.75.75 0 0 1-.75-.75Z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[#8b949e]">{label} </span>
                      <a
                        href={`https://github.com/${event.repo.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#58a6ff] hover:underline font-semibold"
                      >
                        {repoName}
                      </a>
                    </div>
                    <span className="text-[#6e7681] flex-shrink-0">{time}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
