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
        <div className="bg-white border border-black/8 rounded-xl p-8 max-w-md w-full text-center space-y-3">
          <div className="text-4xl">🔍</div>
          <h2 className="text-xl font-semibold text-gray-900">User not found</h2>
          <p className="text-sm text-gray-500">
            The GitHub user you searched for doesn't exist. Check the spelling and try again.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-2 text-sm text-violet-600 hover:underline"
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
        <div className="bg-white border border-orange-200 rounded-xl p-8 max-w-md w-full text-center space-y-3">
          <div className="text-4xl">⏳</div>
          <h2 className="text-xl font-semibold text-orange-700">Rate Limited</h2>
          <p className="text-sm text-gray-600">
            You've exceeded GitHub's API rate limit. Add a personal access token to get 5,000 requests/hour.
          </p>
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-violet-600 hover:underline inline-block"
          >
            Create a token on GitHub &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-16">
      <div className="bg-white border border-red-200 rounded-xl p-8 max-w-md w-full text-center space-y-3">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-xl font-semibold text-red-700">Something went wrong</h2>
        <p className="text-sm text-gray-600">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 px-4 py-2 text-sm bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
