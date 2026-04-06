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
      <div className="bg-[#13151A] rounded-lg border border-white/8 w-full max-w-md mx-4 p-6 space-y-4 animate-fade-up">
        <h2 className="text-lg font-display font-semibold text-[#E8E9ED]">GitHub Token</h2>
        <p className="text-sm text-[#9CA0A8]">
          Add a GitHub personal access token for 5,000 requests/hour instead of 60.
        </p>
        <a
          href="https://github.com/settings/tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#F0B429] hover:text-[#E0A420] inline-block transition-colors duration-200"
        >
          Create a token on GitHub &rarr;
        </a>

        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          className="w-full px-4 py-2.5 rounded-lg border border-white/8 bg-white/4 text-[#E8E9ED] placeholder:text-[#8B8F96] focus:outline-none focus:border-[#F0B429]/50 focus:ring-1 focus:ring-[#F0B429]/20 transition-all duration-200 font-mono text-sm"
          autoFocus
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-[#9CA0A8] hover:text-[#E8E9ED] rounded-lg hover:bg-white/4 transition-all duration-200"
          >
            Clear Token
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm text-[#9CA0A8] hover:text-[#E8E9ED] rounded-lg hover:bg-white/4 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-[#F0B429] text-[#0B0D11] font-semibold rounded-lg hover:bg-[#E0A420] transition-all duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
