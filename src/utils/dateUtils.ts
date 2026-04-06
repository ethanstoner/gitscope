export function getAccountAge(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const years = now.getFullYear() - created.getFullYear();
  const months = now.getMonth() - created.getMonth();
  const totalMonths = years * 12 + months;

  if (totalMonths < 1) return 'Less than a month';
  if (totalMonths < 12) return `${totalMonths} month${totalMonths === 1 ? '' : 's'}`;
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  if (m === 0) return `${y} year${y === 1 ? '' : 's'}`;
  return `${y} year${y === 1 ? '' : 's'}, ${m} month${m === 1 ? '' : 's'}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getDayKey(dateStr: string): string {
  return dateStr.slice(0, 10);
}

export function getWeekStart(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setUTCDate(diff);
  return monday.toISOString().slice(0, 10);
}

export function getAccountAgeDays(createdAt: string): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
}
