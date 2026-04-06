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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-xl border border-black/8 shadow-lg w-full max-w-md mx-4 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">GitHub Token</h2>
        <p className="text-sm text-gray-500">
          Add a GitHub personal access token for 5,000 requests/hour instead of 60.
        </p>
        <a
          href="https://github.com/settings/tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-violet-600 hover:underline inline-block"
        >
          Create a token on GitHub &rarr;
        </a>

        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          className="w-full px-4 py-2.5 rounded-lg border border-black/8 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition font-mono text-sm"
          autoFocus
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition"
          >
            Clear Token
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
