import { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { StudyState } from './guideBrain';

/**
 * What the guide knows about the student right now.
 *
 * Today it knows only the name and role. When teammates build the quiz, plan
 * or lesson features, fill the fields below from their data and the guide will
 * start saying "Start with this lesson" and "Take this quiz next" by itself:
 *
 *   nextLesson: { title: 'Polynomial practice', why: 'Next step of your plan', to: '/student/plans/3' }
 *   nextQuiz:   { title: 'Algebra quiz', why: '5 questions on a topic you missed', to: '/student/quizzes/7' }
 *   items:      every named thing the guide should be able to find by name
 *               ({ label: 'Periodic Table Trends', to: '/student/quizzes/9', words: ['periodic', 'table'] })
 *   unread:     how many new notifications
 */
export function useStudyState(): StudyState {
  const { user } = useAuth();
  return useMemo<StudyState>(
    () => ({
      name: user?.name ?? 'friend',
      role: user?.role ?? 'student',
      nextLesson: null,
      nextQuiz: null,
      items: [],
      unread: 0,
    }),
    [user?.name, user?.role],
  );
}
