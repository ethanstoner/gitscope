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
    }));

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((b) => (
        <span
          key={b.label}
          className="bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/20 font-mono text-xs font-medium px-2 py-1 rounded-full"
        >
          @{b.winner}: More {b.label.toLowerCase()}
        </span>
      ))}
    </div>
  );
}
