import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../shared/components/ui/Badge';
import { ProgressBar } from '../../../shared/components/ui/ProgressBar';
import { Button } from '../../../shared/components/ui/Button';
import { Compass, Sparkles, ArrowRight } from 'lucide-react';

export const RecoveryPlanListPage: React.FC = () => {
  const plans = [
    {
      id: 'plan-nov-2026',
      title: 'Monsoon Flood Recovery Pathway (Sylhet Region)',
      disruption: 'Sylhet Flash Flood',
      teacher: 'Mohammad Faruk Sir',
      status: 'approved',
      progress: 60,
      totalHours: 9.5,
      completedSteps: 3,
      totalSteps: 5,
      date: 'Nov 08, 2026',
    },
    {
      id: 'plan-illness-recovery',
      title: 'Dengue Medical Catch-Up Pathway',
      disruption: 'Medical Leave',
      teacher: 'Nasrin Sultana Madam',
      status: 'pending',
      progress: 25,
      totalHours: 6.0,
      completedSteps: 1,
      totalSteps: 4,
      date: 'Nov 14, 2026',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel-elevated p-8 rounded-3xl border border-white/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 nakshi-ribbon-bottom">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-[11px] font-bold text-terracotta mb-2 border border-terracotta/20">
            <Compass className="w-3.5 h-3.5" />
            <span>Structured Study Roadmaps</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-matti">
            Personalized Recovery Pathways
          </h1>
          <p className="text-sm text-matti-light mt-1">
            Adaptive study roadmaps generated to bridge missed syllabus lessons.
          </p>
        </div>

        <Link to="/student/recovery-plans/new">
          <Button variant="primary" size="md" className="shadow-md shadow-terracotta/20">
            <Sparkles className="w-4 h-4 mr-2 text-turmeric" />
            Generate New Catch-Up Path
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className="glass-panel-elevated border border-white/80 hover:border-terracotta/40 rounded-3xl p-7 shadow-sm transition-all hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge
                  variant={p.status === 'approved' ? 'success' : 'turmeric'}
                  size="sm"
                >
                  {p.status === 'approved' ? 'FACULTY APPROVED' : 'PENDING REVIEW'}
                </Badge>
                <span className="text-xs text-matti-light font-medium">{p.date}</span>
              </div>

              <h3 className="font-heading text-xl font-bold text-matti mb-1">
                {p.title}
              </h3>
              <p className="text-xs text-matti-light mb-5">
                Disruption cause: <strong className="text-matti">{p.disruption}</strong> • Mentor:{' '}
                {p.teacher}
              </p>

              <div className="space-y-2 mb-4">
                <ProgressBar
                  progress={p.progress}
                  label={`${p.completedSteps} of ${p.totalSteps} Milestones Recovered`}
                  color="terracotta"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-parchment-dark/50 flex items-center justify-between">
              <span className="text-xs text-matti-light">
                Required Time: <strong className="text-matti">{p.totalHours} hrs</strong>
              </span>

              <Link to={`/student/recovery-plans/${p.id}`}>
                <Button variant="outline" size="sm" className="glass-panel hover:bg-white/80">
                  <span>Enter Journey</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
