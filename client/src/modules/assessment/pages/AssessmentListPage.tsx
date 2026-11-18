import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/ui/PageHeader';
import { demoQuizzes } from '../../../shared/data/studyData';

export const AssessmentListPage: React.FC = () => (
  <div>
    <PageHeader bn="কুইজ" title="Quizzes" sub="Short quizzes show which topics need work." />

    <ul className="grid gap-4 list-none p-0">
      {demoQuizzes.map((q) => {
        const done = q.status === 'completed';
        return (
          <li key={q.id} className="paper rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#6B5344]">{q.subject} · {q.questions} questions · {q.difficulty}</p>
              <h2 className="font-heading text-[21px] leading-snug text-[#2D1B0E]">{q.topic}</h2>
            </div>
            <div className="flex items-center gap-4">
              {done && <span className="font-heading text-[22px] text-[#4E7D5B]">{q.score}%</span>}
              <Link
                to={`/student/assessments/${q.id}`}
                className={`px-5 py-2 rounded-xl no-underline ${done ? 'border border-[#C84B31] text-[#C84B31]' : 'bg-[#C84B31] text-white'}`}
              >
                {done ? 'Review' : 'Start'}
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
);
