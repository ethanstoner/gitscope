interface Metric {
  label: string;
  value1: number;
  value2: number;
}

interface WinnerBadgesProps {
  metrics: Metric[];
  username1: string;
  username2: string;
}

export default function WinnerBadges({ metrics, username1, username2 }: WinnerBadgesProps) {
  const badges = metrics
    .filter((m) => m.value1 !== m.value2)
    .map((m) => ({
      label: m.label,
      winner: m.value1 > m.value2 ? username1 : username2,
      isUser1: m.value1 > m.value2,
    }));

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((b) => (
        <span
          key={b.label}
          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
            b.isUser1
              ? 'bg-[#21262d] text-[#58a6ff] border-[#30363d]'
              : 'bg-[#21262d] text-[#3fb950] border-[#30363d]'
          }`}
        >
          @{b.winner}: More {b.label.toLowerCase()}
        </span>
      ))}
    </div>
  );
}
