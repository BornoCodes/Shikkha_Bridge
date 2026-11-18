import React from 'react';
import { Badge } from '../../../../shared/components/ui/Badge';
import { ProgressBar } from '../../../../shared/components/ui/ProgressBar';
import { Button } from '../../../../shared/components/ui/Button';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StudentHealthProps {
  id: string;
  name: string;
  studentClass: string;
  disruptionReason: string;
  gapCount: number;
  planStatus: 'pending' | 'approved' | 'in_progress' | 'none';
  recoveryProgress: number;
}

export const StudentHealthCard: React.FC<StudentHealthProps> = ({
  id,
  name,
  studentClass,
  disruptionReason,
  gapCount,
  planStatus,
  recoveryProgress,
}) => {
  const statusBadges = {
    pending: { label: 'PLAN NEEDS REVIEW', variant: 'turmeric' as const },
    approved: { label: 'PLAN ACTIVE', variant: 'success' as const },
    in_progress: { label: 'IN PROGRESS', variant: 'river' as const },
    none: { label: 'NO PLAN YET', variant: 'danger' as const },
  };

  return (
    <div className="bg-cream border border-parchment-dark hover:border-terracotta/40 rounded-3xl p-6 shadow-xs transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <Badge variant={statusBadges[planStatus].variant} size="sm">
            {statusBadges[planStatus].label}
          </Badge>
          <span className="text-xs text-matti-light">{studentClass}</span>
        </div>

        <h3 className="font-heading text-xl font-bold text-matti mb-1">{name}</h3>
        <p className="text-xs text-matti-light mb-4">
          Disruption cause: <strong className="text-matti">{disruptionReason}</strong>
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-matti-light">Identified Knowledge Gaps:</span>
            <span className="font-bold text-terracotta">{gapCount} Topics</span>
          </div>

          <ProgressBar
            progress={recoveryProgress}
            label="Catch-Up Completion"
            color="terracotta"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-parchment-dark">
        <Link to={`/teacher/plans/${id}`}>
          <Button
            variant={planStatus === 'pending' ? 'primary' : 'outline'}
            size="sm"
            className="w-full"
          >
            <span>{planStatus === 'pending' ? 'Review & Approve Plan' : 'View Student Progress'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
