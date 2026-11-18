import React from 'react';
import { Link } from 'react-router-dom';
import { KANTHA_COLORS as C } from '../../art/kanthaPatterns';

/** A small bridge of stitches inside a terracotta tile, and the name. Nothing else. */
export const LogoMark: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
    <rect width="40" height="40" rx="11" fill={C.terra} />
    <path d="M6 27 Q20 7 34 27" fill="none" stroke={C.cream} strokeWidth="3.4" strokeLinecap="round" />
    <path d="M6 27 Q20 7 34 27" fill="none" stroke={C.gold} strokeWidth="1.5" strokeDasharray="2.5 3.2" strokeLinecap="round" />
    <path d="M4 31 H36" stroke={C.cream} strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="20" cy="20" r="2" fill={C.gold} />
  </svg>
);

export const Logo: React.FC<{ to?: string; size?: number }> = ({ to = '/', size = 34 }) => (
  <Link to={to} className="inline-flex items-center gap-2.5 no-underline" aria-label="ShikkhaBridge home">
    <LogoMark size={size} />
    <span className="font-heading text-[22px] leading-none text-[#2D1B0E]">
      Shikkha<span className="text-[#C84B31]">Bridge</span>
    </span>
  </Link>
);
