import React from 'react';
import { motion } from 'framer-motion';

export const BengaliArtBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* Soft gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-[#FFF3E6] to-[#FDE8D4] opacity-90" />

      {/* Traditional Alpona Floating Art Top-Right */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.05, 1],
        }}
        transition={{
          rotate: { duration: 90, repeat: Infinity, ease: 'linear' },
          scale: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute -top-28 -right-28 w-[520px] h-[520px] opacity-25"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full text-terracotta" fill="none" stroke="currentColor">
          {/* Concentric Alpona Floral Mandalas */}
          <circle cx="200" cy="200" r="180" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="200" cy="200" r="140" strokeWidth="1.5" stroke="#E8A317" />
          <circle cx="200" cy="200" r="100" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="200" cy="200" r="50" strokeWidth="1.8" stroke="#C84B31" />
          <circle cx="200" cy="200" r="12" fill="#E8A317" fillOpacity="0.4" />
          {/* Radiating Petals */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 200 200)`}>
              <path
                d="M200 60 Q215 110 200 150 Q185 110 200 60 Z"
                fill="#C84B31"
                fillOpacity="0.08"
                stroke="#C84B31"
                strokeWidth="1.2"
              />
              <circle cx="200" cy="45" r="4" fill="#E8A317" />
              <path d="M196 165 L204 165" stroke="#E8A317" strokeWidth="2" />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Traditional Bengali Floral / Mango Motif (Kalka) Bottom-Left */}
      <motion.div
        animate={{
          y: [0, -18, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-24 -left-20 w-[440px] h-[440px] opacity-20"
      >
        <svg viewBox="0 0 300 300" className="w-full h-full" fill="none">
          {/* Traditional Bengali Kalka (Paisley) Contour */}
          <path
            d="M 150,260 C 90,260 50,210 50,150 C 50,90 100,50 150,20 C 180,5 210,15 220,40 C 230,65 210,95 185,110 C 160,125 140,150 140,180 C 140,230 190,240 210,210 C 200,250 180,260 150,260 Z"
            stroke="#C84B31"
            strokeWidth="1.8"
            fill="#E8A317"
            fillOpacity="0.05"
          />
          {/* Inner Nakshi Kantha Cross-Hatch Stitches */}
          <path
            d="M 90,160 L 170,160 M 100,180 L 160,180 M 110,140 L 180,140 M 120,120 L 170,120 M 130,100 L 170,100"
            stroke="#E8A317"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <circle cx="150" cy="180" r="16" stroke="#C84B31" strokeWidth="1" fill="#D4789C" fillOpacity="0.15" />
          <circle cx="150" cy="180" r="6" fill="#C84B31" />
        </svg>
      </motion.div>

      {/* Center Subtle Terracotta Sun Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-turmeric/10 via-terracotta/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Nakshi Grid Overlay */}
      <div className="absolute inset-0 pattern-nakshi opacity-40 mix-blend-multiply" />
    </div>
  );
};
