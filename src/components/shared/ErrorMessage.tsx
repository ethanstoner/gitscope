import { useNavigate } from 'react-router-dom';

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const navigate = useNavigate();

  if (error === 'NOT_FOUND') {
    return (
      <div className="flex justify-center py-16">
        <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6 max-w-md w-full text-center space-y-3">
          <h2 className="text-xl font-semibold text-[#e6edf3]">User not found</h2>
          <p className="text-sm text-[#8b949e]">
            The GitHub user you searched for doesn't exist. Check the spelling and try again.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-2 text-sm text-[#58a6ff] hover:underline transition-colors duration-150"
          >
            &larr; Back to search
          </button>
        </div>
      </div>
    );
  }

  if (error === 'RATE_LIMITED') {
    return (
      <div className="flex justify-center py-16">
        <div className="bg-[#161b22] border border-[#d29922]/50 rounded-md p-6 max-w-md w-full text-center space-y-3">
          <h2 className="text-xl font-semibold text-[#d29922]">Rate Limited</h2>
          <p className="text-sm text-[#8b949e]">
            You've exceeded GitHub's API rate limit. Add a personal access token to get 5,000 requests/hour.
          </p>
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#58a6ff] hover:underline inline-block transition-colors duration-150"
          >
            Create a token on GitHub &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-16">
      <div className="bg-[#161b22] border border-[#f85149]/50 rounded-md p-6 max-w-md w-full text-center space-y-3">
        <h2 className="text-xl font-semibold text-[#f85149]">Something went wrong</h2>
        <p className="text-sm text-[#8b949e]">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 px-4 py-2 text-sm bg-[#21262d] text-[#c9d1d9] font-medium rounded-md border border-[rgba(240,246,252,0.1)] hover:bg-[#30363d] hover:border-[#8b949e] transition-colors duration-150"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
