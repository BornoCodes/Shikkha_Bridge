import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarX, FileQuestion, Map, Library } from 'lucide-react';
import { PageHeader } from '../../../../shared/components/ui/PageHeader';
import { Button } from '../../../../shared/components/ui/Button';
import { Kolka } from '../../../../shared/art/Motifs';
import { useAuth } from '../../../../shared/hooks/useAuth';
import { nextLesson, nextQuiz } from '../../../../shared/guide/guideBrain';
import { useStudyState } from '../../../../shared/guide/useStudyState';
import { useGuide } from '../../../../shared/guide';

const Tile: React.FC<{ to: string; icon: React.ReactNode; title: string; bn: string }> = ({ to, icon, title, bn }) => (
  <Link to={to} className="paper rounded-xl p-5 flex items-center gap-3 no-underline hover:!outline-[#C84B31] transition-colors">
    <span className="text-[#C84B31]">{icon}</span>
    <span>
      <span className="block font-heading text-[18px] text-[#2D1B0E] leading-tight">{title}</span>
      <span className="block text-xs text-[#6B5344]">{bn}</span>
    </span>
  </Link>
);

/** Today: one thing to do next, and a few doors. Nothing else. */
export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openGuide } = useGuide();
  const state = useStudyState();
  const lesson = nextLesson(state);
  const quiz = nextQuiz(state);
  const first = (user?.name ?? '').split(' ')[0] || 'friend';

  return (
    <div>
      <PageHeader bn={`স্বাগতম, ${first}`} title={`Hello, ${first}`} sub="Here is the one thing to do next." />

      <section className="paper relative rounded-2xl p-6 sm:p-8 overflow-hidden">
        <Kolka size={64} className="absolute right-5 top-5 opacity-25" />
        {lesson ? (
          <>
            <p className="text-sm text-[#C84B31] font-medium">Start here · এখান থেকে শুরু</p>
            <h2 className="font-heading text-[26px] sm:text-[30px] leading-snug text-[#2D1B0E] mt-1 max-w-xl">{lesson.title}</h2>
            <p className="text-[#6B5344] mt-2">{lesson.why}</p>
            <Button className="mt-5" size="lg" onClick={() => navigate(lesson.to)}>
              Start <ArrowRight className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <h2 className="font-heading text-[26px] text-[#2D1B0E]">You are all caught up</h2>
            <p className="text-[#6B5344] mt-2">Nothing waiting. Browse the library or take a practice quiz.</p>
          </>
        )}
        {quiz && (
          <p className="mt-5 pt-4 border-t border-dashed border-[#EAD5BC] text-sm text-[#6B5344]">
            Then take the quiz: <Link to={`/student/assessments/${quiz.id}`} className="text-[#C84B31] font-medium">{quiz.topic}</Link>
          </p>
        )}
      </section>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <Tile to="/student/path" icon={<Map size={24} />} title="My path" bn="আমার পথ" />
        <Tile to="/student/assessments" icon={<FileQuestion size={24} />} title="Quizzes" bn="কুইজ" />
        <Tile to="/student/content" icon={<Library size={24} />} title="Library" bn="পাঠাগার" />
        <Tile to="/student/absences" icon={<CalendarX size={24} />} title="I was away" bn="আমি অনুপস্থিত ছিলাম" />
      </div>

      <p className="mt-6 text-center text-sm text-[#6B5344]">
        Lost? <button type="button" onClick={() => openGuide()} className="text-[#C84B31] font-medium underline">Ask your guide</button> or press Ctrl + M.
      </p>
    </div>
  );
};
