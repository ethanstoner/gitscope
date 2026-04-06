import type { GitHubUser } from '../../utils/types';

interface ComparisonLayoutProps {
  user1: GitHubUser;
  user2: GitHubUser;
  totalStars1: number;
  totalStars2: number;
}

function ProfileCard({ user, totalStars }: { user: GitHubUser; totalStars: number }) {
  return (
    <div className="bg-[#161B22] rounded-lg border border-[#30363D] p-6">
      <div className="flex items-center gap-4 mb-5">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-16 h-16 rounded-full ring-2 ring-[#58A6FF]/30"
        />
        <div>
          <h2 className="text-lg font-semibold text-[#E6EDF3]">
            {user.name || user.login}
          </h2>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono text-[#8B949E] hover:text-[#58A6FF] transition-colors"
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
      <p className="text-xs text-[#8B949E] uppercase tracking-wide">{label}</p>
      <p className="font-mono text-xl font-semibold text-[#E6EDF3]">{value.toLocaleString()}</p>
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
