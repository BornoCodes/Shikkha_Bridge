import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  FileQuestion,
  FileText,
  UploadCloud,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Clock,
  Award,
  Video,
  X,
  Send,
  MessageCircle,
} from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import { Modal } from './Modal';
import { ProgressBar } from './ProgressBar';
import { toast } from 'react-hot-toast';
import { PathCheckpoint, EducationTier } from '../../types';

interface UnifiedLearningPathProps {
  courseName: string;
  courseCode?: string;
  tier?: EducationTier;
  checkpoints: PathCheckpoint[];
  onCheckpointComplete?: (id: string) => void;
}

export const UnifiedLearningPath: React.FC<UnifiedLearningPathProps> = ({
  courseName,
  courseCode = 'CSE220',
  tier = 'university',
  checkpoints: initialCheckpoints,
}) => {
  const [checkpoints, setCheckpoints] = useState<PathCheckpoint[]>(initialCheckpoints);
  const [activeModal, setActiveModal] = useState<{
    type: 'video' | 'quiz' | 'summary' | 'assignment';
    checkpoint: PathCheckpoint;
  } | null>(null);

  // AI Summary generation state
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<string | null>(null);

  // Quiz state inside path
  const [currentQuizQ, setCurrentQuizQ] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Assignment submission state
  const [assignmentText, setAssignmentText] = useState('');
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);

  const completedCount = checkpoints.filter((c) => c.status === 'completed').length;
  const progressPercent = Math.round((completedCount / checkpoints.length) * 100);

  const handleOpenCheckpoint = (cp: PathCheckpoint) => {
    if (cp.status === 'locked') {
      toast.error('Complete the earlier checkpoints on your path first!');
      return;
    }
    setActiveModal({ type: cp.type, checkpoint: cp });
    if (cp.type === 'summary') {
      setSummaryData(cp.summaryContent || null);
    }
    setQuizScore(null);
    setCurrentQuizQ(0);
    setQuizAnswers({});
  };

  const markCurrentCompleted = (id: string) => {
    setCheckpoints((prev) => {
      let foundCurrent = false;
      return prev.map((item, idx) => {
        if (item.id === id) {
          foundCurrent = true;
          return { ...item, status: 'completed' };
        }
        if (foundCurrent && item.status === 'locked') {
          foundCurrent = false;
          return { ...item, status: 'current' };
        }
        return item;
      });
    });
    toast.success('Checkpoint completed! Next milestone unlocked on your path.');
    setActiveModal(null);
  };

  const handleGenerateSummary = () => {
    setIsGeneratingSummary(true);
    setTimeout(() => {
      setIsGeneratingSummary(false);
      setSummaryData(
        `📌 AI Core Takeaways for ${courseName}:\n\n` +
          `1. Primary theorem establishes asymptotic complexity bounds O(n log n).\n` +
          `2. Balanced recurrence relations ensure uniform branch partitioning during disruptions.\n` +
          `3. Exam Alert: Remember to check boundary base conditions where T(1) = Θ(1).\n` +
          `4. Key Formula: T(n) = aT(n/b) + f(n). Compare f(n) with n^(log_b a).`
      );
      toast.success('AI summary notes generated!');
    }, 1200);
  };

  const handleQuizSubmit = (cp: PathCheckpoint) => {
    const questions = cp.quizQuestions || [];
    let correct = 0;
    questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) correct++;
    });
    const finalScore = Math.round((correct / questions.length) * 100);
    setQuizScore(finalScore);
    if (finalScore >= 60) {
      toast.success(`Passed with ${finalScore}%! Unlocking next milestone.`);
      markCurrentCompleted(cp.id);
    } else {
      toast.error(`Scored ${finalScore}%. Review the lecture and try again.`);
    }
  };

  const handleSubmitAssignment = (cp: PathCheckpoint) => {
    if (!assignmentText.trim()) {
      toast.error('Please enter your solution or assignment response.');
      return;
    }
    setIsSubmittingAssignment(true);
    setTimeout(() => {
      setIsSubmittingAssignment(false);
      toast.success('Assignment submitted for Student Tutor and Teacher review!');
      markCurrentCompleted(cp.id);
      setAssignmentText('');
    }, 1000);
  };

  const getTypeIcon = (type: string, status: string) => {
    if (status === 'locked') return <Lock className="w-5 h-5 text-matti-light/60" />;
    if (status === 'completed') return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
    switch (type) {
      case 'video':
        return <Play className="w-5 h-5 text-terracotta fill-terracotta" />;
      case 'quiz':
        return <FileQuestion className="w-5 h-5 text-turmeric-dark" />;
      case 'summary':
        return <FileText className="w-5 h-5 text-river" />;
      case 'assignment':
        return <UploadCloud className="w-5 h-5 text-lotus-dark" />;
      default:
        return <BookOpen className="w-5 h-5 text-terracotta" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Video Lecture';
      case 'quiz':
        return 'AI Diagnostic Quiz';
      case 'summary':
        return 'AI Summary & Notes';
      case 'assignment':
        return 'Module Assignment';
      default:
        return 'Milestone';
    }
  };

  return (
    <div className="space-y-8">
      {/* Course & Path Header */}
      <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 nakshi-ribbon-bottom">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {courseCode && (
              <span className="px-2.5 py-1 rounded-xl bg-terracotta/10 text-terracotta text-xs font-bold border border-terracotta/25">
                {courseCode}
              </span>
            )}
            <Badge variant="turmeric" size="sm">
              {tier === 'kids' ? 'Fun Journey' : tier === 'university' ? 'Undergraduate Degree Path' : 'Secondary Curriculum'}
            </Badge>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-matti">
            {courseName}
          </h2>
          <p className="text-xs sm:text-sm text-matti-light mt-1">
            Follow the sequential path: <strong>Lecture ➔ AI Quiz ➔ AI Summary ➔ Assignment</strong>. Everything is organized so you always know what to do next!
          </p>
        </div>

        <div className="w-full md:w-72 glass-panel p-4 rounded-2xl border border-white/70 shadow-xs">
          <ProgressBar
            progress={progressPercent}
            label={`Pathway Progress (${completedCount}/${checkpoints.length})`}
            color="terracotta"
          />
        </div>
      </div>

      {/* The Unified Linear Curving Learning Path */}
      <div className="relative py-8 px-4 sm:px-8">
        {/* Curving decorative backbone line */}
        <div className="absolute left-10 sm:left-14 top-12 bottom-12 w-2 bg-gradient-to-b from-terracotta via-turmeric to-emerald-500 rounded-full opacity-40 hidden sm:block" />

        <div className="space-y-6 relative z-10">
          {checkpoints.map((cp, idx) => {
            const isCompleted = cp.status === 'completed';
            const isCurrent = cp.status === 'current';
            const isLocked = cp.status === 'locked';

            return (
              <motion.div
                key={cp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`relative flex items-start gap-4 sm:gap-6 group transition-all`}
              >
                {/* Node Stepping Stone Button */}
                <button
                  onClick={() => handleOpenCheckpoint(cp)}
                  disabled={isLocked}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 transition-all duration-300 shadow-md ${
                    isCompleted
                      ? 'bg-emerald-50 border-2 border-emerald-500 shadow-emerald-500/15'
                      : isCurrent
                      ? 'bg-white border-3 border-terracotta shadow-lg shadow-terracotta/25 scale-105 ring-4 ring-terracotta/20 animate-pulse'
                      : 'glass-panel opacity-60 border border-parchment-dark cursor-not-allowed'
                  }`}
                  title={isLocked ? 'Prerequisites locked' : 'Click to enter milestone'}
                >
                  {getTypeIcon(cp.type, cp.status)}
                  <span className="text-[10px] font-bold text-matti mt-0.5">
                    {idx + 1}
                  </span>
                </button>

                {/* Milestone Detail Card */}
                <div
                  onClick={() => !isLocked && handleOpenCheckpoint(cp)}
                  className={`flex-1 glass-panel-elevated p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-terracotta/50 shadow-md ring-1 ring-terracotta/20 bg-white/90'
                      : isCompleted
                      ? 'border-emerald-300/40 bg-emerald-50/15'
                      : 'border-white/70 opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-terracotta uppercase tracking-wider">
                        {getTypeLabel(cp.type)}
                      </span>
                      {cp.duration && (
                        <>
                          <span className="text-matti-light/40">•</span>
                          <span className="text-xs text-matti-light flex items-center gap-1">
                            <Clock className="w-3 h-3 text-turmeric-dark" />
                            {cp.duration}
                          </span>
                        </>
                      )}
                    </div>

                    <Badge
                      variant={isCompleted ? 'success' : isCurrent ? 'terracotta' : 'neutral'}
                      size="sm"
                    >
                      {isCompleted ? 'COMPLETED ✓' : isCurrent ? 'CURRENT MILESTONE' : 'LOCKED'}
                    </Badge>
                  </div>

                  <h3 className="font-heading font-bold text-lg sm:text-xl text-matti mb-1">
                    {cp.title}
                  </h3>

                  {cp.tutorTip && (
                    <p className="text-xs text-matti-light/90 italic mt-1">
                      💡 Tutor Tip: "{cp.tutorTip}"
                    </p>
                  )}

                  {/* Actions / Enter button */}
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-parchment-dark/50">
                    <span className="text-xs text-matti-light">
                      Reward: <strong className="text-terracotta">+{cp.points} XP</strong>
                    </span>

                    <span className="text-xs font-bold text-terracotta flex items-center gap-1 group-hover:underline">
                      <span>{isCompleted ? 'Review Milestone' : isCurrent ? 'Start Now' : 'Locked'}</span>
                      {!isLocked && <ArrowRight className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Interactive Checkpoint Modals */}
      <AnimatePresence>
        {activeModal && (
          <Modal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            title={`${getTypeLabel(activeModal.type)}: ${activeModal.checkpoint.title}`}
            maxWidth="xl"
          >
            {/* 1. Video Lecture Modal */}
            {activeModal.type === 'video' && (
              <div className="space-y-5">
                <div className="aspect-video w-full rounded-2xl bg-matti flex flex-col items-center justify-center relative overflow-hidden shadow-lg border border-matti/30 text-white">
                  <Play className="w-16 h-16 text-terracotta fill-terracotta opacity-85 hover:scale-110 transition-transform cursor-pointer" />
                  <span className="text-xs text-white/80 mt-3 font-medium">
                    Video Lecture Stream • {activeModal.checkpoint.duration || '14:20 mins'}
                  </span>
                  <div className="absolute bottom-3 left-4 right-4 flex justify-between text-[11px] text-white/60">
                    <span>Sylhet Distance Learning Stream</span>
                    <span>1080p HD</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-turmeric/30">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-matti">
                      Missed lecture due to disruption?
                    </h4>
                    <p className="text-xs text-matti-light">
                      Generate instant AI summary bullet points and key formulas right here.
                    </p>
                  </div>

                  <Button
                    onClick={handleGenerateSummary}
                    variant="secondary"
                    size="sm"
                    disabled={isGeneratingSummary}
                  >
                    <Sparkles className="w-4 h-4 mr-1.5 text-terracotta" />
                    <span>{isGeneratingSummary ? 'Analyzing...' : 'Generate AI Summary'}</span>
                  </Button>
                </div>

                {summaryData && (
                  <div className="p-4 rounded-2xl bg-parchment border border-parchment-dark whitespace-pre-line text-xs text-matti leading-relaxed font-sans shadow-inner">
                    {summaryData}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-parchment-dark">
                  <span className="text-xs text-matti-light">
                    Watch all lecture segments to unlock the diagnostic quiz.
                  </span>
                  <Button
                    onClick={() => markCurrentCompleted(activeModal.checkpoint.id)}
                    variant="primary"
                    size="md"
                    className="shadow-md shadow-terracotta/20"
                  >
                    I have watched this lecture ✓
                  </Button>
                </div>
              </div>
            )}

            {/* 2. AI Quiz Checkpoint */}
            {activeModal.type === 'quiz' && (
              <div className="space-y-5">
                {activeModal.checkpoint.quizQuestions && activeModal.checkpoint.quizQuestions.length > 0 ? (
                  <div>
                    <div className="flex justify-between text-xs font-bold text-matti-light mb-2">
                      <span className="text-terracotta">
                        Question {currentQuizQ + 1} of {activeModal.checkpoint.quizQuestions.length}
                      </span>
                      <span>Passing Score: 60%</span>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl border border-white/80 mb-4">
                      <h4 className="font-heading font-bold text-base text-matti mb-4">
                        {activeModal.checkpoint.quizQuestions[currentQuizQ].question}
                      </h4>

                      <div className="space-y-2.5">
                        {activeModal.checkpoint.quizQuestions[currentQuizQ].options.map((opt, i) => {
                          const isSelected = quizAnswers[currentQuizQ] === opt;
                          return (
                            <button
                              key={i}
                              onClick={() =>
                                setQuizAnswers({ ...quizAnswers, [currentQuizQ]: opt })
                              }
                              className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center gap-3 ${
                                isSelected
                                  ? 'border-terracotta bg-terracotta/10 text-matti font-bold'
                                  : 'border-parchment-dark bg-white/70 hover:border-terracotta/30'
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full bg-parchment-dark text-[10px] font-bold flex items-center justify-center">
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={currentQuizQ === 0}
                        onClick={() => setCurrentQuizQ(currentQuizQ - 1)}
                      >
                        Previous
                      </Button>

                      {currentQuizQ < activeModal.checkpoint.quizQuestions.length - 1 ? (
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={!quizAnswers[currentQuizQ]}
                          onClick={() => setCurrentQuizQ(currentQuizQ + 1)}
                        >
                          Next Question
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={!quizAnswers[currentQuizQ]}
                          onClick={() => handleQuizSubmit(activeModal.checkpoint)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Submit & Evaluate
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-matti-light">Quiz questions ready to be generated.</p>
                )}
              </div>
            )}

            {/* 3. AI Summary & Notes Checkpoint */}
            {activeModal.type === 'summary' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-parchment border border-parchment-dark whitespace-pre-line text-xs text-matti leading-relaxed font-sans">
                  {summaryData || activeModal.checkpoint.summaryContent || 'AI summary notes ready.'}
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-parchment-dark">
                  <Button
                    onClick={() => markCurrentCompleted(activeModal.checkpoint.id)}
                    variant="primary"
                    size="md"
                  >
                    Mark Notes Reviewed ✓
                  </Button>
                </div>
              </div>
            )}

            {/* 4. Assignment Checkpoint */}
            {activeModal.type === 'assignment' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl glass-panel border border-lotus/40">
                  <span className="text-[11px] font-bold text-lotus-dark uppercase tracking-wider block mb-1">
                    Assignment Prompt
                  </span>
                  <p className="text-xs text-matti font-medium leading-relaxed">
                    {activeModal.checkpoint.assignmentDetails?.prompt ||
                      'Solve the 3 practice problems on recurrence master theorem and provide brief asymptotic explanations.'}
                  </p>
                  <p className="text-[11px] text-matti-light mt-2">
                    Due Date: {activeModal.checkpoint.assignmentDetails?.dueDate || 'Within 7 days of catch-up'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-matti mb-1.5">
                    Your Solution / Assignment Response:
                  </label>
                  <textarea
                    rows={4}
                    value={assignmentText}
                    onChange={(e) => setAssignmentText(e.target.value)}
                    placeholder="Type your solution, formulas, or paste link to your handwritten notes..."
                    className="w-full p-3.5 rounded-2xl border border-parchment-dark bg-white/80 text-xs text-matti focus:outline-none focus:ring-2 focus:ring-terracotta/30 leading-relaxed"
                  />
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-parchment-dark">
                  <span className="text-xs text-matti-light">
                    Reviewed by Student Tutors & Teacher
                  </span>
                  <Button
                    onClick={() => handleSubmitAssignment(activeModal.checkpoint)}
                    variant="primary"
                    size="md"
                    disabled={isSubmittingAssignment}
                    className="shadow-md shadow-terracotta/20"
                  >
                    <Send className="w-4 h-4 mr-1.5" />
                    <span>{isSubmittingAssignment ? 'Submitting...' : 'Submit Assignment'}</span>
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
