import React from 'react';
import { KANTHA_COLORS as C } from './kanthaPatterns';

interface MotifProps {
  size?: number;
  className?: string;
  color?: string;
  accent?: string;
}

/** Alpona rosette: the rice-paste floor art drawn at the door on festival days. */
export const AlponaRosette: React.FC<MotifProps> = ({ size = 120, className, color = C.terra, accent = C.gold }) => {
  const big = Array.from({ length: 8 }, (_, i) => i * 45);
  const small = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5);
  const dots = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return (
    <svg viewBox="-50 -50 100 100" width={size} height={size} className={className} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        {big.map((a) => (
          <path key={a} d="M0 -9 C8 -18 8 -32 0 -42 C-8 -32 -8 -18 0 -9Z" transform={`rotate(${a})`} />
        ))}
        {small.map((a) => (
          <path key={a} d="M0 -22 C4 -28 4 -34 0 -38 C-4 -34 -4 -28 0 -22Z" transform={`rotate(${a})`} stroke={accent} />
        ))}
        <circle r="6.5" stroke={accent} />
        <circle r="48.5" strokeDasharray="1.5 4" />
      </g>
      <circle r="3" fill={accent} />
      {dots.map((a) => (
        <circle key={a} cx="0" cy="-45" r="1.5" fill={color} transform={`rotate(${a})`} />
      ))}
    </svg>
  );
};

/** Kolka (paisley), the curled mango shape that fills so many kantha quilts. */
export const Kolka: React.FC<MotifProps> = ({ size = 56, className, color = C.terra, accent = C.lotus }) => (
  <svg viewBox="0 0 48 64" width={size} height={(size * 64) / 48} className={className} aria-hidden="true">
    <path
      d="M24 3 C41 10 45 32 33 47 C25 57 10 58 6 47 C3 38 11 31 19 34 C26 37 24 45 18 44"
      fill={accent}
      fillOpacity="0.22"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M24 12 C34 18 36 31 29 41" fill="none" stroke={C.gold} strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2 3.5" />
    <circle cx="17" cy="40" r="2" fill={C.gold} />
    <circle cx="26" cy="20" r="1.5" fill={color} />
  </svg>
);

/** Machh (fish), a lucky motif in Bengali alpona and kantha. */
export const Machh: React.FC<MotifProps> = ({ size = 64, className, color = C.terra, accent = C.gold }) => (
  <svg viewBox="0 0 64 36" width={size} height={(size * 36) / 64} className={className} aria-hidden="true">
    <path d="M4 18 C14 3 34 3 46 18 C34 33 14 33 4 18Z" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M46 18 L60 6 L57 18 L60 30Z" fill={accent} fillOpacity="0.35" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M20 10 Q24 18 20 26 M28 8 Q32 18 28 28 M36 11 Q39 18 36 25" fill="none" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="13" cy="16" r="2" fill={C.ink} />
  </svg>
);

/** Shapla (water lily): Bangladesh's national flower. */
export const Shapla: React.FC<MotifProps> = ({ size = 56, className }) => (
  <svg viewBox="0 0 56 40" width={size} height={(size * 40) / 56} className={className} aria-hidden="true">
    <ellipse cx="28" cy="34" rx="26" ry="5" fill={C.leaf} fillOpacity="0.85" />
    <path d="M28 6 C34 12 34 22 28 30 C22 22 22 12 28 6Z" fill="#FFFFFF" stroke={C.lotus} strokeWidth="1.4" />
    <path d="M28 30 C18 29 11 23 10 14 C19 15 25 21 28 30Z" fill="#FFF4F8" stroke={C.lotus} strokeWidth="1.4" />
    <path d="M28 30 C38 29 45 23 46 14 C37 15 31 21 28 30Z" fill="#FFF4F8" stroke={C.lotus} strokeWidth="1.4" />
    <circle cx="28" cy="27" r="3" fill={C.gold} />
  </svg>
);
