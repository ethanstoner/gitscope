import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [username, setUsername] = useState('');
  const [compareUser, setCompareUser] = useState('');
  const [showCompare, setShowCompare] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    if (showCompare) {
      const trimmed2 = compareUser.trim();
      if (!trimmed2) return;
      navigate(`/compare/${trimmed}/${trimmed2}`);
    } else {
      navigate(`/user/${trimmed}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter a GitHub username..."
          className="flex-1 px-5 py-4 text-lg rounded-lg border border-[#30363D] bg-white/4 text-[#E6EDF3] placeholder:text-[#8B949E] focus:outline-none focus:border-[#58A6FF]/50 focus:ring-1 focus:ring-[#58A6FF]/20 transition-all duration-200"
        />
        <button
          type="submit"
          className="px-6 py-4 bg-[#58A6FF] text-white font-semibold text-lg rounded-lg hover:bg-[#4C94E8] active:bg-[#3A85D6] transition-all duration-200"
        >
          Analyze
        </button>
      </div>

      {showCompare && (
        <input
          type="text"
          value={compareUser}
          onChange={(e) => setCompareUser(e.target.value)}
          placeholder="Enter second GitHub username..."
          className="w-full px-5 py-4 text-lg rounded-lg border border-[#30363D] bg-white/4 text-[#E6EDF3] placeholder:text-[#8B949E] focus:outline-none focus:border-[#58A6FF]/50 focus:ring-1 focus:ring-[#58A6FF]/20 transition-all duration-200 animate-fade-up"
        />
      )}

      <button
        type="button"
        onClick={() => setShowCompare(!showCompare)}
        className="text-sm text-[#8B949E] hover:text-[#58A6FF] transition-colors duration-200"
      >
        {showCompare ? 'single user mode' : 'or compare two users'}
      </button>
    </form>
  );
}
