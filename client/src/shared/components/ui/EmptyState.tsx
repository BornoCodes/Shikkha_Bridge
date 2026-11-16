import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-6"
    >
      <div className="w-16 h-16 rounded-full bg-parchment flex items-center justify-center text-terracotta mb-4 border-2 border-dashed border-terracotta/30">
        {icon || (
          <span className="font-bengali text-2xl font-bold">সেতু</span>
        )}
      </div>

      <h4 className="font-heading text-lg font-bold text-matti mb-1">{title}</h4>
      <p className="text-sm text-matti-light mb-5 leading-relaxed">{description}</p>

      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};
