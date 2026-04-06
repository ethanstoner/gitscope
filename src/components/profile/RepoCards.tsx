import { useState, useMemo } from 'react';
import type { GitHubRepo } from '../../utils/types';
import { getLanguageColor } from '../../utils/languageColors';

interface RepoCardsProps {
  repos: GitHubRepo[];
}

type SortKey = 'stars' | 'forks' | 'size' | 'updated';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'stars', label: 'Stars' },
  { key: 'forks', label: 'Forks' },
  { key: 'size', label: 'Size' },
  { key: 'updated', label: 'Updated' },
];

export default function RepoCards({ repos }: RepoCardsProps) {
  const [sortBy, setSortBy] = useState<SortKey>('stars');

  const sorted = useMemo(() => {
    const copy = [...repos];
    switch (sortBy) {
      case 'stars':
        copy.sort((a, b) => b.stargazers_count - a.stargazers_count);
        break;
      case 'forks':
        copy.sort((a, b) => b.forks_count - a.forks_count);
        break;
      case 'size':
        copy.sort((a, b) => b.size - a.size);
        break;
      case 'updated':
        copy.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        break;
    }
    return copy.slice(0, 6);
  }, [repos, sortBy]);

  const username = repos[0]?.full_name.split('/')[0] ?? '';

  return (
    <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-base font-semibold text-[#e6edf3]">Top Repositories</h2>
        <div className="flex gap-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-150 ${
                sortBy === opt.key
                  ? 'bg-[#58a6ff]/15 text-[#58a6ff]'
                  : 'text-[#8b949e] hover:text-[#e6edf3]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sorted.map((repo) => (
          <div
            key={repo.id}
            className="border border-[#21262d] rounded-md p-3 hover:border-[#30363d] transition-colors duration-150"
          >
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-[#58a6ff] hover:underline truncate block"
            >
              {repo.name}
            </a>
            {repo.description && (
              <p className="text-xs text-[#8b949e] mt-1 line-clamp-2">
                {repo.description.length > 100
                  ? repo.description.slice(0, 100) + '...'
                  : repo.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-3 text-xs text-[#8b949e]">
              {repo.language && (
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: repo.language ? getLanguageColor(repo.language) : '#555' }}
                  />
                  {repo.language}
                </span>
              )}
              <span className="flex items-center gap-0.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="font-mono">{repo.stargazers_count.toLocaleString()}</span>
              </span>
              <span className="flex items-center gap-0.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="font-mono">{repo.forks_count.toLocaleString()}</span>
              </span>
              <span className="ml-auto">Updated {timeAgo(repo.updated_at)}</span>
            </div>
          </div>
        ))}
      </div>

      {username && (
        <div className="mt-4 text-center">
          <a
            href={`https://github.com/${username}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#58a6ff] hover:underline"
          >
            View all on GitHub &rarr;
          </a>
        </div>
      )}
    </div>
  );
}
