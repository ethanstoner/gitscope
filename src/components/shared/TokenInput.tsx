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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-[#161b22] rounded-md border border-[#30363d] w-full max-w-md mx-4 p-6 space-y-4 animate-fade-up">
        <h2 className="text-base font-semibold text-[#e6edf3]">GitHub Token</h2>
        <p className="text-sm text-[#8b949e]">
          Add a GitHub personal access token for 5,000 requests/hour instead of 60.
        </p>
        <a
          href="https://github.com/settings/tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#58a6ff] hover:underline inline-block"
        >
          Create a token on GitHub &rarr;
        </a>

        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          className="w-full px-3 py-2 rounded-md border border-[#30363d] bg-[#0d1117] text-[#e6edf3] placeholder:text-[#6e7681] focus:outline-none focus:border-[#58a6ff] transition-colors duration-150 font-mono text-sm"
          autoFocus
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-sm text-[#c9d1d9] bg-[#21262d] border border-[rgba(240,246,252,0.1)] rounded-md hover:bg-[#30363d] hover:border-[#8b949e] transition-colors duration-150"
          >
            Clear Token
          </button>
          <button
            onClick={handleClose}
            className="px-3 py-1.5 text-sm text-[#c9d1d9] bg-[#21262d] border border-[rgba(240,246,252,0.1)] rounded-md hover:bg-[#30363d] hover:border-[#8b949e] transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm bg-[#238636] text-white font-medium rounded-md hover:bg-[#2ea043] transition-colors duration-150"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
