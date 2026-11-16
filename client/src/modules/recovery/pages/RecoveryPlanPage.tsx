import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LearningPathMap, PathStep } from '../components/LearningPathMap';
import { ProgressBar } from '../../../shared/components/ui/ProgressBar';
import { Badge } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import { toast } from 'react-hot-toast';
import { Sparkles, MessageSquare, BookOpen, ArrowLeft } from 'lucide-react';

export const RecoveryPlanPage: React.FC = () => {
  const { id } = useParams();

  const [steps, setSteps] = useState<PathStep[]>([
    {
      id: 'step-1',
      order: 1,
      topicName: 'Algebraic Polynomials & Factorization',
      subject: 'Mathematics',
      estimatedHours: 2.5,
      completed: true,
      reasoning: 'Foundational prerequisite: Must master factorization before quadratic equations.',
      actionItems: [
        'Watch Chapter 3 video summary (18 mins)',
        'Review peer notes shared by Tanvir',
        'Solve 5 practice factorization problems',
      ],
    },
    {
      id: 'step-2',
      order: 2,
      topicName: 'Newtonian Laws of Motion & Friction',
      subject: 'Physics',
      estimatedHours: 3.0,
      completed: true,
      reasoning: 'Core dynamics topic missed during Nov 06 flood closure.',
      actionItems: [
        'Read textbook sections 4.1 to 4.4',
        'Complete interactive friction simulation',
        'Take diagnostic self-test',
      ],
    },
    {
      id: 'step-3',
      order: 3,
      topicName: 'Periodic Trends & Electronic Configuration',
      subject: 'Chemistry',
      estimatedHours: 2.0,
      completed: false,
      reasoning: 'Essential concept for upcoming term evaluation.',
      actionItems: [
        'Study periodic trends cheat-sheet in library',
        'Memorize group 1 and group 17 characteristics',
        'Attempt practice quiz 3',
      ],
    },
    {
      id: 'step-4',
      order: 4,
      topicName: 'Photosynthesis & Cellular Respiration',
      subject: 'Biology',
      estimatedHours: 2.0,
      completed: false,
      reasoning: 'Connects basic plant biology to metabolic chemical cycles.',
      actionItems: [
        'Watch animation on light and dark reactions',
        'Draw the chloroplast cycle diagram',
        'Discuss questions with study buddy',
      ],
    },
  ]);

  const handleToggleComplete = (stepId: string, currentState: boolean) => {
    setSteps(
      steps.map((s) => (s.id === stepId ? { ...s, completed: !currentState } : s))
    );
    toast.success(
      currentState ? 'Step marked as in progress' : 'Milestone completed! Recovery progress updated.'
    );
  };

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="space-y-8">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/student/recovery-plans"
            className="text-xs font-semibold text-matti-light hover:text-terracotta inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Recovery Pathways</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-3xl font-bold text-matti">
              Monsoon Catch-Up Pathway
            </h1>
            <Badge variant="success" size="sm">
              TEACHER APPROVED
            </Badge>
          </div>
          <p className="text-sm text-matti-light mt-1">
            Personalized learning path calibrated for flood disruption period.
          </p>
        </div>

        <div className="w-full sm:w-64 bg-cream border border-parchment-dark p-4 rounded-2xl">
          <ProgressBar
            progress={progressPercent}
            label="Pathway Recovery"
            color="terracotta"
          />
        </div>
      </div>

      {/* Teacher Guidance Note Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-heading font-bold text-sm text-amber-900">
            Teacher Note from Mohammad Faruk Sir:
          </h4>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            "Anika, focus on Step 1 and 2 first. The physics chapter is essential for next week's practical lab. Reach out on the peer bridge if you need help with algebraic signs!"
          </p>
        </div>
      </div>

      {/* Story Map Component */}
      <LearningPathMap
        steps={steps}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
};
