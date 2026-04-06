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
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

function formatStars(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return n.toLocaleString();
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
      {/* Header with underline-style tabs like GitHub */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-[#e6edf3]">Top Repositories</h2>
      </div>

      {/* Sort tabs — GitHub underline style */}
      <div className="flex border-b border-[#21262d] mb-4">
        {sortOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors duration-150 ${
              sortBy === opt.key
                ? 'text-[#e6edf3] border-[#f78166]'
                : 'text-[#8b949e] border-transparent hover:text-[#e6edf3] hover:border-[#30363d]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((repo) => (
          <div
            key={repo.id}
            className="border border-[#30363d] rounded-md p-4"
          >
            {/* Repo icon + name */}
            <div className="flex items-center gap-2 mb-1">
              {/* GitHub repo icon */}
              <svg className="w-4 h-4 text-[#8b949e] flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
              </svg>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#58a6ff] hover:underline truncate"
              >
                {repo.name}
              </a>
              <span className="text-[10px] text-[#8b949e] border border-[#30363d] rounded-full px-1.5 py-px ml-auto flex-shrink-0">
                Public
              </span>
            </div>

            {/* Description */}
            {repo.description && (
              <p className="text-xs text-[#8b949e] mt-1 mb-3 line-clamp-2">
                {repo.description}
              </p>
            )}
            {!repo.description && <div className="mb-3" />}

            {/* Meta row — matches GitHub exactly */}
            <div className="flex items-center gap-4 text-xs text-[#8b949e]">
              {repo.language && (
                <span className="flex items-center gap-1">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                  />
                  {repo.language}
                </span>
              )}
              {repo.stargazers_count > 0 && (
                <span className="flex items-center gap-1 hover:text-[#58a6ff] cursor-pointer">
                  {/* GitHub star icon */}
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                  </svg>
                  {formatStars(repo.stargazers_count)}
                </span>
              )}
              {repo.forks_count > 0 && (
                <span className="flex items-center gap-1">
                  {/* GitHub fork icon */}
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
                  </svg>
                  {formatStars(repo.forks_count)}
                </span>
              )}
              <span className="ml-auto text-[#6e7681]">Updated {timeAgo(repo.updated_at)}</span>
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
            View all on GitHub →
          </a>
        </div>
      )}
    </div>
  );
}
