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
    <div className="bg-[#F0B429]/10 border border-[#F0B429]/20 text-[#F0B429] px-4 py-3 flex items-center justify-between gap-4 text-sm">
      <div>
        <span className="font-semibold font-mono">{remaining} API requests remaining.</span>{' '}
        <span className="text-[#F0B429]/80">Resets in {countdown}.</span>
      </div>
      <button
        onClick={onAddToken}
        className="shrink-0 px-3 py-1.5 bg-[#F0B429] text-[#0B0D11] text-xs font-semibold rounded-lg hover:bg-[#E0A420] transition-all duration-200"
      >
        Add Token
      </button>
    </div>
  );
}
