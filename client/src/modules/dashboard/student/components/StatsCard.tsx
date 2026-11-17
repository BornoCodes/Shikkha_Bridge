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
    terracotta: 'text-terracotta bg-terracotta/10 border-terracotta/25',
    turmeric: 'text-turmeric-dark bg-turmeric/15 border-turmeric/30',
    river: 'text-river bg-river/15 border-river/30',
    lotus: 'text-lotus-dark bg-lotus/15 border-lotus/30',
  };

  return (
    <div className="glass-panel-elevated rounded-3xl p-6 shadow-sm border border-white/80 flex items-center justify-between hover:-translate-y-0.5 transition-all">
      <div>
        <p className="text-[11px] font-bold text-matti-light/90 uppercase tracking-wider">
          {label}
        </p>
        <p className="font-heading text-3xl font-extrabold text-matti mt-1.5">
          {value}
        </p>
        {subtext && <p className="text-xs text-matti-light mt-1 font-medium">{subtext}</p>}
      </div>

      <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-xs ${colorMap[variant]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
