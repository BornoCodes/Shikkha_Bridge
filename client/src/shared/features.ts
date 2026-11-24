/**
 * THE FEATURE REGISTRY, the one file every teammate edits to plug a feature in.
 *
 * One entry here puts your feature in the top navigation AND teaches the Chibi
 * guide about it (so "open my quizzes" or "I'm lost" can find it and open it).
 * You still add the <Route> to App.tsx and your page under src/modules/<feature>/.
 *
 * Example:
 *   {
 *     id: 'absence',
 *     label: 'I was away',
 *     bn: 'অনুপস্থিত',
 *     to: '/student/absences',
 *     blurb: 'Tell me the days you were away and I will find what you missed.',
 *     keywords: ['absent', 'missed', 'away', 'flood', 'sick'],
 *     roles: ['student'],
 *     nav: true,
 *   }
 */
export type Role = 'student' | 'teacher' | 'admin';

export interface Feature {
  id: string;
  /** short English name (top bar and guide) */
  label: string;
  /** Bangla name (tooltip) */
  bn: string;
  to: string;
  /** one friendly sentence the guide says when it opens this page */
  blurb: string;
  /** words a student might type to find it (English, Bangla or romanized) */
  keywords: string[];
  /** who sees it; leave out for everyone */
  roles?: Role[];
  /** show in the top navigation (keep it to 5 items in total) */
  nav?: boolean;
}

// ---- built-in pages (do not remove) ---------------------------------------
export const HOME: Feature = {
  id: 'home',
  label: 'Home',
  bn: 'হোম',
  to: '/home',
  blurb: 'Your starting page.',
  keywords: ['home', 'main', 'start', 'dashboard', 'হোম'],
  nav: true,
};

export const PROFILE: Feature = {
  id: 'profile',
  label: 'My profile',
  bn: 'প্রোফাইল',
  to: '/profile',
  blurb: 'Dress up your character. You can change my looks too!',
  keywords: ['profile', 'avatar', 'character', 'dress', 'outfit', 'customize', 'customise', 'looks', 'mascot', 'chibi', 'প্রোফাইল'],
};

// ---- teammates: add your features below -----------------------------------
export const FEATURES: Feature[] = [];

export const ALL_PLACES: Feature[] = [HOME, ...FEATURES, PROFILE];

export const placesForRole = (role: string): Feature[] =>
  ALL_PLACES.filter((f) => !f.roles || f.roles.includes(role as Role));
