interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes

export function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`gitscope:${key}`);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > DEFAULT_TTL) {
      localStorage.removeItem(`gitscope:${key}`);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    localStorage.setItem(`gitscope:${key}`, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function clearCache(): void {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('gitscope:'));
  keys.forEach(k => localStorage.removeItem(k));
}
