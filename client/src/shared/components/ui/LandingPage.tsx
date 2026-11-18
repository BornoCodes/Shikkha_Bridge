import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { BridgeScene } from '../../art/BridgeScene';
import { KanthaBand } from '../../art/KanthaBorder';

const STEPS = [
  { n: '১', title: 'Tell us the days you missed', sub: 'Floods, fever, anything.' },
  { n: '২', title: 'Take a short quiz', sub: 'We find what to catch up on.' },
  { n: '৩', title: 'Follow your plan', sub: 'Your teacher approves it first.' },
];

export const LandingPage: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <header>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <Link to="/login" className="px-4 py-2 text-[#6B5344] hover:text-[#C84B31] no-underline">Sign in</Link>
          <Link to="/register" className="px-4 py-2 rounded-xl bg-[#C84B31] text-white no-underline hover:bg-[#B43F27]">Start</Link>
        </div>
      </div>
      <KanthaBand />
    </header>

    <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-heading text-[40px] sm:text-[56px] leading-[1.05] text-[#2D1B0E] text-center max-w-2xl mx-auto">
        Missed class? Cross back over.
      </h1>
      <p className="text-center text-[#C84B31] font-heading text-[20px] mt-2">ফিরে এসো, পিছিয়ে থেকো না</p>

      <div className="max-w-2xl mx-auto mt-8">
        <BridgeScene />
      </div>

      <div className="flex justify-center gap-3 mt-8">
        <Link to="/register" className="px-6 py-3 rounded-xl bg-[#C84B31] text-white no-underline hover:bg-[#B43F27]">Create account</Link>
        <Link to="/login" className="px-6 py-3 rounded-xl paper no-underline text-[#2D1B0E]">Sign in</Link>
      </div>

      <ol className="grid sm:grid-cols-3 gap-4 mt-14 list-none p-0">
        {STEPS.map((s) => (
          <li key={s.n} className="paper rounded-xl p-5 text-center">
            <span className="font-heading text-[34px] text-[#C84B31] leading-none">{s.n}</span>
            <h2 className="font-heading text-[18px] text-[#2D1B0E] mt-2">{s.title}</h2>
            <p className="text-sm text-[#6B5344] mt-1">{s.sub}</p>
          </li>
        ))}
      </ol>
    </main>
  </div>
);
