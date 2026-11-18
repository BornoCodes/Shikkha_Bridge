import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  showPercent?: boolean;
  color?: 'terracotta' | 'turmeric' | 'river' | 'lotus';
  height?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercent = true,
  color = 'terracotta',
  height = 'md',
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const gradientColors = {
    terracotta: 'from-terracotta to-turmeric',
    turmeric: 'from-turmeric to-amber-500',
    river: 'from-river to-teal-400',
    lotus: 'from-lotus to-rose-400',
  };

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5 text-xs text-matti-light font-medium">
          {label && <span>{label}</span>}
          {showPercent && <span className="font-semibold text-matti">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div className={`w-full bg-parchment-dark rounded-full overflow-hidden ${heightClasses[height]} shadow-inner`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${gradientColors[color]} rounded-full relative`}
        >
          {/* Subtle shimmer effect */}
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};
