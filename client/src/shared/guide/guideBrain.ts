/**
 * The Chibi guide's brain. Plain TypeScript, no React, so it is easy to test.
 *
 * It answers in short "pages" of text (like a Pokemon dialog box), can suggest
 * what to study or which quiz to take using the student's real study data,
 * and can find any screen from a loose question and open it.
 */
import type { PathCheckpoint } from '../types';
import type { DemoPlan, DemoQuiz } from '../data/studyData';

export interface StudyState {
  name: string;
  role: string;
  quizzes: DemoQuiz[];
  plans: DemoPlan[];
  checkpoints: PathCheckpoint[];
  unread: number;
  pendingApprovals: number;
}

export interface Choice {
  label: string;
  /** ask the guide this question... */
  query?: string;
  /** ...or open this page directly */
  to?: string;
}

export interface GuideReply {
  lines: string[];
  /** page to open on its own once the guide has finished talking */
  open?: { to: string; label: string };
  choices?: Choice[];
}

export interface Tip {
  text: string;
  query: string;
}

const isTeacher = (role: string) => role === 'teacher' || role === 'admin';

/* ------------------------------------------------------------------ places */

interface Place {
  id: string;
  label: string;
  to: string;
  blurb: string;
  keywords: string[];
  teacherToo?: boolean;
  teacherOnly?: boolean;
  teacherTo?: string;
}

const PLACES: Place[] = [
  { id: 'home', label: 'Home', to: '/student/dashboard', teacherTo: '/teacher/dashboard', teacherToo: true, blurb: 'Your starting page.', keywords: ['home', 'dashboard', 'main', 'হোম'] },
  { id: 'path', label: 'My Path', to: '/student/path', blurb: 'Your step-by-step learning path.', keywords: ['path', 'journey', 'course', 'checkpoint', 'map', 'level', 'progress', 'পথ'] },
  { id: 'absence', label: 'Report missed days', to: '/student/absences', blurb: 'Tell me the days you were away and I will find what you missed.', keywords: ['miss', 'missed', 'absent', 'absence', 'away', 'gap', 'gaps', 'flood', 'sick', 'fever', 'dengue', 'leave', 'অনুপস্থিত', 'ছুটি'] },
  { id: 'quiz', label: 'Quizzes', to: '/student/assessments', blurb: 'Short quizzes show which topics need work.', keywords: ['quiz', 'quizzes', 'test', 'exam', 'assessment', 'practice', 'কুইজ', 'পরীক্ষা'] },
  { id: 'plan', label: 'Catch-up plans', to: '/student/recovery-plans', blurb: 'Your catch-up plans, approved by teachers.', keywords: ['plan', 'plans', 'catch', 'recovery', 'recover', 'schedule', 'roadmap', 'পরিকল্পনা', 'প্ল্যান'] },
  { id: 'library', label: 'Library', to: '/student/content', teacherToo: true, blurb: 'Videos and study material.', keywords: ['library', 'video', 'videos', 'resource', 'resources', 'material', 'materials', 'pdf', 'watch', 'content', 'লাইব্রেরি', 'ভিডিও'] },
  { id: 'notes', label: 'Notes & tutors', to: '/university/notes', blurb: 'Share notes and find a student tutor.', keywords: ['note', 'notes', 'peer', 'tutor', 'tutors', 'exchange', 'share', 'নোট'] },
  { id: 'alerts', label: 'Notifications', to: '/notifications', teacherToo: true, blurb: 'Your alerts.', keywords: ['notification', 'notifications', 'alert', 'alerts', 'bell', 'inbox', 'বিজ্ঞপ্তি'] },
  { id: 'profile', label: 'My profile', to: '/profile', teacherToo: true, blurb: 'Dress up your character. You can change my looks too!', keywords: ['profile', 'avatar', 'character', 'dress', 'outfit', 'customize', 'customise', 'looks', 'mascot', 'chibi', 'প্রোফাইল'] },
  { id: 'approvals', label: 'Plan approvals', to: '/teacher/plans', teacherOnly: true, teacherToo: true, blurb: 'Plans waiting for your review.', keywords: ['approve', 'approval', 'approvals', 'review', 'pending'] },
];

