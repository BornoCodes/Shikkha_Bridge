import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'terracotta' | 'turmeric' | 'lotus' | 'river' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'terracotta',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    terracotta: 'bg-terracotta/10 text-terracotta border-terracotta/30',
    turmeric: 'bg-turmeric/15 text-turmeric-dark border-turmeric/40',
    lotus: 'bg-lotus/15 text-lotus-dark border-lotus/40',
    river: 'bg-river/15 text-river-dark border-river/40',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-parchment text-matti-light border-parchment-dark',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
