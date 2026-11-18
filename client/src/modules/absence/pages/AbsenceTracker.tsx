import React, { useState } from 'react';
import { AbsenceCalendar } from '../components/AbsenceCalendar';
import { GapSummaryCard } from '../components/GapSummaryCard';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { toast } from 'react-hot-toast';
import { Plus, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AbsenceTracker: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [date, setDate] = useState('2026-11-10');
  const [reason, setReason] = useState('flood');
  const [notes, setNotes] = useState('');

  const [absences, setAbsences] = useState([
    { date: '2026-11-04', reason: 'flood', verified: true },
    { date: '2026-11-05', reason: 'flood', verified: true },
    { date: '2026-11-06', reason: 'flood', verified: true },
    { date: '2026-11-12', reason: 'illness', verified: true },
  ]);

  const [gaps, setGaps] = useState([
    {
      topicName: 'Algebraic Polynomials & Factorization',
      subject: 'Mathematics',
      severity: 'high' as const,
      absenceReason: 'Sylhet Flash Flood',
      absenceDates: ['Nov 04', 'Nov 05'],
      estimatedHours: 3.5,
    },
    {
      topicName: 'Newtonian Laws of Motion & Friction',
      subject: 'Physics',
      severity: 'high' as const,
      absenceReason: 'Sylhet Flash Flood',
      absenceDates: ['Nov 06'],
      estimatedHours: 4.0,
    },
    {
      topicName: 'Periodic Table Trends & Valency',
      subject: 'Chemistry',
      severity: 'medium' as const,
      absenceReason: 'Viral Illness',
      absenceDates: ['Nov 12'],
      estimatedHours: 2.0,
    },
  ]);

  const handleRecordAbsence = (e: React.FormEvent) => {
    e.preventDefault();
    setAbsences([...absences, { date, reason, verified: true }]);
    toast.success('Disruption recorded! New knowledge gaps mapped to syllabus.');
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel-elevated p-8 rounded-3xl border border-white/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 nakshi-ribbon-bottom">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-[11px] font-bold text-terracotta mb-2 border border-terracotta/20">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Curriculum Deficit Analytics</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-matti">
            Disruption & Gap Engine
          </h1>
          <p className="text-sm text-matti-light mt-1">
            Tracking missed school days and pinpointing exact curriculum loss for accelerated catch-up.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          variant="primary"
          size="md"
          className="self-start sm:self-auto shadow-md shadow-terracotta/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Disrupted Absence
        </Button>
      </div>

      {/* Calendar Section */}
      <AbsenceCalendar absences={absences} />

      {/* Gap Analysis Summary */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-bold text-matti flex items-center gap-2.5">
              <span>Detected Knowledge Gaps</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-terracotta/10 text-terracotta font-bold border border-terracotta/20">
                {gaps.length} Topics
              </span>
            </h2>
            <p className="text-xs text-matti-light mt-0.5">
              Curriculum dependencies flagged during recent school closure dates.
            </p>
          </div>

          <Link
            to="/student/recovery-plans"
            className="text-xs font-bold text-terracotta hover:underline inline-flex items-center gap-1.5 self-start"
          >
            <Sparkles className="w-3.5 h-3.5 text-turmeric" />
            <span>Launch AI Recovery Pathway</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gaps.map((gap, idx) => (
            <GapSummaryCard key={idx} {...gap} />
          ))}
        </div>
      </div>

      {/* Record Absence Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log Disruption / Absence Event"
      >
        <form onSubmit={handleRecordAbsence} className="space-y-4">
          <Input
            label="Date of Disruption"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-matti mb-1.5">
              Disruption Cause / Category
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-parchment-dark bg-white/80 text-matti text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
            >
              <option value="flood">Monsoon Flood / Inundation (বন্যা)</option>
              <option value="cyclone">Cyclone / Severe Weather Closure</option>
              <option value="illness">Illness / Medical Leave</option>
              <option value="family">Family Crisis</option>
              <option value="other">Institutional Closure</option>
            </select>
          </div>

          <Input
            label="Contextual Description"
            placeholder="e.g. Inundated access roads, school suspended for 3 days"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button type="submit" variant="primary" size="md" className="w-full mt-3 shadow-md shadow-terracotta/20">
            Map to Curriculum & Detect Gaps
          </Button>
        </form>
      </Modal>
    </div>
  );
};
