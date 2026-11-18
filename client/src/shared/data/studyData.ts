/**
 * DEMO DATA, the single source of truth for what a student sees.
 *
 * The pages (Today, Quizzes, Catch-up, Path) and the Chibi guide all read from
 * here, so what the guide says always matches what is on screen.
 * When the pages are wired to the real API, replace the body of
 * `useStudyState()` (shared/guide/useStudyState.ts); nothing else has to change.
 */
import type { PathCheckpoint } from '../types';

export type Severity = 'high' | 'medium';

export interface DemoQuiz {
  id: string;
  topic: string;
  subject: string;
  questions: number;
  status: 'pending' | 'completed';
  score?: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  /** Quizzes on high-severity gaps are suggested first. */
  severity: Severity;
}

export interface DemoPlan {
  id: string;
  title: string;
  disruption: string;
  teacher: string;
  status: 'approved' | 'pending';
  progress: number;
  totalHours: number;
  completedSteps: number;
  totalSteps: number;
  date: string;
  /** What the student should do next inside this plan. */
  nextStep: string;
}

export const demoQuizzes: DemoQuiz[] = [
  { id: 'quiz-1', topic: 'Algebraic Polynomials & Factorization', subject: 'Mathematics', questions: 5, status: 'pending', difficulty: 'Medium', severity: 'high' },
  { id: 'quiz-2', topic: 'Newtonian Laws of Motion', subject: 'Physics', questions: 5, status: 'completed', score: 80, difficulty: 'Medium', severity: 'medium' },
  { id: 'quiz-3', topic: 'Periodic Table Trends', subject: 'Chemistry', questions: 5, status: 'pending', difficulty: 'Hard', severity: 'medium' },
];

export const demoPlans: DemoPlan[] = [
  {
    id: 'plan-nov-2026',
    title: 'Monsoon Flood Recovery',
    disruption: 'Sylhet flash flood',
    teacher: 'Mohammad Faruk Sir',
    status: 'approved',
    progress: 60,
    totalHours: 9.5,
    completedSteps: 3,
    totalSteps: 5,
    date: 'Nov 08, 2026',
    nextStep: 'Step 4: Polynomial factorization practice',
  },
  {
    id: 'plan-illness-recovery',
    title: 'Dengue Medical Catch-Up',
    disruption: 'Medical leave',
    teacher: 'Nasrin Sultana Madam',
    status: 'pending',
    progress: 25,
    totalHours: 6,
    completedSteps: 1,
    totalSteps: 4,
    date: 'Nov 14, 2026',
    nextStep: 'Waiting for your teacher to approve this plan',
  },
];

export const demoPendingApprovals = 2; // shown to teachers

