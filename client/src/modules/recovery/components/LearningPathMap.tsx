import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, BookOpen } from 'lucide-react';
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
    <div className="relative py-8 px-2 sm:px-4">
      {/* Whimsical curving path line with Nakshi-Kantha stitch look */}
      <div className="absolute left-8 top-12 bottom-12 w-1.5 bg-gradient-to-b from-terracotta via-turmeric to-river hidden md:block rounded-full opacity-60" />

      <div className="space-y-8">
        {steps.map((step, index) => {
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex flex-col md:flex-row items-start gap-6 group"
            >
              {/* Stepping Stone Node */}
              <button
                onClick={() => onToggleComplete(step.id, step.completed)}
                className={`relative z-10 w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all shadow-md ${
                  step.completed
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white ring-4 ring-emerald-300/40 shadow-emerald-500/20'
                    : 'glass-panel-elevated border-2 border-terracotta/70 text-terracotta hover:scale-105 shadow-terracotta/10 ring-2 ring-white'
                }`}
                title="Click to toggle milestone status"
              >
                {step.completed ? (
                  <Check className="w-8 h-8 stroke-[3]" />
                ) : (
                  <>
                    <span className="font-bengali text-xs font-bold leading-none">ধাপ</span>
                    <span className="font-heading font-extrabold text-xl leading-none mt-1">
                      {step.order}
                    </span>
                  </>
                )}
              </button>

              {/* Story Milestone Card (Glassmorphic) */}
              <div
                className={`flex-1 glass-panel-elevated rounded-3xl p-7 transition-all ${
                  step.completed
                    ? 'border-emerald-300/50 bg-emerald-50/20'
                    : 'border-white/80 hover:border-terracotta/40 shadow-sm'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-bold text-matti-light/90 uppercase tracking-wider">
                      {step.subject}
                    </span>
                    <span className="text-parchment-dark">•</span>
                    <div className="flex items-center gap-1.5 text-xs text-matti-light font-medium">
                      <Clock className="w-3.5 h-3.5 text-turmeric-dark" />
                      <span>{step.estimatedHours} Hours Required</span>
                    </div>
                  </div>

                  <Badge
                    variant={step.completed ? 'success' : 'turmeric'}
                    size="sm"
                  >
                    {step.completed ? 'MILESTONE COMPLETED' : 'IN RECOVERY'}
                  </Badge>
                </div>

                <h3 className="font-heading text-xl font-bold text-matti mb-1">
                  {step.topicName}
                </h3>

                <p className="text-xs text-matti-light mb-4 italic">
                  "{step.reasoning}"
                </p>

                {/* Catch-Up Action Checklist */}
                <div className="space-y-2.5 glass-panel p-4 rounded-2xl border border-white/70">
                  <div className="text-xs font-bold text-matti flex items-center gap-1.5 mb-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-terracotta" />
                    <span>Curated Catch-Up Steps:</span>
                  </div>
                  {step.actionItems.map((act, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-matti">
                      <div className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
                      <span className="leading-relaxed">{act}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => onToggleComplete(step.id, step.completed)}
                    className="text-xs font-bold text-terracotta hover:underline inline-flex items-center gap-1"
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
