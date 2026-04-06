import { useState, useEffect, useCallback } from 'react';
import { setToken, getStoredToken } from '../../utils/api';

interface TokenInputProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TokenInput({ isOpen, onClose }: TokenInputProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setValue(getStoredToken() || '');
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  function handleSave() {
    const trimmed = value.trim();
    if (trimmed) {
      setToken(trimmed);
    }
    onClose();
  }

  function handleClear() {
    setToken(null);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-[#161B22] rounded-lg border border-[#30363D] w-full max-w-md mx-4 p-6 space-y-4 animate-fade-up">
        <h2 className="text-lg font-display font-semibold text-[#E6EDF3]">GitHub Token</h2>
        <p className="text-sm text-[#8B949E]">
          Add a GitHub personal access token for 5,000 requests/hour instead of 60.
        </p>
        <a
          href="https://github.com/settings/tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#58A6FF] hover:text-[#4C94E8] inline-block transition-colors duration-200"
        >
          Create a token on GitHub &rarr;
        </a>

        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          className="w-full px-4 py-2.5 rounded-lg border border-[#30363D] bg-white/4 text-[#E6EDF3] placeholder:text-[#8B949E] focus:outline-none focus:border-[#58A6FF]/50 focus:ring-1 focus:ring-[#58A6FF]/20 transition-all duration-200 font-mono text-sm"
          autoFocus
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-[#8B949E] hover:text-[#E6EDF3] rounded-lg hover:bg-white/4 transition-all duration-200"
          >
            Clear Token
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm text-[#8B949E] hover:text-[#E6EDF3] rounded-lg hover:bg-white/4 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-[#58A6FF] text-white font-semibold rounded-lg hover:bg-[#4C94E8] transition-all duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
