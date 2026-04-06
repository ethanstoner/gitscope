import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const isHome = location.pathname === '/' || location.hash === '#/' || location.hash === '';

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
    remaining > 30 ? 'bg-[#3fb950]' : remaining > 10 ? 'bg-[#d29922]' : 'bg-[#f85149]';

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#161b22] border-b border-[#21262d] px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/" className="shrink-0 group flex items-center">
            <span className="text-base font-semibold text-white group-hover:text-[#58a6ff] transition-colors duration-150">
              GitScope
            </span>
          </Link>

          {/* Only show header search on non-home pages */}
          {!isHome && (
            <form onSubmit={handleSearch} className="flex-1 max-w-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search GitHub user..."
                className="w-full px-3 py-1.5 text-sm rounded-md border border-[#30363d] bg-[#0d1117] text-[#e6edf3] placeholder:text-[#6e7681] focus:outline-none focus:border-[#58a6ff] transition-colors duration-150"
              />
            </form>
          )}

          {/* Spacer when search is hidden */}
          {isHome && <div className="flex-1" />}

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-2" title={`${remaining} requests remaining`}>
              <div className={`w-2 h-2 rounded-full ${dotColor}`} />
              <span className="text-xs font-mono text-[#8b949e] hidden sm:inline">{remaining}</span>
            </div>

            <button
              onClick={handleRefresh}
              title="Clear cache & refresh"
              className="p-1.5 text-[#8b949e] hover:text-[#e6edf3] rounded-md hover:bg-[#21262d] transition-colors duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>

            <button
              onClick={() => setTokenOpen(true)}
              title="API token settings"
              className="p-1.5 text-[#8b949e] hover:text-[#e6edf3] rounded-md hover:bg-[#21262d] transition-colors duration-150"
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
