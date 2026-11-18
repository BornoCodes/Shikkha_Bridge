import React from 'react';
import { Badge } from '../../../shared/components/ui/Badge';
import { Video, FileText, Dumbbell, ExternalLink, User } from 'lucide-react';

interface ContentCardProps {
  title: string;
  description: string;
  type: 'video' | 'note' | 'exercise' | 'article';
  subject: string;
  topicName: string;
  uploadedBy: string;
  url: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  description,
  type,
  subject,
  topicName,
  uploadedBy,
  url,
}) => {
  const typeIcons = {
    video: Video,
    note: FileText,
    exercise: Dumbbell,
    article: FileText,
  };

  const Icon = typeIcons[type] || FileText;

  const typeBadges = {
    video: 'river' as const,
    note: 'terracotta' as const,
    exercise: 'turmeric' as const,
    article: 'neutral' as const,
  };

  return (
    <div className="bg-cream border border-parchment-dark hover:border-terracotta/40 rounded-3xl p-6 shadow-xs transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <Badge variant={typeBadges[type]} size="sm">
            <Icon className="w-3.5 h-3.5 mr-1" />
            <span className="uppercase">{type}</span>
          </Badge>
          <span className="text-xs font-semibold text-matti-light uppercase">
            {subject}
          </span>
        </div>

        <h3 className="font-heading text-lg font-bold text-matti mb-1">
          {title}
        </h3>

        <p className="text-xs text-matti-light line-clamp-2 mb-4">
          {description}
        </p>

        <div className="text-[11px] text-matti-light bg-parchment p-2 rounded-xl">
          Topic: <strong className="text-matti">{topicName}</strong>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-parchment-dark flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-matti-light">
          <User className="w-3.5 h-3.5 text-terracotta" />
          <span>{uploadedBy}</span>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-terracotta hover:underline inline-flex items-center gap-1"
        >
          <span>Open Material</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
