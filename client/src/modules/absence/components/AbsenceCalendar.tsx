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
    <div className="bg-cream border border-parchment-dark rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-terracotta" />
          <h3 className="font-heading font-bold text-matti">November 2026 Attendance</h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-matti-light">Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-matti-light">Disrupted / Absent</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-matti-light mb-2">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => (
          <div
            key={d.day}
            className={`h-11 rounded-xl flex flex-col items-center justify-center text-xs font-medium transition-all ${
              d.isAbsent
                ? 'bg-rose-100 text-rose-800 border border-rose-300 font-bold shadow-xs'
                : 'bg-parchment text-matti hover:bg-parchment-dark'
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
