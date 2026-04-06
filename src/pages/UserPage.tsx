import { useParams } from 'react-router-dom';
import { useGitHubUser } from '../hooks/useGitHubUser';
import { useGitHubRepos } from '../hooks/useGitHubRepos';
import { useGitHubEvents } from '../hooks/useGitHubEvents';
import ProfileHeader from '../components/profile/ProfileHeader';
import LanguageChart from '../components/profile/LanguageChart';
import RepoCards from '../components/profile/RepoCards';
import ActivityHeatmap from '../components/profile/ActivityHeatmap';
import ActivityChart from '../components/profile/ActivityChart';
import CodingPersonality from '../components/profile/CodingPersonality';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';

export default function UserPage() {
  const { username } = useParams<{ username: string }>();
  const { user, loading: userLoading, error: userError } = useGitHubUser(username);
  const { repos, languages, totalStars, loading: reposLoading } = useGitHubRepos(username);
  const { heatmap, weeklyActivity, activeDays, loading: eventsLoading, skipped } = useGitHubEvents(username);

  const loading = userLoading || reposLoading || eventsLoading;

  if (loading && !user) return <LoadingSpinner />;
  if (userError) return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <ErrorMessage error={userError} onRetry={() => window.location.reload()} />
    </div>
  );
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <ProfileHeader user={user} totalStars={totalStars} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LanguageChart languages={languages} />
        <CodingPersonality
          user={user}
          languages={languages}
          totalStars={totalStars}
          activeDays={activeDays}
        />
      </div>

      <RepoCards repos={repos} />

      {skipped ? (
        <div className="bg-white rounded-xl border border-black/8 p-6 text-center text-gray-400 text-sm">
          Activity data unavailable — add a token for full analysis
        </div>
      ) : (
        <>
          <ActivityHeatmap heatmap={heatmap} />
          <ActivityChart weeklyActivity={weeklyActivity} />
        </>
      )}
    </div>
  );
}
