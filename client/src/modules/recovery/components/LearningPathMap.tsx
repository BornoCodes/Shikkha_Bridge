import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge';

export interface PathStep {
  id: string;
  order: number;
  topicName: string;
  subject: string;
  estimatedHours: number;
  completed: boolean;
  reasoning: string;
  actionItems: string[];
}

interface LearningPathMapProps {
  steps: PathStep[];
  onToggleComplete: (id: string, currentState: boolean) => void;
}

export const LearningPathMap: React.FC<LearningPathMapProps> = ({
  steps,
  onToggleComplete,
}) => {
  return (
    <div className="relative py-6 px-4">
      {/* Whimsical curving path line */}
      <div className="absolute left-8 top-10 bottom-10 w-1 bg-gradient-to-b from-terracotta via-turmeric to-river hidden md:block rounded-full" />

      <div className="space-y-8">
        {steps.map((step, index) => {
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex flex-col md:flex-row items-start gap-6 group"
            >
              {/* Stepping Stone Node */}
              <button
                onClick={() => onToggleComplete(step.id, step.completed)}
                className={`relative z-10 w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all shadow-md ${
                  step.completed
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-200'
                    : 'bg-cream border-2 border-terracotta text-terracotta hover:bg-parchment hover:scale-105'
                }`}
                title="Click to toggle milestone completion"
              >
                {step.completed ? (
                  <Check className="w-8 h-8 stroke-[3]" />
                ) : (
                  <>
                    <span className="font-bengali text-xs font-bold">ধাপ</span>
                    <span className="font-heading font-extrabold text-lg leading-none">
                      {step.order}
                    </span>
                  </>
                )}
              </button>

              {/* Story Milestone Card */}
              <div
                className={`flex-1 bg-cream border rounded-3xl p-6 transition-all ${
                  step.completed
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-parchment-dark hover:border-terracotta/40 shadow-xs'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-matti-light uppercase tracking-wider">
                      {step.subject}
                    </span>
                    <span className="text-parchment-dark">•</span>
                    <div className="flex items-center gap-1 text-xs text-matti-light">
                      <Clock className="w-3.5 h-3.5 text-turmeric" />
                      <span>{step.estimatedHours} Hours</span>
                    </div>
                  </div>

                  <Badge
                    variant={step.completed ? 'success' : 'turmeric'}
                    size="sm"
                  >
                    {step.completed ? 'COMPLETED' : 'IN PROGRESS'}
                  </Badge>
                </div>

                <h3 className="font-heading text-xl font-bold text-matti mb-1">
                  {step.topicName}
                </h3>

                <p className="text-xs text-matti-light mb-4 italic">
                  "{step.reasoning}"
                </p>

                {/* Catch-Up Action Checklist */}
                <div className="space-y-2 bg-parchment/60 p-4 rounded-2xl border border-parchment-dark">
                  <div className="text-xs font-semibold text-matti flex items-center gap-1.5 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-terracotta" />
                    <span>Recommended Catch-Up Actions:</span>
                  </div>
                  {step.actionItems.map((act, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-matti">
                      <div className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => onToggleComplete(step.id, step.completed)}
                    className="text-xs font-semibold text-terracotta hover:underline inline-flex items-center gap-1"
                  >
                    {step.completed ? 'Mark Incomplete' : 'Mark Step Complete ✓'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
