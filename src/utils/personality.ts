import type { CodingPersonalityData } from './types';

export function generatePersonality(data: CodingPersonalityData): string {
  const parts: string[] = [];

  if (data.languageCount === 0) {
    parts.push('No public code yet');
  } else if (data.languageCount === 1) {
    parts.push(`Dedicated ${data.primaryLanguage} developer`);
  } else if (data.languageCount <= 3) {
    parts.push(`${data.primaryLanguage} specialist with ${data.languageCount} languages`);
  } else {
    parts.push(`Polyglot coder — ${data.languageCount} languages, led by ${data.primaryLanguage}`);
  }

  if (data.activeDays90d >= 60) {
    parts.push('Consistent daily contributor');
  } else if (data.activeDays90d >= 30) {
    parts.push('Regular contributor');
  } else if (data.activeDays90d >= 10) {
    parts.push('Occasional burst coder');
  } else {
    parts.push('Quiet lately');
  }

  if (data.totalRepos > 50) {
    parts.push('Prolific creator with ' + data.totalRepos + ' repos');
  } else if (data.totalRepos > 20) {
    parts.push(data.totalRepos + ' repositories and counting');
  } else if (data.totalRepos > 5) {
    parts.push('Focused builder with ' + data.totalRepos + ' repos');
  } else {
    parts.push(data.totalRepos + ' public repos');
  }

  if (data.totalStars > 100) {
    parts.push(data.totalStars.toLocaleString() + ' total stars — well-known work');
  } else if (data.totalStars > 10) {
    parts.push(data.totalStars + ' stars across projects');
  }

  const years = Math.floor(data.accountAgeDays / 365);
  if (years >= 5) {
    parts.push('GitHub veteran (' + years + ' years)');
  } else if (years >= 2) {
    parts.push('Member for ' + years + ' years');
  }

  return parts.join('. ') + '.';
}
