import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getRateLimit } from '../../utils/api';
import { clearCache } from '../../utils/cache';
import TokenInput from '../shared/TokenInput';
import RateLimitBanner from '../shared/RateLimitBanner';

export default function Header() {
  const [search, setSearch] = useState('');
  const [remaining, setRemaining] = useState(60);
  const [resetAt, setResetAt] = useState(0);
  const [tokenOpen, setTokenOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function poll() {
      const rl = getRateLimit();
      setRemaining(rl.remaining);
      setResetAt(rl.resetAt);
    }
    poll();
    const id = setInterval(poll, 2000);
    return () => clearInterval(id);
  }, []);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) return;
    navigate(`/user/${trimmed}`);
    setSearch('');
  }

  function handleRefresh() {
    clearCache();
    window.location.reload();
  }

  const dotColor =
    remaining > 30 ? 'bg-[#34D399]' : remaining > 10 ? 'bg-[#58A6FF]' : 'bg-[#F05252]';

  return (
    <>
      <header className="sticky top-0 bg-[#0D1117]/80 backdrop-blur-xl border-b border-[#30363D] z-50 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/" className="shrink-0 group flex items-center gap-0.5 transition-all duration-200">
            <span className="font-display italic text-lg font-semibold text-[#E6EDF3] group-hover:text-[#58A6FF] transition-colors duration-200">
              Git
            </span>
            <span className="font-display italic text-lg font-semibold text-[#E6EDF3] group-hover:text-[#58A6FF] transition-colors duration-200">
              Scope
            </span>
            <span className="text-[#58A6FF] text-lg leading-none ml-0.5">.</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search GitHub user..."
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-[#30363D] bg-white/4 text-[#E6EDF3] placeholder:text-[#8B949E] focus:outline-none focus:border-[#58A6FF]/50 focus:ring-1 focus:ring-[#58A6FF]/20 transition-all duration-200"
            />
          </form>

          <div className="flex items-center gap-3 shrink-0">
            {/* Rate limit dot */}
            <div className="flex items-center gap-1.5" title={`${remaining} requests remaining`}>
              <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
              <span className="text-xs font-mono text-[#8B949E] hidden sm:inline">{remaining}</span>
            </div>

            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              title="Clear cache & refresh"
              className="p-1.5 text-[#8B949E] hover:text-[#E6EDF3] rounded-lg hover:bg-white/4 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Settings / token button */}
            <button
              onClick={() => setTokenOpen(true)}
              title="API token settings"
              className="p-1.5 text-[#8B949E] hover:text-[#E6EDF3] rounded-lg hover:bg-white/4 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <RateLimitBanner remaining={remaining} resetAt={resetAt} onAddToken={() => setTokenOpen(true)} />
      <TokenInput isOpen={tokenOpen} onClose={() => setTokenOpen(false)} />
    </>
  );
}
