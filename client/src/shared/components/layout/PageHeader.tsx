import React from 'react';
import { KanthaBorder } from '../../bengali-art/KanthaBorder';

interface PageHeaderProps {
  /** Bangla title, shown small above the English one */
  bn: string;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}

/** One consistent heading for every page: Bangla kicker, title, one line of help. */
export const PageHeader: React.FC<PageHeaderProps> = ({ bn, title, sub, right }) => (
  <>
    <header className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <p className="font-heading text-[15px] text-[#C84B31] mb-0.5">{bn}</p>
        <h1 className="font-heading text-[32px] sm:text-[40px] leading-[1.1] text-[#2D1B0E]">{title}</h1>
        {sub && <p className="mt-1.5 text-[#6B5344] max-w-xl">{sub}</p>}
      </div>
      {right}
    </header>
    <KanthaBorder variant="stitch" className="my-5" opacity={0.75} />
  </>
);