function placesFor(role: string): Place[] {
  return PLACES.filter((p) => (isTeacher(role) ? p.teacherToo : !p.teacherOnly));
}
const placeTo = (p: Place, role: string) => (isTeacher(role) && p.teacherTo ? p.teacherTo : p.to);

/* ------------------------------------------------------------ study logic */

const SEVERITY_ORDER = { high: 0, medium: 1 } as const;
const DIFFICULTY_ORDER = { Easy: 0, Medium: 1, Hard: 2 } as const;

export function nextQuiz(s: StudyState): DemoQuiz | null {
  const pending = s.quizzes.filter((q) => q.status === 'pending');
  pending.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
  return pending[0] ?? null;
}

interface Lesson {
  title: string;
  why: string;
  to: string;
}

export function nextLesson(s: StudyState): Lesson | null {
  const plan = s.plans.find((p) => p.status === 'approved' && p.progress < 100);
  if (plan) return { title: plan.nextStep, why: `It is the next step of your "${plan.title}" plan.`, to: `/student/recovery-plans/${plan.id}` };
  const cp = s.checkpoints.find((c) => c.status === 'current');
  if (cp) return { title: cp.title, why: cp.duration ? `Takes about ${cp.duration}.` : 'It is your next checkpoint.', to: '/student/path' };
  return null;
}

const hourGreeting = (d = new Date()) => {
  const h = d.getHours();
  if (h < 5) return 'Shubho ratri';
  if (h < 12) return 'Shubho shokal';
  if (h < 17) return 'Shubho oporahno';
  if (h < 20) return 'Shubho shondhya';
  return 'Shubho ratri';
};

/* ----------------------------------------------------------------- menus */

export function rootChoices(s: StudyState): Choice[] {
  if (isTeacher(s.role)) {
    return [
      { label: 'Plans to approve', query: 'approvals' },
      { label: 'Open my home', query: 'home' },
      { label: "I'm lost", query: "i'm lost" },
    ];
  }
  return [
    { label: 'What should I study?', query: 'what should i study' },
    { label: 'Which quiz now?', query: 'which quiz' },
    { label: 'Plan my day', query: 'plan my day' },
    { label: "I'm lost, help!", query: "i'm lost" },
  ];
}

const lostChoices = (s: StudyState): Choice[] =>
  placesFor(s.role)
    .filter((p) => p.id !== 'home')
    .slice(0, 5)
    .map((p) => ({ label: p.label, to: placeTo(p, s.role) }));

export function greet(s: StudyState): GuideReply {
  const first = s.name.split(' ')[0] || 'friend';
  const lines = [`${hourGreeting()}, ${first}! I am here to guide you.`];
  if (isTeacher(s.role)) {
    lines.push(s.pendingApprovals ? `${s.pendingApprovals} plans are waiting for your review.` : 'No plans are waiting. All clear!');
  } else {
    const q = nextQuiz(s);
    const l = nextLesson(s);
    if (l) lines.push(`Today I suggest: ${l.title}.`);
    else if (q) lines.push(`A quiz is waiting: ${q.topic}.`);
    else lines.push('You are all caught up. Great job!');
  }
  lines.push('What would you like to do?');
  return { lines, choices: rootChoices(s) };
}

export function proactiveTip(s: StudyState): Tip | null {
  if (isTeacher(s.role)) return s.pendingApprovals ? { text: `${s.pendingApprovals} plans to review`, query: 'approvals' } : null;
  const q = nextQuiz(s);
  if (q && q.severity === 'high') return { text: `Quiz time: ${q.topic}`, query: 'which quiz' };
  const l = nextLesson(s);
  if (l) return { text: 'I know what to study next!', query: 'what should i study' };
  return q ? { text: `Try the ${q.subject} quiz`, query: 'which quiz' } : null;
}

/* ------------------------------------------------------------- language */

const STOP = new Set(
  'the and for with from that this what which where when how can could would should please open show take find get want need give tell let lets let\'s him her you your yours our out into onto just some any about have has had are was were been being not but all new one two its it\'s i\'m im ive too now then than them they their there here page screen thing stuff me my mine myself'.split(' '),
);

