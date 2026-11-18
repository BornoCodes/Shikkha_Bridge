import React from 'react';
import { PageHeader } from '../../../shared/components/ui/PageHeader';
import { UnifiedLearningPath } from '../../../shared/components/ui/UnifiedLearningPath';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useTier } from '../../../shared/hooks/useTier';
import { kidsCheckpoints, universityCheckpoints } from '../../../shared/data/studyData';

/** The step-by-step path. It used to sit on the dashboard; now it has its own page. */
export const PathPage: React.FC = () => {
  const { user } = useAuth();
  const [tier] = useTier(user?.tier);
  const kids = tier === 'kids';

  return (
    <div>
      <PageHeader bn="আমার পথ" title="My path" sub="One step at a time. The next step is always the highlighted one." />
      <UnifiedLearningPath
        courseName={kids ? 'Fun Primary Mathematics & Nature Science' : 'Data Structures & Recurrence Relations'}
        courseCode={kids ? 'KIDS-M1' : 'CSE220'}
        tier={tier}
        checkpoints={kids ? kidsCheckpoints : universityCheckpoints}
      />
    </div>
  );
};
