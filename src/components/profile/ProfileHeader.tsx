import { getAccountAge } from '../../utils/dateUtils';
import type { GitHubUser } from '../../utils/types';

interface ProfileHeaderProps {
  user: GitHubUser;
  totalStars: number;
}

export default function ProfileHeader({ user, totalStars }: ProfileHeaderProps) {
  const stats = [
    { label: 'Repos', value: user.public_repos, icon: repoIcon },
    { label: 'Followers', value: user.followers, icon: followersIcon },
    { label: 'Following', value: user.following, icon: followingIcon },
    { label: 'Stars', value: totalStars, icon: starIcon },
  ];

  return (
    <div className="bg-[#13151A] rounded-lg border border-white/6 p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-24 h-24 rounded-full ring-2 ring-[#F0B429]/30 flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          {/* Name + username */}
          <h1 className="font-display text-3xl font-bold text-[#E8E9ED] truncate">
            {user.name || user.login}
          </h1>
          <p className="font-mono text-[#7A7D85]">@{user.login}</p>

          {/* Bio */}
          {user.bio && (
            <p className="mt-2 text-[#7A7D85] text-sm leading-relaxed">{user.bio}</p>
          )}

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 mt-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 text-sm">
                <span className="w-4 h-4 text-[#F0B429]">{s.icon}</span>
                <span className="font-mono text-lg font-semibold text-[#E8E9ED]">{s.value.toLocaleString()}</span>
                <span className="text-[#4A4D55]">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Info row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-[#7A7D85]">
            {user.location && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {user.location}
              </span>
            )}
            {user.company && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {user.company}
              </span>
            )}
            {user.blog && (
              <a
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#F0B429] hover:text-[#E0A420] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
                </svg>
                {user.blog.replace(/^https?:\/\//, '')}
              </a>
            )}
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Member for {getAccountAge(user.created_at)}
            </span>
          </div>
        </div>

        {/* View on GitHub button */}
        <div className="flex-shrink-0 self-start">
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#7A7D85] border border-white/10 rounded-lg hover:border-[#F0B429]/40 hover:text-[#F0B429] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

/* Inline SVG icon elements */
const repoIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const followersIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const followingIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const starIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);
