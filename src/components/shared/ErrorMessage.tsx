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
        <div className="bg-[#13151A] border border-white/6 rounded-lg p-8 max-w-md w-full text-center space-y-3">
          <div className="text-4xl">&#x1F50D;</div>
          <h2 className="text-xl font-display font-semibold text-[#E8E9ED]">User not found</h2>
          <p className="text-sm text-[#7A7D85]">
            The GitHub user you searched for doesn't exist. Check the spelling and try again.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-2 text-sm text-[#F0B429] hover:text-[#E0A420] transition-colors duration-200"
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
        <div className="bg-[#13151A] border border-[#F0B429]/20 rounded-lg p-8 max-w-md w-full text-center space-y-3">
          <div className="text-4xl">&#x23F3;</div>
          <h2 className="text-xl font-display font-semibold text-[#F0B429]">Rate Limited</h2>
          <p className="text-sm text-[#7A7D85]">
            You've exceeded GitHub's API rate limit. Add a personal access token to get 5,000 requests/hour.
          </p>
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#F0B429] hover:text-[#E0A420] inline-block transition-colors duration-200"
          >
            Create a token on GitHub &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-16">
      <div className="bg-[#13151A] border border-[#F05252]/20 rounded-lg p-8 max-w-md w-full text-center space-y-3">
        <div className="text-4xl">&#x26A0;&#xFE0F;</div>
        <h2 className="text-xl font-display font-semibold text-[#F05252]">Something went wrong</h2>
        <p className="text-sm text-[#7A7D85]">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 px-4 py-2 text-sm bg-[#F0B429] text-[#0B0D11] font-semibold rounded-lg hover:bg-[#E0A420] transition-all duration-200"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
