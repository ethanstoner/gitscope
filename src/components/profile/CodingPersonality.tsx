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
    <div className="bg-violet-50 rounded-xl border border-violet-200 p-6">
      <div className="text-3xl mb-3">&#129504;</div>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Coding Personality</h2>
      <p className="text-lg italic text-violet-800 leading-relaxed">{personality}</p>
    </div>
  );
}
