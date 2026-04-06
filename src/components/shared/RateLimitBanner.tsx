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
    <div className="bg-[#58A6FF]/10 border border-[#58A6FF]/20 text-[#58A6FF] px-4 py-3 flex items-center justify-between gap-4 text-sm">
      <div>
        <span className="font-semibold font-mono">{remaining} API requests remaining.</span>{' '}
        <span className="text-[#58A6FF]/80">Resets in {countdown}.</span>
      </div>
      <button
        onClick={onAddToken}
        className="shrink-0 px-3 py-1.5 bg-[#58A6FF] text-white text-xs font-semibold rounded-lg hover:bg-[#4C94E8] transition-all duration-200"
      >
        Add Token
      </button>
    </div>
  );
}
