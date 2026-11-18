import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', text }) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      {/* Whimsical Alpona-inspired spinning concentric circles */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className={`relative ${sizeMap[size]}`}
      >
        <div className="absolute inset-0 rounded-full border-4 border-terracotta/20 border-t-terracotta" />
        <div className="absolute inset-1 rounded-full border-2 border-turmeric/30 border-b-turmeric animate-spin" />
      </motion.div>
      {text && (
        <p className="font-bengali text-sm text-matti-light animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};
