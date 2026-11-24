
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/ui/PageHeader';
import { recoveryService } from '../services/recovery.service';

export const RecoveryPlanCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError('');

      const response = await recoveryService.generatePlan();
      const plan = response.data;

      if (!plan?.id) {
        throw new Error('The server did not return a recovery plan.');
      }

      navigate(`/student/recovery-plans/${plan.id}`);
    } catch (err) {
      console.error('Recovery plan generation failed:', err);
      setError(
        'Could not generate your recovery plan. Please check your connection and try again.'
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <PageHeader
        bn="নতুন পরিকল্পনা"
        title="Create a recovery plan"
        sub="Generate a personalized plan to help you catch up on missed lessons."
      />

      <div className="paper rounded-xl p-6 max-w-2xl">
        <h2 className="font-heading text-xl text-[#2D1B0E]">
          Ready to catch up?
        </h2>

        <p className="mt-3 text-sm text-[#6B5344] leading-6">
          Shikkha Bridge will analyze your recorded absences, learning gaps,
          and assessment results to create a personalized recovery plan.
        </p>

        <p className="mt-3 text-sm text-[#6B5344]">
          Your plan will be saved so you can track your progress.
        </p>

        {error && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="px-5 py-3 rounded-xl bg-[#C84B31] text-white font-medium disabled:opacity-60"
          >
            {generating ? 'Generating your plan...' : 'Generate my recovery plan'}
          </button>

          <Link
            to="/student/recovery-plans"
            className="px-5 py-3 rounded-xl border border-[#D8C5AD] text-[#6B5344] no-underline"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecoveryPlanCreatePage;
