import { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTier } from '../hooks/useTier';
import { demoPendingApprovals, demoPlans, demoQuizzes, demoUnread, kidsCheckpoints, universityCheckpoints } from '../data/studyData';
import type { StudyState } from './guideBrain';

/**
 * What the guide knows about the student right now.
 * Today this is the same demo data the pages show. When the pages are wired to
 * the real API, fetch it here instead; the guide itself does not change.
 */
export function useStudyState(): StudyState {
  const { user } = useAuth();
  const [tier] = useTier(user?.tier);
  return useMemo<StudyState>(
    () => ({
      name: user?.name ?? 'friend',
      role: user?.role ?? 'student',
      quizzes: demoQuizzes,
      plans: demoPlans,
      checkpoints: tier === 'kids' ? kidsCheckpoints : universityCheckpoints,
      unread: demoUnread,
      pendingApprovals: demoPendingApprovals,
    }),
    [user?.name, user?.role, tier],
  );
}
