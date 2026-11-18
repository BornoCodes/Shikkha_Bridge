import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/ui/PageHeader';
import { ProgressBar } from '../../../shared/components/ui/ProgressBar';
import { demoPlans } from '../../../shared/data/studyData';

export const RecoveryPlanListPage: React.FC = () => (
  <div>
    <PageHeader
      bn="পরিকল্পনা"
      title="Catch-up plans"
      sub="Each plan is checked by your teacher before you start."
      right={
        <Link to="/student/recovery-plans/new" className="px-5 py-2 rounded-xl bg-[#C84B31] text-white no-underline">
          New plan
        </Link>
      }
    />

    <ul className="grid gap-4 list-none p-0">
      {demoPlans.map((p) => (
        <li key={p.id} className="paper rounded-xl p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-[21px] text-[#2D1B0E]">{p.title}</h2>
              <p className="text-sm text-[#6B5344]">{p.disruption} · {p.teacher}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full ${p.status === 'approved' ? 'bg-[#4E7D5B]/15 text-[#3C6247]' : 'bg-[#E8A317]/20 text-[#8A5F00]'}`}>
              {p.status === 'approved' ? 'Approved' : 'Waiting for teacher'}
            </span>
          </div>
          <div className="mt-4">
            <ProgressBar progress={p.progress} label={`${p.completedSteps} of ${p.totalSteps} steps`} color="terracotta" />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-[#6B5344]">About {p.totalHours} hours</span>
            <Link to={`/student/recovery-plans/${p.id}`} className="text-[#C84B31] font-medium">Open</Link>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
