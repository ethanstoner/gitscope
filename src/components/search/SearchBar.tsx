import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

type Mode = 'analyze' | 'compare';

export default function SearchBar() {
  const [mode, setMode] = useState<Mode>('analyze');
  const [username, setUsername] = useState('');
  const [compareUser, setCompareUser] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    if (mode === 'compare') {
      const trimmed2 = compareUser.trim();
      if (!trimmed2) return;
      navigate(`/compare/${trimmed}/${trimmed2}`);
    } else {
      navigate(`/user/${trimmed}`);
    }
  }

  return (
    <div className="w-full max-w-lg">
      {/* Tabs */}
      <div className="flex border-b border-[#21262d] mb-6">
        <button
          type="button"
          onClick={() => setMode('analyze')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px ${
            mode === 'analyze'
              ? 'text-[#e6edf3] font-semibold border-[#58a6ff]'
              : 'text-[#8b949e] border-transparent hover:text-[#e6edf3] hover:border-[#30363d]'
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Analyze
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMode('compare')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px ${
            mode === 'compare'
              ? 'text-[#e6edf3] font-semibold border-[#58a6ff]'
              : 'text-[#8b949e] border-transparent hover:text-[#e6edf3] hover:border-[#30363d]'
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Compare
          </span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-[#e6edf3] mb-1.5">
            {mode === 'compare' ? 'First user' : 'Username'}
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. torvalds"
            autoFocus
            className="w-full px-3 py-2 text-sm rounded-md border border-[#30363d] bg-[#0d1117] text-[#e6edf3] placeholder:text-[#6e7681] focus:outline-none focus:border-[#58a6ff] transition-colors duration-150"
          />
        </div>

        {mode === 'compare' && (
          <div className="animate-fade-up">
            <label className="block text-xs font-medium text-[#e6edf3] mb-1.5">
              Second user
            </label>
            <input
              type="text"
              value={compareUser}
              onChange={(e) => setCompareUser(e.target.value)}
              placeholder="e.g. octocat"
              className="w-full px-3 py-2 text-sm rounded-md border border-[#30363d] bg-[#0d1117] text-[#e6edf3] placeholder:text-[#6e7681] focus:outline-none focus:border-[#58a6ff] transition-colors duration-150"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-[#238636] text-white font-medium text-sm rounded-md hover:bg-[#2ea043] transition-colors duration-150"
        >
          {mode === 'compare' ? 'Compare users' : 'Analyze profile'}
        </button>
      </form>
    </div>
  );
}
