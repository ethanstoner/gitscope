import { useMemo } from 'react';
import { getAccountAgeDays } from '../../utils/dateUtils';
import { generatePersonality } from '../../utils/personality';
import type { GitHubUser, LanguageStat, CodingPersonalityData } from '../../utils/types';

interface CodingPersonalityProps {
  user: GitHubUser;
  languages: LanguageStat[];
  totalStars: number;
  activeDays: number;
}

export default function CodingPersonality({
  user,
  languages,
  totalStars,
  activeDays,
}: CodingPersonalityProps) {
  const personality = useMemo(() => {
    const langCount =
      languages.length > 0 && languages[languages.length - 1].name === 'Other'
        ? languages.length - 1
        : languages.length;

    const data: CodingPersonalityData = {
      primaryLanguage: languages[0]?.name || 'None',
      languageCount: langCount,
      activityPattern: '',
      projectStyle: '',
      totalRepos: user.public_repos,
      totalStars,
      followers: user.followers,
      accountAgeDays: getAccountAgeDays(user.created_at),
      activeDays90d: activeDays,
    };

    return generatePersonality(data);
  }, [user, languages, totalStars, activeDays]);

  return (
    <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4">
      <h2 className="text-base font-semibold text-[#e6edf3] mb-3">Coding Personality</h2>
      <p className="text-sm text-[#8b949e] leading-relaxed">
        {personality}
      </p>
    </div>
  );
}
