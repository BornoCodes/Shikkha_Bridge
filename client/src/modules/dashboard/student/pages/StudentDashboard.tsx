import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StatsCard } from '../components/StatsCard';
import { ActivityFeed } from '../components/ActivityFeed';
import { Button } from '../../../../shared/components/ui/Button';
import { Badge } from '../../../../shared/components/ui/Badge';
import { ChibiMascot } from '../../../../shared/components/ui/ChibiMascot';
import { ChibiCustomizerModal } from '../../../../shared/components/ui/ChibiCustomizerModal';
import { UnifiedLearningPath } from '../../../../shared/components/ui/UnifiedLearningPath';
import {
  Compass,
  FileQuestion,
  CalendarX,
  Flame,
  ArrowRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  Baby,
  Users,
  Share2,
} from 'lucide-react';
import { useAuth } from '../../../../shared/hooks/useAuth';
import { ChibiMascotConfig, EducationTier, PathCheckpoint } from '../../../../shared/types';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  // Tier State: Switch between Kids (simpler, playful) and University (sophisticated, tutor-enabled)
  const [tier, setTier] = useState<EducationTier>('university');

  // Mascot State (stored in local state / customizer)
  const [mascotCustomizerOpen, setMascotCustomizerOpen] = useState(false);
  const [mascotConfig, setMascotConfig] = useState<ChibiMascotConfig>({
    name: 'Mimi',
    species: 'cat',
    color: '#FFF2E2',
    accessory: 'cap',
    level: 3,
    happiness: 95,
  });

  // University Course Checkpoints (Video -> AI Quiz -> AI Summary -> Assignment)
  const universityCheckpoints: PathCheckpoint[] = [
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

  // Kids / Primary School Course Checkpoints (Simpler, Whimsical, Fun!)
  const kidsCheckpoints: PathCheckpoint[] = [
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

  const currentCheckpoints = tier === 'kids' ? kidsCheckpoints : universityCheckpoints;

  return (
    <div className="space-y-8">
      {/* Top Banner with Adaptive Tier Switcher & Chibi Mascot Companion */}
      <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6 nakshi-ribbon-bottom">
        <div className="max-w-2xl">
          {/* Tier Switcher Controls */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold text-matti-light uppercase mr-1">Experience Mode:</span>

            <button
              onClick={() => setTier('university')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                tier === 'university'
                  ? 'bg-terracotta text-white shadow-xs'
                  : 'glass-panel text-matti-light hover:text-matti'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>University & College</span>
            </button>

            <button
              onClick={() => setTier('kids')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                tier === 'kids'
                  ? 'bg-gradient-to-r from-turmeric to-amber-500 text-matti font-extrabold shadow-xs'
                  : 'glass-panel text-matti-light hover:text-matti'
              }`}
            >
              <Baby className="w-3.5 h-3.5 text-turmeric-dark" />
              <span>Kids & Primary School</span>
            </button>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-matti leading-tight">
            {tier === 'kids'
              ? 'Hello Little Explorer! Ready for Fun Learning? 🎈'
              : 'University Learning Recovery Hub'}
          </h1>

          <p className="mt-1.5 text-xs sm:text-sm text-matti-light leading-relaxed">
            {tier === 'kids'
              ? 'Follow the colorful stepping stones below. Watch cartoons, answer easy star quizzes, and collect shiny gems!'
              : 'Structured catch-up pathway for undergraduate coursework. Connect with Student Tutors and access request-verified peer notes.'}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {tier === 'university' && (
              <Link to="/university/notes">
                <Button variant="secondary" size="sm" className="shadow-xs">
                  <BookOpen className="w-4 h-4 mr-1.5 text-terracotta" />
                  <span>Peer Note Exchange & Tutors</span>
                </Button>
              </Link>
            )}
            <Link to="/student/absences">
              <Button variant="outline" size="sm" className="glass-panel text-xs">
                <CalendarX className="w-3.5 h-3.5 mr-1 text-terracotta" />
                <span>Log Disruption Period</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Live Animated Kawaii Chibi Mascot Component */}
        <div className="flex justify-end lg:justify-center">
          <ChibiMascot
            config={mascotConfig}
            daysAway={4}
            currentTopic={tier === 'kids' ? 'Number Forest & Multiplication' : 'BST Properties & AVL Balance'}
            suggestedAction={
              tier === 'kids'
                ? 'Try the 2-minute Apple Star Quiz! ⭐'
                : 'Checkpoint 3: Review AI High-Yield Formulas!'
            }
            onOpenCustomizer={() => setMascotCustomizerOpen(true)}
            tier={tier}
          />
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label={tier === 'kids' ? 'Adventure Gems' : 'Syllabus Gaps'}
          value={tier === 'kids' ? '120 ⭐' : '3 Topics'}
          subtext={tier === 'kids' ? 'Level 3 Achiever!' : '2 High priority'}
          icon={CalendarX}
          variant="terracotta"
        />
        <StatsCard
          label="Pathway Progress"
          value="50%"
          subtext="2 of 4 checkpoints complete"
          icon={Compass}
          variant="turmeric"
        />
        <StatsCard
          label={tier === 'kids' ? 'Fun Quizzes' : 'Diagnostic Score'}
          value={tier === 'kids' ? '3 Passed 🎉' : '82% Avg'}
          subtext="Ready for upcoming milestones"
          icon={FileQuestion}
          variant="river"
        />
        <StatsCard
          label="Learning Streak"
          value="5 Days"
          subtext="Recovery momentum strong!"
          icon={Flame}
          variant="lotus"
        />
      </div>

      {/* THE DRAWN UNIFIED LEARNING PATH */}
      <UnifiedLearningPath
        courseName={
          tier === 'kids'
            ? 'Fun Primary Mathematics & Nature Science'
            : 'Data Structures & Recurrence Relations'
        }
        courseCode={tier === 'kids' ? 'KIDS-M1' : 'CSE220'}
        tier={tier}
        checkpoints={currentCheckpoints}
      />

      {/* Mascot Customizer Modal */}
      <ChibiCustomizerModal
        isOpen={mascotCustomizerOpen}
        onClose={() => setMascotCustomizerOpen(false)}
        currentConfig={mascotConfig}
        onSave={(newCfg) => setMascotConfig(newCfg)}
      />
    </div>
  );
};