export const universityCheckpoints: PathCheckpoint[] = [
  {
    id: 'cp-1',
    order: 1,
    type: 'video',
    title: 'Lecture 1: Binary Search Trees & Tree Traversal (14 mins)',
    duration: '14 mins',
    status: 'completed',
    points: 50,
    tutorTip: 'Pay attention to in-order traversal; it yields sorted keys in O(n)!',
  },
  {
    id: 'cp-2',
    order: 2,
    type: 'quiz',
    title: 'Diagnostic Quiz: BST Properties & Search Complexity',
    duration: '5 questions',
    status: 'completed',
    points: 75,
    quizQuestions: [
      {
        id: 'q1',
        question: 'What is the worst-case search time in an unbalanced Binary Search Tree?',
        options: ['O(log n)', 'O(n)', 'O(1)', 'O(n²)'],
        correctAnswer: 'O(n)',
        explanation: 'When keys are inserted in sorted order, the BST degenerates into a linear linked list of height n.',
      },
      {
        id: 'q2',
        question: 'Which traversal prints elements of a BST in ascending order?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
        correctAnswer: 'In-order',
        explanation: 'In-order traversal visits Left, Root, Right, producing strictly non-decreasing sequence.',
      },
    ],
    tutorTip: 'Remember edge cases where all elements are inserted in ascending order.',
  },
  {
    id: 'cp-3',
    order: 3,
    type: 'summary',
    title: 'AI High-Yield Summary & Mathematical Cheat-Sheet',
    duration: '3 mins read',
    status: 'current',
    points: 40,
    summaryContent:
      '📌 BST Core Summary for CSE220 Midterms:\n\n' +
      '• Height: h = floor(log2 n) for balanced; h = n-1 for degenerated.\n' +
      '• Search/Insert/Delete: Best/Average = O(log n), Worst = O(n).\n' +
      '• AVL Balance Factor: Height(Left) - Height(Right) ∈ {-1, 0, 1}.\n' +
      '• Rotations: LL, RR (Single Rotation) | LR, RL (Double Rotation).',
    tutorTip: 'Student Tutor Tanvir has verified these formula proofs for upcoming midterms.',
  },
  {
    id: 'cp-4',
    order: 4,
    type: 'assignment',
    title: 'Module Assignment 1: Balance Factor & Recurrence Proofs',
    duration: 'Solve 3 Problems',
    status: 'locked',
    points: 100,
    assignmentDetails: {
      title: 'BST Rebalance Problem Set',
      prompt:
        '1. Draw the AVL tree resulting from inserting {15, 20, 24, 10, 13, 7, 30, 36}.\n' +
        '2. State which rotations (LL/RR/LR/RL) occur.\n' +
        '3. Compute balance factors at each node.',
      dueDate: 'Sunday 11:59 PM',
      submissionFormat: 'PDF or Typed Solution',
    },
    tutorTip: 'Peer notes for this problem set are available in the University Notes Exchange.',
  },
];

export const kidsCheckpoints: PathCheckpoint[] = [
  {
    id: 'k-1',
    order: 1,
    type: 'video',
    title: 'Fun Cartoon Lesson: Meet the Number Forest! 🌳',
    duration: '8 mins',
    status: 'completed',
    points: 30,
    tutorTip: 'Watch the talking birds count apples on the tree!',
  },
  {
    id: 'k-2',
    order: 2,
    type: 'quiz',
    title: 'Star Quiz: Count & Multiply Apples! ⭐',
    duration: '3 fun questions',
    status: 'current',
    points: 50,
    quizQuestions: [
      {
        id: 'kq1',
        question: 'If you have 4 baskets with 3 red apples in each, how many apples do you have? 🍎',
        options: ['7 apples', '12 apples', '10 apples', '9 apples'],
        correctAnswer: '12 apples',
        explanation: 'Great job! 4 times 3 equals 12 juicy apples! 🎉',
      },
      {
        id: 'kq2',
        question: 'Which shape has 3 sides like a delicious slice of watermelon? 🍉',
        options: ['Circle', 'Square', 'Triangle', 'Star'],
        correctAnswer: 'Triangle',
        explanation: 'Super! A triangle has 3 corners and 3 straight sides.',
      },
    ],
    tutorTip: 'Ask your AI buddy Mimi if you need a hint!',
  },
  {
    id: 'k-3',
    order: 3,
    type: 'summary',
    title: 'Magic Flashcards: Today’s Big Discoveries! ✨',
    duration: 'Quick Peek',
    status: 'locked',
    points: 40,
    summaryContent: '🌟 Super Discoveries:\n• 4 × 3 = 12\n• Triangles have 3 sides\n• You are doing amazing!',
  },
  {
    id: 'k-4',
    order: 4,
    type: 'assignment',
    title: 'Fun Creative Activity: Draw Your Favorite Animal Counting Fruit! 🎨',
    duration: 'Drawing fun',
    status: 'locked',
    points: 60,
    assignmentDetails: {
      title: 'Animal Count Picture',
      prompt: 'Draw a picture of a friendly cat or bird with 5 pieces of fruit and show it to your teacher!',
      dueDate: 'Anytime this week',
      submissionFormat: 'Picture / Photo',
    },
  },
];

export const demoUnread = 2; // unread alerts shown on the bell
