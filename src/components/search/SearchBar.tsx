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
          placeholder="Enter a GitHub username"
          className="flex-1 px-4 py-2.5 rounded-lg border border-black/8 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 active:bg-violet-800 transition"
        >
          Analyze
        </button>
      </div>

      {showCompare && (
        <input
          type="text"
          value={compareUser}
          onChange={(e) => setCompareUser(e.target.value)}
          placeholder="Enter second GitHub username"
          className="w-full px-4 py-2.5 rounded-lg border border-black/8 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
        />
      )}

      <button
        type="button"
        onClick={() => setShowCompare(!showCompare)}
        className="text-sm text-violet-600 hover:text-violet-700 hover:underline transition"
      >
        {showCompare ? 'single user mode' : 'or compare two users'}
      </button>
    </form>
  );
}
