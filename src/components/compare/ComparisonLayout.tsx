import type { GitHubUser } from '../../utils/types';

interface ComparisonLayoutProps {
  user1: GitHubUser;
  user2: GitHubUser;
  totalStars1: number;
  totalStars2: number;
}

function ProfileCard({ user, totalStars }: { user: GitHubUser; totalStars: number }) {
  return (
    <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-14 h-14 rounded-full ring-1 ring-[#30363d]"
        />
        <div>
          <h2 className="text-base font-semibold text-[#e6edf3]">
            {user.name || user.login}
          </h2>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono text-[#8b949e] hover:text-[#58a6ff] transition-colors duration-150"
          >
            @{user.login}
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatItem label="Repos" value={user.public_repos} />
        <StatItem label="Stars" value={totalStars} />
        <StatItem label="Followers" value={user.followers} />
        <StatItem label="Following" value={user.following} />
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-[#8b949e] uppercase tracking-wide">{label}</p>
      <p className="font-mono text-xl font-semibold text-[#e6edf3]">{value.toLocaleString()}</p>
    </div>
  );
}

export default function ComparisonLayout({
  user1,
  user2,
  totalStars1,
  totalStars2,
}: ComparisonLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProfileCard user={user1} totalStars={totalStars1} />
      <ProfileCard user={user2} totalStars={totalStars2} />
    </div>
  );
}
