import { useState, useEffect } from 'react';

interface RateLimitBannerProps {
  remaining: number;
  resetAt: number;
  onAddToken: () => void;
}

export default function RateLimitBanner({ remaining, resetAt, onAddToken }: RateLimitBannerProps) {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    function update() {
      const diff = Math.max(0, resetAt - Date.now());
      if (diff <= 0) {
        setCountdown('resetting soon...');
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCountdown(`${mins}m ${secs}s`);
    }

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [resetAt]);

  if (remaining >= 10) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 flex items-center justify-between gap-4 text-sm">
      <div>
        <span className="font-medium">{remaining} API requests remaining.</span>{' '}
        Resets in {countdown}.
      </div>
      <button
        onClick={onAddToken}
        className="shrink-0 px-3 py-1.5 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700 transition"
      >
        Add Token
      </button>
    </div>
  );
}
