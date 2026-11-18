import React from 'react';
import { Bell, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: string;
  onMarkRead: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  title,
  message,
  time,
  read,
  type,
  onMarkRead,
}) => {
  return (
    <div
      onClick={() => onMarkRead(id)}
      className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
        read
          ? 'bg-cream border-parchment-dark opacity-75'
          : 'bg-parchment/60 border-terracotta/30 shadow-xs'
      }`}
    >
      <div className={`p-2.5 rounded-xl shrink-0 ${read ? 'bg-parchment text-matti-light' : 'bg-terracotta/10 text-terracotta'}`}>
        <Bell className="w-4 h-4" />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start gap-2">
          <h4 className={`text-sm font-bold ${read ? 'text-matti' : 'text-terracotta font-heading'}`}>
            {title}
          </h4>
          <span className="text-[11px] text-matti-light shrink-0">{time}</span>
        </div>
        <p className="text-xs text-matti-light mt-1 leading-relaxed">{message}</p>
      </div>

      {!read && (
        <span className="w-2.5 h-2.5 rounded-full bg-terracotta shrink-0 mt-1.5" />
      )}
    </div>
  );
};
