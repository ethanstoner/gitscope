import { getCached, setCache } from './cache';
import type { RateLimitInfo } from './types';

let currentRateLimit: RateLimitInfo = { remaining: 60, limit: 60, resetAt: 0 };

export function getRateLimit(): RateLimitInfo {
  return { ...currentRateLimit };
}

function getToken(): string | null {
  return localStorage.getItem('gitscope:pat');
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem('gitscope:pat', token);
  } else {
    localStorage.removeItem('gitscope:pat');
  }
}

export function getStoredToken(): string | null {
  return getToken();
}

export function isLiteMode(): boolean {
  return currentRateLimit.remaining < 10 && !getToken();
}

export async function ghFetch<T>(
  endpoint: string,
  options: { skipCache?: boolean; signal?: AbortSignal } = {}
): Promise<T> {
  const { skipCache = false, signal } = options;
  const cacheKey = endpoint;
  if (!skipCache) {
    const cached = getCached<T>(cacheKey);
    if (cached !== null) return cached;
  }

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const res = await fetch(`https://api.github.com${endpoint}`, {
      headers,
      signal: controller.signal,
    });

    const remaining = res.headers.get('X-RateLimit-Remaining');
    const limit = res.headers.get('X-RateLimit-Limit');
    const reset = res.headers.get('X-RateLimit-Reset');
    if (remaining && limit && reset) {
      currentRateLimit = {
        remaining: parseInt(remaining, 10),
        limit: parseInt(limit, 10),
        resetAt: parseInt(reset, 10) * 1000,
      };
    }

    if (res.status === 404) {
      throw new Error('NOT_FOUND');
    }
    if (res.status === 403 && currentRateLimit.remaining === 0) {
      throw new Error('RATE_LIMITED');
    }
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = await res.json() as T;
    setCache(cacheKey, data);
    return data;
  } finally {
    clearTimeout(timeout);
  }
}
