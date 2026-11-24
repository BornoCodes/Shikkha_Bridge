import React from 'react';
import { PageHeader } from '../../../shared/components/layout/PageHeader';
import { AlponaRosette } from '../../../shared/bengali-art/Motifs';
import { BengaliAvatar } from '../../../shared/bengali-art/BengaliAvatar';
import { useAvatar } from '../../../shared/bengali-art/avatarConfig';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useGuide } from '../../../shared/study-guide';
import { Link } from 'react-router-dom';

/** The starting page. Features from teammates will appear here as they are merged. */
export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { openGuide } = useGuide();
  const [avatar] = useAvatar(user?.id);
  const first = (user?.name ?? '').split(' ')[0] || 'friend';

  return (
    <div>
      <PageHeader bn={`নমস্কার, ${first}`} title={`Hello, ${first}`} sub="Welcome to ShikkhaBridge." />

      <section className="paper relative rounded-2xl p-6 sm:p-8 flex flex-wrap items-center gap-6">
        <AlponaRosette size={72} className="absolute right-5 top-5 opacity-20" />
        <BengaliAvatar config={avatar} size={120} title="Your character" />
        <div className="flex-1 min-w-[220px]">
          <h2 className="font-heading text-[26px] text-[#2D1B0E]">Your corner is ready</h2>
          <p className="text-[#6B5344] mt-1">
            Make your character look like you, and say hello to your study guide. More tools will appear here soon.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/profile" className="px-5 py-2 rounded-xl bg-[#C84B31] text-white no-underline hover:bg-[#B43F27]">Customize my character</Link>
            <button type="button" onClick={() => openGuide()} className="px-5 py-2 rounded-xl paper text-[#2D1B0E]">Talk to my guide</button>
          </div>
        </div>
      </section>

      <p className="mt-6 text-center text-sm text-[#6B5344]">
        Lost? Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#EAD5BC] text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#EAD5BC] text-xs">M</kbd> and ask your guide.
      </p>
    </div>
  );
};
