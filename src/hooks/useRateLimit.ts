import { useState, useEffect, useCallback } from 'react';
import { getRateLimit, isLiteMode } from '../utils/api';
import type { RateLimitInfo } from '../utils/types';

export function useRateLimit() {
  const [rateLimit, setRateLimit] = useState<RateLimitInfo>(getRateLimit());
  const [liteMode, setLiteMode] = useState(isLiteMode());

  const refresh = useCallback(() => {
    setRateLimit(getRateLimit());
    setLiteMode(isLiteMode());
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { rateLimit, liteMode, refresh };
}
