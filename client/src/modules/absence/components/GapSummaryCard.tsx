import React from 'react';
import { Badge } from '../../../shared/components/ui/Badge';
import { AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GapSummaryCardProps {
  topicName: string;
  subject: string;
  severity: 'high' | 'medium' | 'low';
  absenceReason: string;
  absenceDates: string[];
  estimatedHours: number;
}

export const GapSummaryCard: React.FC<GapSummaryCardProps> = ({
  topicName,
  subject,
  severity,
  absenceReason,
  absenceDates,
  estimatedHours,
}) => {
  const severityBadgeVariant =
    severity === 'high' ? 'danger' : severity === 'medium' ? 'warning' : 'neutral';

  return (
    <div className="glass-panel-elevated border border-white/80 hover:border-terracotta/40 rounded-3xl p-6 shadow-sm transition-all hover:-translate-y-1 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-matti-light/90 uppercase tracking-wider">
            {subject}
          </span>
          <Badge variant={severityBadgeVariant} size="sm">
            {severity.toUpperCase()} PRIORITY
          </Badge>
        </div>

        <h4 className="font-heading text-lg font-bold text-matti mb-1 leading-snug">
          {topicName}
        </h4>

        <div className="flex flex-wrap items-center gap-3 text-xs text-matti-light mt-3">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-terracotta" />
            <span className="capitalize font-medium">{absenceReason}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-turmeric-dark" />
            <span>~{estimatedHours} hrs recovery</span>
          </div>
        </div>

        <div className="mt-4 text-[11px] text-matti-light glass-panel p-2.5 rounded-xl border border-white/70">
          Missed schedule: <strong className="text-matti">{absenceDates.join(', ')}</strong>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-parchment-dark/50 flex items-center justify-between">
        <Link
          to="/student/assessments"
          className="text-xs font-bold text-terracotta hover:underline inline-flex items-center gap-1.5"
        >
          <span>Take Diagnostic Check</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
