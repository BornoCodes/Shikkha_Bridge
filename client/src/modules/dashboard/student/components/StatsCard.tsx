import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  variant?: 'terracotta' | 'turmeric' | 'river' | 'lotus';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'terracotta',
}) => {
  const colorMap = {
    terracotta: 'text-terracotta bg-terracotta/10 border-terracotta/20',
    turmeric: 'text-turmeric-dark bg-turmeric/15 border-turmeric/20',
    river: 'text-river bg-river/15 border-river/20',
    lotus: 'text-lotus bg-lotus/15 border-lotus/20',
  };

  return (
    <div className="bg-cream border border-parchment-dark rounded-3xl p-6 shadow-xs flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-matti-light uppercase tracking-wider">
          {label}
        </p>
        <p className="font-heading text-3xl font-extrabold text-matti mt-1">
          {value}
        </p>
        {subtext && <p className="text-xs text-matti-light mt-1">{subtext}</p>}
      </div>

      <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${colorMap[variant]}`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  );
};
