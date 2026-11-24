/**
 * The Chibi study-guide's brain. Plain TypeScript, no React, so it is easy to test.
 *
 * It answers in short "pages" of text (like a Pokemon dialog box), can suggest
 * what to study or which quiz to take (once features provide that data, see
 * useStudyState.ts), and can find any page from a loose question and open it.
 * Pages come from the registry in shared/features.ts.
 */
import { placesForRole, type Feature } from '../features';

export interface Target {
  title: string;
  /** one line on why this is next */
  why?: string;
  to: string;
}

export interface Item {
  label: string;
  to: string;
  /** lower-case words that find it, e.g. ['periodic', 'table'] */
  words: string[];
}

export interface StudyState {
  name: string;
  role: string;
  nextLesson: Target | null;
  nextQuiz: Target | null;
  items: Item[];
  unread: number;
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

const open = (to: string, label: string) => ({ to, label });

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
  const c: Choice[] = [];
  if (s.nextLesson) c.push({ label: 'What should I study?', query: 'what should i study' });
  if (s.nextQuiz) c.push({ label: 'Which quiz now?', query: 'which quiz' });
  c.push({ label: "I'm lost, help!", query: "i'm lost" }, { label: 'Change my looks', query: 'profile' });
  return c;
}

const lostChoices = (s: StudyState): Choice[] =>
  placesForRole(s.role)
    .filter((p) => p.id !== 'home')
    .slice(0, 5)
    .map((p) => ({ label: p.label, to: p.to }));

export function greet(s: StudyState): GuideReply {
  const first = s.name.split(' ')[0] || 'friend';
  const lines = [`${hourGreeting()}, ${first}! I am here to guide you.`];
  if (s.nextLesson) lines.push(`Today I suggest: ${s.nextLesson.title}.`);
  else if (s.nextQuiz) lines.push(`A quiz is waiting: ${s.nextQuiz.title}.`);
  lines.push('What would you like to do?');
  return { lines, choices: rootChoices(s) };
}

export function proactiveTip(s: StudyState): Tip | null {
  if (s.nextQuiz) return { text: `Quiz time: ${s.nextQuiz.title}`, query: 'which quiz' };
  if (s.nextLesson) return { text: 'I know what to study next!', query: 'what should i study' };
  return null;
}

/* ------------------------------------------------------------- language */

const STOP = new Set(
  "the and for with from that this what which where when how can could would should please open show take find get want need give tell let lets let's him her you your yours our out into onto just some any about have has had are was were been being not but all new one two its it's i'm im ive too now then than them they their there here page screen thing stuff me my mine myself".split(' '),
);