const tokens = (q: string) => (q.toLowerCase().match(/[\p{L}\p{M}\p{N}']+/gu) ?? []).map((t) => t.replace(/'/g, ''));
const nonAscii = (s: string) => /[^\u0000-\u007f]/.test(s);

function hit(q: string, toks: string[], kw: string): boolean {
  if (nonAscii(kw)) return q.includes(kw);
  return toks.some((t) => t === kw || (kw.length >= 4 && t.startsWith(kw)));
}

const INTENT_WORDS = {
  next: ['start', 'begin', 'study', 'learn', 'lesson', 'lessons', 'next', 'porbo', 'পড়ব', 'পড়া', 'শুরু'],
  today: ['today', 'agenda', 'routine'],
  lost: ['lost', 'confused', 'help', 'stuck', 'where', 'find', 'looking', 'হারিয়ে'],
  hello: ['hi', 'hello', 'hey', 'hola', 'salam', 'assalamu', 'সালাম', 'স্বাগতম'],
  thanks: ['thanks', 'thank', 'thx', 'shukriya', 'ধন্যবাদ'],
  bye: ['bye', 'goodbye', 'later'],
  what: ['can', 'do'],
};

interface Entity {
  kind: 'quiz' | 'plan' | 'lesson';
  label: string;
  to: string;
  words: string[];
}

function entities(s: StudyState): Entity[] {
  const generic = new Set(PLACES.flatMap((p) => p.keywords).concat(Object.values(INTENT_WORDS).flat()));
  const wordsOf = (...texts: (string | undefined)[]) =>
    [...new Set(texts.flatMap((t) => tokens(t ?? '')).filter((w) => w.length >= 4 && !STOP.has(w) && !generic.has(w)))];
  return [
    ...s.quizzes.map((q): Entity => ({ kind: 'quiz', label: q.topic, to: `/student/assessments/${q.id}`, words: wordsOf(q.topic, q.subject) })),
    ...s.plans.map((p): Entity => ({ kind: 'plan', label: p.title, to: `/student/recovery-plans/${p.id}`, words: wordsOf(p.title, p.disruption, p.teacher) })),
    ...s.checkpoints.map((c): Entity => ({ kind: 'lesson', label: c.title, to: '/student/path', words: wordsOf(c.title, c.titleBn) })),
  ];
}

function entityMatches(q: string, s: StudyState): Entity[] {
  if (isTeacher(s.role)) return [];
  const toks = tokens(q).filter((t) => t.length >= 4 && !STOP.has(t));
  if (!toks.length) return [];
  const scored = entities(s)
    .map((e) => ({ e, score: toks.filter((t) => e.words.some((w) => w.startsWith(t) || t.startsWith(w))).length }))
    .filter((x) => x.score > 0);
  if (!scored.length) return [];
  const best = Math.max(...scored.map((x) => x.score));
  // the same target page can appear twice (several lessons on /student/path): keep one of each page
  const seen = new Set<string>();
  return scored
    .filter((x) => x.score === best)
    .map((x) => x.e)
    .filter((e) => (seen.has(e.to) ? false : (seen.add(e.to), true)));
}

/* ---------------------------------------------------------------- answers */

const open = (to: string, label: string) => ({ to, label });

export function answer(rawQuery: string, s: StudyState): GuideReply {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return greet(s);
  const toks = tokens(q);
  const has = (list: string[]) => list.some((kw) => hit(q, toks, kw));
  const teacher = isTeacher(s.role);

  if (has(INTENT_WORDS.thanks)) return { lines: ['You are welcome! Keep going, you are doing great.'], choices: rootChoices(s) };
  if (has(INTENT_WORDS.bye)) return { lines: ['Bye for now! Press Ctrl+M whenever you need me.'] };
  if (toks.length <= 3 && has(INTENT_WORDS.hello)) return greet(s);
  if (toks.join(' ').includes('what can you') || toks.join(' ') === 'help') {
    return {
      lines: [
        'I can tell you what to study and which quiz to take.',
        'Ask me to find any page and I will open it for you.',
        'Try: "open library", "my plan", or "change my looks".',
      ],
      choices: rootChoices(s),
    };
  }

  // 1) a specific thing the student named: a quiz topic, plan or lesson
  const found = entityMatches(q, s);
  if (found.length === 1) {
    const e = found[0];
    const kind = e.kind === 'quiz' ? 'quiz' : e.kind === 'plan' ? 'catch-up plan' : 'lesson';
    return { lines: [`Found it! The ${kind}:`, e.label], open: open(e.to, e.label) };
  }
  if (found.length > 1) {
    return { lines: ['I found a few things. Which one?'], choices: found.slice(0, 4).map((e) => ({ label: e.label.slice(0, 28), to: e.to })) };
  }

  // 2) "plan my day" and friends
  if (!teacher && (q.includes('my day') || has(INTENT_WORDS.today))) {
    const l = nextLesson(s);
    const quiz = nextQuiz(s);
    const lines = ['Here is your plan for today:'];
    let n = 1;
    if (l) lines.push(`${n++}. Learn: ${l.title}`);
    if (quiz) lines.push(`${n++}. Quiz: ${quiz.topic}`);
    lines.push(`${n}. Check your plan and say hi in Notes.`);
    return { lines, open: l ? open(l.to, 'your first step') : quiz ? open(`/student/assessments/${quiz.id}`, quiz.topic) : undefined, choices: rootChoices(s) };
  }

  // 3) "what should I study / which quiz"
  const mentionsQuiz = has(PLACES.find((p) => p.id === 'quiz')!.keywords);
  const asksWhich = has(['which', 'what', 'next', 'take', 'should', 'need', 'needs', 'now', 'recommend', 'suggest']);
  const wantsQuiz = mentionsQuiz && asksWhich;
  if (!teacher && (has(INTENT_WORDS.next) || (q.includes('what') && q.includes('now')) || q.includes('what should i do')) && !mentionsQuiz) {
    const l = nextLesson(s);
    if (!l) {
      const quiz = nextQuiz(s);
      return quiz
        ? { lines: ['No lesson is waiting.', `But a quiz is: ${quiz.topic}.`], open: open(`/student/assessments/${quiz.id}`, quiz.topic) }
        : { lines: ['You are all caught up! Maybe watch a video in the Library?'], open: open('/student/content', 'the Library') };
    }
    return { lines: ['Start with this lesson:', l.title, l.why], open: open(l.to, l.title) };
  }
  if (!teacher && wantsQuiz) {
    const quiz = nextQuiz(s);
    if (!quiz) {
      const last = [...s.quizzes].reverse().find((x) => x.status === 'completed');
      return { lines: ['No quiz is waiting for you!', last ? `Your last score was ${last.score}%. Nice work!` : 'Check back soon.'], choices: rootChoices(s) };
    }
    return {
      lines: ['Take this quiz next:', `${quiz.topic} (${quiz.subject})`, `${quiz.questions} questions, ${quiz.difficulty}. It covers a topic you missed.`],
      open: open(`/student/assessments/${quiz.id}`, quiz.topic),
    };
  }

  // 4) a place in the app
  const scored = placesFor(s.role)
    .map((p) => ({ p, score: p.keywords.filter((kw) => hit(q, toks, kw)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  if (scored.length) {
    const p = scored[0].p;
    const to = placeTo(p, s.role);
    if (p.id === 'approvals') {
      return { lines: [s.pendingApprovals ? `${s.pendingApprovals} plans are waiting for you.` : 'No plans are waiting right now.', p.blurb], open: open(to, p.label) };
    }
    if (p.id === 'plan') {
      const plan = s.plans.find((x) => x.status === 'approved' && x.progress < 100);
      return { lines: [plan ? `"${plan.title}" is ${plan.progress}% done.` : 'Let me show you your plans.', p.blurb], open: open(plan ? `/student/recovery-plans/${plan.id}` : to, p.label) };
    }
    if (p.id === 'alerts') {
      return { lines: [s.unread ? `You have ${s.unread} new alerts.` : 'No new alerts. Peaceful!', 'Opening them for you.'], open: open(to, p.label) };
    }
    return { lines: [`Okay! ${p.blurb}`, `Opening ${p.label}.`], open: open(to, p.label) };
  }

  // 5) lost / unknown
  if (has(INTENT_WORDS.lost)) {
    return { lines: ['No worries, I will help you find it.', 'Type what you need, or pick a place:'], choices: lostChoices(s) };
  }
  return {
    lines: [
      `Hmm, I could not find "${rawQuery.trim().slice(0, 24)}".`,
      teacher ? 'Try words like approvals, library, alerts, or profile.' : 'Try words like quiz, plan, library, notes, or profile.',
    ],
    choices: lostChoices(s),
  };
}
