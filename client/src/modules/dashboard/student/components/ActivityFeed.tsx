import React from 'react';
import { CheckCircle2, Clock, Sparkles, AlertCircle } from 'lucide-react';

interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type: 'milestone' | 'quiz' | 'plan' | 'absence';
}

export const ActivityFeed: React.FC<{ items: ActivityItem[] }> = ({ items }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'quiz':
        return <Sparkles className="w-4 h-4 text-turmeric" />;
      case 'plan':
        return <Clock className="w-4 h-4 text-river" />;
      default:
        return <AlertCircle className="w-4 h-4 text-terracotta" />;
    }
  };

  return (
    <div className="glass-panel-elevated rounded-3xl p-6 sm:p-7 shadow-sm border border-white/80">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-heading font-bold text-lg text-matti">
          Recent Activity
        </h3>
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
      </div>

      <div className="space-y-4">
        {items.map((act) => (
          <div key={act.id} className="flex items-start gap-3.5 pb-3.5 border-b border-parchment-dark/50 last:border-0 last:pb-0">
            <div className="p-2.5 rounded-xl glass-panel border border-white/70 shrink-0 mt-0.5">
              {getIcon(act.type)}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-matti">{act.title}</p>
              <p className="text-[11px] text-matti-light mt-0.5">{act.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
