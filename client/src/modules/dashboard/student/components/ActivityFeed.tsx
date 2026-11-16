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
    <div className="bg-cream border border-parchment-dark rounded-3xl p-6 shadow-xs">
      <h3 className="font-heading font-bold text-lg text-matti mb-4">
        Recent Recovery Activity
      </h3>

      <div className="space-y-4">
        {items.map((act) => (
          <div key={act.id} className="flex items-start gap-3 pb-3 border-b border-parchment-dark last:border-0 last:pb-0">
            <div className="p-2 rounded-xl bg-parchment shrink-0 mt-0.5">
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
