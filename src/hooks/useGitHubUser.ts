import { useState, useEffect } from 'react';
import { ghFetch } from '../utils/api';
import type { GitHubUser } from '../utils/types';

export function useGitHubUser(username: string | undefined) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    ghFetch<GitHubUser>(`/users/${username}`, { signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) setUser(data); })
      .catch(err => { if (!controller.signal.aborted) setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });

    return () => controller.abort();
  }, [username]);

  return { user, loading, error };
}
