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
          className="flex-1 px-5 py-4 text-lg rounded-lg border border-white/8 bg-white/4 text-[#E8E9ED] placeholder:text-[#8B8F96] focus:outline-none focus:border-[#F0B429]/50 focus:ring-1 focus:ring-[#F0B429]/20 transition-all duration-200"
        />
        <button
          type="submit"
          className="px-6 py-4 bg-[#F0B429] text-[#0B0D11] font-semibold text-lg rounded-lg hover:bg-[#E0A420] active:bg-[#D09A1A] transition-all duration-200"
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
          className="w-full px-5 py-4 text-lg rounded-lg border border-white/8 bg-white/4 text-[#E8E9ED] placeholder:text-[#8B8F96] focus:outline-none focus:border-[#F0B429]/50 focus:ring-1 focus:ring-[#F0B429]/20 transition-all duration-200 animate-fade-up"
        />
      )}

      <button
        type="button"
        onClick={() => setShowCompare(!showCompare)}
        className="text-sm text-[#9CA0A8] hover:text-[#F0B429] transition-colors duration-200"
      >
        {showCompare ? 'single user mode' : 'or compare two users'}
      </button>
    </form>
  );
}
