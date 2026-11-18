import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface AbsenceRecord {
  date: string;
  reason: string;
  verified: boolean;
}

interface AbsenceCalendarProps {
  absences: AbsenceRecord[];
  onSelectDate?: (date: string) => void;
}

export const AbsenceCalendar: React.FC<AbsenceCalendarProps> = ({ absences }) => {
  const absentDatesSet = new Set(absences.map((a) => a.date));

  // Generate days for standard current month grid (30 days)
  const days = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const formatted = `2026-11-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    return {
      day: dayNum,
      dateString: formatted,
      isAbsent: absentDatesSet.has(formatted),
    };
  });

  return (
    <div className="glass-panel-elevated border border-white/80 rounded-3xl p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-terracotta/10 text-terracotta">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-matti">November 2026 Disruption Log</h3>
            <p className="text-xs text-matti-light">Attendance records correlated with syllabus schedule</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-matti-light">Session Held</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-700 font-semibold">Disruption (Gap Flagged)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2.5 text-center text-xs font-bold text-matti-light uppercase tracking-wider mb-3">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      <div className="grid grid-cols-7 gap-2.5">
        {days.map((d) => (
          <div
            key={d.day}
            className={`h-12 rounded-2xl flex flex-col items-center justify-center text-xs font-semibold transition-all ${
              d.isAbsent
                ? 'bg-rose-500/10 text-rose-800 border-2 border-rose-400/40 shadow-xs'
                : 'glass-panel text-matti hover:bg-white/80 border border-white/60'
            }`}
          >
            <span>{d.day}</span>
            {d.isAbsent && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-0.5" />}
          </div>
        ))}
      </div>
    </div>
  );
};