const tokens = (q: string) => (q.toLowerCase().match(/[\p{L}\p{M}\p{N}']+/gu) ?? []).map((t) => t.replace(/'/g, ''));
const nonAscii = (s: string) => /[^\u0000-\u007f]/.test(s);

function hit(q: string, toks: string[], kw: string): boolean {
  if (nonAscii(kw)) return q.includes(kw);
  return toks.some((t) => t === kw || (kw.length >= 4 && t.startsWith(kw)));
}

const INTENT_WORDS = {
  next: ['start', 'begin', 'study', 'learn', 'lesson', 'lessons', 'next', 'porbo', 'পড়ব', 'পড়া', 'শুরু'],
  quiz: ['quiz', 'quizzes', 'test', 'exam', 'কুইজ', 'পরীক্ষা'],
  which: ['which', 'what', 'next', 'take', 'should', 'need', 'needs', 'now', 'recommend', 'suggest'],
  lost: ['lost', 'confused', 'help', 'stuck', 'where', 'find', 'looking', 'হারিয়ে'],
  hello: ['hi', 'hello', 'hey', 'hola', 'salam', 'assalamu', 'nomoshkar', 'নমস্কার', 'সালাম'],
  thanks: ['thanks', 'thank', 'thx', 'shukriya', 'ধন্যবাদ'],
  bye: ['bye', 'goodbye', 'later'],
};

function itemMatches(q: string, s: StudyState): Item[] {
  const generic = new Set(placesForRole(s.role).flatMap((p) => p.keywords).concat(Object.values(INTENT_WORDS).flat()));
  const toks = tokens(q).filter((t) => t.length >= 4 && !STOP.has(t) && !generic.has(t));
  if (!toks.length) return [];
  const scored = s.items
    .map((e) => ({ e, score: toks.filter((t) => e.words.some((w) => w.startsWith(t) || t.startsWith(w))).length }))
    .filter((x) => x.score > 0);
  if (!scored.length) return [];
  const best = Math.max(...scored.map((x) => x.score));
  const seen = new Set<string>();
  return scored
    .filter((x) => x.score === best)
    .map((x) => x.e)
    .filter((e) => (seen.has(e.to) ? false : (seen.add(e.to), true)));
}

/* ---------------------------------------------------------------- answers */

export function answer(rawQuery: string, s: StudyState): GuideReply {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return greet(s);
  const toks = tokens(q);
  const has = (list: string[]) => list.some((kw) => hit(q, toks, kw));
  const places = placesForRole(s.role);

  if (has(INTENT_WORDS.thanks)) return { lines: ['You are welcome! Keep going, you are doing great.'], choices: rootChoices(s) };
  if (has(INTENT_WORDS.bye)) return { lines: ['Bye for now! Press Ctrl+M whenever you need me.'] };
  if (toks.length <= 3 && has(INTENT_WORDS.hello)) return greet(s);
  if (toks.join(' ').includes('what can you') || toks.join(' ') === 'help') {
    return {
      lines: ['I can find any page and open it for you.', 'I can tell you what to study and which quiz to take.', 'Try: "open profile" or "change my looks".'],
      choices: rootChoices(s),
    };
  }

  // 1) a specific thing the student named (a quiz topic, a plan...)
  const found = itemMatches(q, s);
  if (found.length === 1) return { lines: ['Found it!', found[0].label], open: open(found[0].to, found[0].label) };
  if (found.length > 1) return { lines: ['I found a few things. Which one?'], choices: found.slice(0, 4).map((e) => ({ label: e.label.slice(0, 28), to: e.to })) };

  // 2) "which quiz" / "what should I study"
  const mentionsQuiz = has(INTENT_WORDS.quiz);
  if (mentionsQuiz && has(INTENT_WORDS.which)) {
    if (s.nextQuiz) {
      const z = s.nextQuiz;
      return { lines: ['Take this quiz next:', z.title, ...(z.why ? [z.why] : [])], open: open(z.to, z.title) };
    }
    return { lines: ['No quiz is waiting for you yet!', 'Check back soon.'], choices: rootChoices(s) };
  }
  if (!mentionsQuiz && (has(INTENT_WORDS.next) || q.includes('what should i do') || (q.includes('what') && q.includes('now')))) {
    if (s.nextLesson) {
      const l = s.nextLesson;
      return { lines: ['Start with this lesson:', l.title, ...(l.why ? [l.why] : [])], open: open(l.to, l.title) };
    }
    return { lines: ['No lesson is assigned yet.', 'Your teacher or your plan will show it here.'], choices: rootChoices(s) };
  }

  // 3) a page of the app
  const scored = places
    .map((p: Feature) => ({ p, score: p.keywords.filter((kw) => hit(q, toks, kw)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  if (scored.length) {
    const p = scored[0].p;
    return { lines: [`Okay! ${p.blurb}`, `Opening ${p.label}.`], open: open(p.to, p.label) };
  }

  // 4) lost / unknown
  if (has(INTENT_WORDS.lost)) return { lines: ['No worries, I will help you find it.', 'Type what you need, or pick a place:'], choices: lostChoices(s) };
  return {
    lines: [`Hmm, I could not find "${rawQuery.trim().slice(0, 24)}".`, 'Try a page name, like profile or home.'],
    choices: lostChoices(s),
  };
}
