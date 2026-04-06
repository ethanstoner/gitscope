export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  size: number;
  updated_at: string;
  fork: boolean;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { id: number; name: string };
}

export interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface HeatmapDay {
  date: string;
  count: number;
}

export interface WeeklyActivity {
  week: string;
  count: number;
}

export interface RateLimitInfo {
  remaining: number;
  limit: number;
  resetAt: number;
}

export interface CodingPersonalityData {
  primaryLanguage: string;
  languageCount: number;
  activityPattern: string;
  projectStyle: string;
  totalRepos: number;
  totalStars: number;
  followers: number;
  accountAgeDays: number;
  activeDays90d: number;
}
