import React from 'react';
import { KANTHA_COLORS as C } from './kanthaPatterns';
import { Kolka, Machh, Shapla } from './Motifs';

/**
 * Landing hero: a river between two banks, joined by a bridge made of
 * kantha patches. Fish swim underneath and shapla float on the water.
 */
const P0 = { x: 96, y: 232 };
const P1 = { x: 240, y: 118 };
const P2 = { x: 384, y: 232 };
const PATCH_COLORS = [C.terra, C.gold, C.lotus, C.river, C.leaf];

const bezier = (t: number) => ({
  x: (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t ** 2 * P2.x,
  y: (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y,
  angle:
    (Math.atan2(2 * (1 - t) * (P1.y - P0.y) + 2 * t * (P2.y - P1.y), 2 * (1 - t) * (P1.x - P0.x) + 2 * t * (P2.x - P1.x)) *
      180) /
    Math.PI,
});

const patches = Array.from({ length: 11 }, (_, i) => bezier(0.04 + i * 0.092));

export const BridgeScene: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative ${className ?? ''}`} style={{ aspectRatio: '480 / 340' }}>
    <svg
      viewBox="0 0 480 340"
      className="absolute inset-0 w-full h-full"
      role="img"
      aria-label="A bridge of kantha patches over a river, with fish and water lilies"
    >
      {/* sun */}
      <g transform="translate(392 66)">
        {Array.from({ length: 16 }, (_, i) => (
          <line key={i} x1="0" y1="-31" x2="0" y2={i % 2 ? -38 : -45} stroke={C.gold} strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 22.5})`} />
        ))}
        <circle r="24" fill={C.gold} />
        <circle r="15" fill="none" stroke={C.cream} strokeWidth="2" strokeDasharray="3 4" />
      </g>

      {/* river */}
      <rect x="60" y="236" width="360" height="104" fill={C.river} fillOpacity="0.9" />
      {[262, 286, 310].map((y, r) => (
        <path
          key={y}
          d={`M60 ${y} q 15 -9 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0`}
          fill="none"
          stroke={C.cream}
          strokeWidth="2"
          strokeDasharray="7 6"
          strokeLinecap="round"
          opacity={0.85 - r * 0.2}
        />
      ))}

      {/* banks */}
      <path d="M0 246 Q40 226 100 240 L100 340 L0 340Z" fill={C.leaf} />
      <path d="M380 240 Q440 226 480 246 L480 340 L380 340Z" fill={C.leaf} />
      <path d="M0 262 Q40 246 98 258" fill="none" stroke={C.cream} strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" />
      <path d="M382 258 Q440 246 480 262" fill="none" stroke={C.cream} strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" />

      {/* the bridge: an arch of patches, with a running stitch along the top */}
      <path d={`M${P0.x} ${P0.y} Q${P1.x} ${P1.y} ${P2.x} ${P2.y}`} fill="none" stroke={C.ink} strokeOpacity="0.16" strokeWidth="26" strokeLinecap="round" />
      {patches.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.angle})`}>
          <rect x="-13" y="-10" width="26" height="20" rx="2" fill={PATCH_COLORS[i % PATCH_COLORS.length]} />
          <rect x="-10" y="-7" width="20" height="14" rx="1" fill="none" stroke={C.cream} strokeWidth="1.3" strokeDasharray="3 2.5" />
        </g>
      ))}
      <path d={`M${P0.x} ${P0.y - 20} Q${P1.x} ${P1.y - 20} ${P2.x} ${P2.y - 20}`} fill="none" stroke={C.terra} strokeWidth="2.5" strokeDasharray="6 5" strokeLinecap="round" />
    </svg>

    {/* motifs are separate SVGs so they keep their own proportions */}
    <style>{`
      .bs-fish-a { left: 24%; top: 80%; animation: bs-swim 7s ease-in-out infinite alternate; }
      .bs-fish-b { left: 58%; top: 88%; animation: bs-swim 9s ease-in-out infinite alternate-reverse; }
      @keyframes bs-swim { from { transform: translateX(-14px); } to { transform: translateX(26px); } }
      @media (prefers-reduced-motion: reduce) { .bs-fish-a, .bs-fish-b { animation: none; } }
    `}</style>
    <Machh size={48} color={C.cream} accent={C.gold} className="absolute bs-fish-a" />
    <Machh size={40} color={C.cream} accent={C.lotus} className="absolute bs-fish-b" />
    <div className="absolute" style={{ left: '12%', top: '8%' }}>
      <Kolka size={34} />
    </div>
    <div className="absolute" style={{ left: '30%', top: '66%' }}>
      <Shapla size={52} />
    </div>
    <div className="absolute" style={{ left: '66%', top: '74%' }}>
      <Shapla size={44} />
    </div>
  </div>
);
