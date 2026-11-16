import React from 'react';
import { Badge } from '../../../shared/components/ui/Badge';
import { AlertCircle, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GapSummaryCardProps {
  topicName: string;
  subject: string;
  severity: 'high' | 'medium' | 'low';
  absenceReason: string;
  absenceDates: string[];
  estimatedHours: number;
  onTakeQuiz?: () => void;
}

export const GapSummaryCard: React.FC<GapSummaryCardProps> = ({
  topicName,
  subject,
  severity,
  absenceReason,
  absenceDates,
  estimatedHours,
  onTakeQuiz,
}) => {
  const severityBadgeVariant =
    severity === 'high' ? 'danger' : severity === 'medium' ? 'warning' : 'neutral';

  return (
    <div className="bg-cream border border-parchment-dark hover:border-terracotta/40 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-matti-light uppercase tracking-wider">
            {subject}
          </span>
          <Badge variant={severityBadgeVariant} size="sm">
            {severity.toUpperCase()} GAP
          </Badge>
        </div>

        <h4 className="font-heading text-lg font-bold text-matti mb-1">{topicName}</h4>

        <div className="flex items-center gap-3 text-xs text-matti-light mt-3">
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-terracotta" />
            <span className="capitalize">{absenceReason}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-turmeric" />
            <span>~{estimatedHours} hrs to bridge</span>
          </div>
        </div>

        <div className="mt-3 text-[11px] text-matti-light bg-parchment p-2 rounded-lg">
          Missed dates: {absenceDates.join(', ')}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-parchment-dark flex items-center justify-between">
        <Link
          to="/student/assessments"
          className="text-xs font-semibold text-terracotta hover:underline inline-flex items-center gap-1"
        >
          <span>Take Diagnostic Quiz</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
