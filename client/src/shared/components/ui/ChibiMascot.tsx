import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, X, Palette, Volume2, Award } from 'lucide-react';
import { ChibiMascotConfig, MascotSpecies, MascotAccessory } from '../../types';

interface ChibiMascotProps {
  config?: ChibiMascotConfig;
  daysAway?: number;
  currentTopic?: string;
  suggestedAction?: string;
  onOpenCustomizer?: () => void;
  tier?: 'kids' | 'university' | 'school';
}

export const ChibiMascot: React.FC<ChibiMascotProps> = ({
  config = {
    name: 'Mimi',
    species: 'cat',
    color: '#FFF2E2',
    accessory: 'cap',
    level: 3,
    happiness: 95,
  },
  daysAway = 4,
  currentTopic = 'Algebraic Polynomials & Recurrence Relations',
  suggestedAction = 'Watch the 12-min Video Checkpoint first!',
  onOpenCustomizer,
  tier = 'university',
}) => {
  const [isBubbleOpen, setIsBubbleOpen] = useState(true);
  const [isWaving, setIsWaving] = useState(false);

  // Render SVG species details
  const renderEarsAndHead = () => {
    switch (config.species) {
      case 'cat':
        return (
          <>
            {/* Left Cat Ear */}
            <polygon points="26,38 12,12 44,22" fill="#E8A317" stroke="#2D1B0E" strokeWidth="2.5" />
            <polygon points="26,34 18,18 38,24" fill="#D4789C" opacity="0.6" />
            {/* Right Cat Ear */}
            <polygon points="74,38 88,12 56,22" fill="#E8A317" stroke="#2D1B0E" strokeWidth="2.5" />
            <polygon points="74,34 82,18 62,24" fill="#D4789C" opacity="0.6" />
          </>
        );
      case 'tiger':
        return (
          <>
            {/* Tiger Round Ears */}
            <circle cx="24" cy="24" r="14" fill="#E8A317" stroke="#2D1B0E" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="8" fill="#F5E6D3" />
            <circle cx="76" cy="24" r="14" fill="#E8A317" stroke="#2D1B0E" strokeWidth="2.5" />
            <circle cx="76" cy="24" r="8" fill="#F5E6D3" />
            {/* Forehead Stripes */}
            <path d="M46 16 L54 16 M44 21 L56 21 M47 26 L53 26" stroke="#2D1B0E" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'owl':
        return (
          <>
            {/* Owl Feathery Tuft Ears */}
            <path d="M22 28 Q10 8 32 20 Z" fill="#C84B31" stroke="#2D1B0E" strokeWidth="2" />
            <path d="M78 28 Q90 8 68 20 Z" fill="#C84B31" stroke="#2D1B0E" strokeWidth="2" />
          </>
        );
      case 'bunny':
        return (
          <>
            {/* Bunny Long Tall Ears */}
            <ellipse cx="32" cy="12" rx="8" ry="20" fill={config.color} stroke="#2D1B0E" strokeWidth="2" />
            <ellipse cx="32" cy="12" rx="4" ry="14" fill="#D4789C" opacity="0.5" />
            <ellipse cx="68" cy="12" rx="8" ry="20" fill={config.color} stroke="#2D1B0E" strokeWidth="2" />
            <ellipse cx="68" cy="12" rx="4" ry="14" fill="#D4789C" opacity="0.5" />
          </>
        );
    }
  };

  const renderAccessory = () => {
    switch (config.accessory) {
      case 'cap':
        return (
          <g transform="translate(32, 10)">
            {/* Graduation / Scholar Cap */}
            <polygon points="18,2 34,9 18,16 2,9" fill="#2D1B0E" />
            <rect x="12" y="11" width="12" height="6" rx="2" fill="#2D1B0E" />
            <path d="M30 11 Q36 18 36 24" stroke="#E8A317" strokeWidth="2" fill="none" />
            <circle cx="36" cy="24" r="2" fill="#E8A317" />
          </g>
        );
      case 'glasses':
        return (
          <g stroke="#2D1B0E" strokeWidth="2" fill="none" transform="translate(0, 4)">
            <circle cx="36" cy="52" r="11" fill="rgba(255,255,255,0.4)" />
            <circle cx="64" cy="52" r="11" fill="rgba(255,255,255,0.4)" />
            <line x1="47" y1="52" x2="53" y2="52" />
          </g>
        );
      case 'flower':
        return (
          <g transform="translate(68, 22)">
            {/* Red / Lotus Flower */}
            <circle cx="0" cy="0" r="7" fill="#D4789C" stroke="#2D1B0E" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="3" fill="#E8A317" />
          </g>
        );
      case 'scarf':
        return (
          <path
            d="M32 72 Q50 82 68 72 Q64 88 50 84 Q36 88 32 72 Z"
            fill="#C84B31"
            stroke="#2D1B0E"
            strokeWidth="2"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative inline-flex items-end gap-3 z-30 select-none">
      {/* Speech Bubble Guide */}
      <AnimatePresence>
        {isBubbleOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="w-72 sm:w-80 glass-panel-elevated p-4 rounded-3xl border border-turmeric/40 shadow-xl relative nakshi-ribbon-bottom"
          >
            {/* Close speech bubble */}
            <button
              onClick={() => setIsBubbleOpen(false)}
              className="absolute top-2.5 right-2.5 p-1 rounded-full text-matti-light/60 hover:text-terracotta hover:bg-parchment transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Header with Mascot Name & Level */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-terracotta font-heading">
                {config.name} (Your AI Study Buddy)
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-turmeric/20 text-turmeric-dark font-bold border border-turmeric/30">
                Lv. {config.level}
              </span>
            </div>

            {/* Friendly Student-First Guidance Speech */}
            <p className="text-xs text-matti/90 leading-relaxed font-sans">
              {daysAway > 0 ? (
                <>
                  <strong className="text-terracotta font-bold">Welcome back!</strong> You've been away for <span className="underline decoration-turmeric font-bold">{daysAway} days</span> due to school/campus closures.
                </>
              ) : (
                <>
                  <strong className="text-emerald-700 font-bold">Great to see you!</strong> Let's keep your recovery streak alive today.
                </>
              )}
            </p>

            <div className="mt-2.5 p-2.5 rounded-xl bg-parchment/70 border border-white/80 text-[11px] text-matti flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-turmeric shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-terracotta block">Next Checkpoint on Path:</span>
                <span className="text-matti-light">{suggestedAction}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-parchment-dark/50">
              <button
                onClick={onOpenCustomizer}
                className="text-[11px] font-bold text-terracotta hover:underline inline-flex items-center gap-1"
              >
                <Palette className="w-3 h-3 text-turmeric" />
                <span>Customize Mascot</span>
              </button>

              <span className="text-[10px] text-matti-light/70">
                Happiness: {config.happiness}% ✨
              </span>
            </div>

            {/* Speech bubble pointer arrow */}
            <div className="absolute -bottom-2 right-10 w-4 h-4 bg-white/90 border-r border-b border-turmeric/40 rotate-45 transform" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Animated Kawaii Chibi Character SVG */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsBubbleOpen(!isBubbleOpen);
          setIsWaving(true);
          setTimeout(() => setIsWaving(false), 1200);
        }}
        className="cursor-pointer relative flex flex-col items-center group"
      >
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-md"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Chibi Tail */}
            {config.species === 'cat' && (
              <motion.path
                animate={{ rotate: [-8, 8, -8] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                d="M 28 85 Q 12 80 16 65"
                stroke="#E8A317"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Tiny Chibi Body (Small body, big head proportion) */}
            <ellipse cx="50" cy="78" rx="19" ry="15" fill={config.color} stroke="#2D1B0E" strokeWidth="2.5" />
            {/* Belly highlight */}
            <ellipse cx="50" cy="78" rx="12" ry="9" fill="#FFF" opacity="0.6" />

            {/* Little Paws / Feet */}
            <circle cx="38" cy="90" r="5" fill="#E8A317" stroke="#2D1B0E" strokeWidth="2" />
            <circle cx="62" cy="90" r="5" fill="#E8A317" stroke="#2D1B0E" strokeWidth="2" />

            {/* Waving Hand Paw */}
            <motion.ellipse
              animate={isWaving ? { rotate: [0, -25, 10, -25, 0] } : { rotate: [0, -8, 0] }}
              transition={{ duration: 1.2, repeat: isWaving ? 2 : Infinity }}
              cx="72"
              cy="74"
              rx="6"
              ry="5"
              fill={config.color}
              stroke="#2D1B0E"
              strokeWidth="2"
            />
            {/* Other Paw */}
            <circle cx="28" cy="74" r="5" fill={config.color} stroke="#2D1B0E" strokeWidth="2" />

            {/* Ears based on Species */}
            {renderEarsAndHead()}

            {/* Big Rounded Chibi Head */}
            <ellipse cx="50" cy="48" rx="34" ry="28" fill={config.color} stroke="#2D1B0E" strokeWidth="2.8" />

            {/* Rosy Kawaii Blush Cheeks */}
            <ellipse cx="26" cy="56" rx="6" ry="3.5" fill="#D4789C" opacity="0.55" />
            <ellipse cx="74" cy="56" rx="6" ry="3.5" fill="#D4789C" opacity="0.55" />

            {/* Huge Glimmering Sparkling Kawaii Anime Eyes */}
            <g id="kawaii-eyes">
              {/* Left Eye */}
              <ellipse cx="36" cy="48" rx="8.5" ry="11" fill="#2D1B0E" />
              {/* Primary Eye Catchlight Sparkle */}
              <circle cx="33.5" cy="44" r="3.8" fill="#FFF" />
              {/* Secondary Star Sparkle */}
              <circle cx="39" cy="52" r="1.8" fill="#FFF" />
              <ellipse cx="36" cy="55" rx="3" ry="1.5" fill="#6B5344" />

              {/* Right Eye */}
              <ellipse cx="64" cy="48" rx="8.5" ry="11" fill="#2D1B0E" />
              {/* Primary Eye Catchlight Sparkle */}
              <circle cx="61.5" cy="44" r="3.8" fill="#FFF" />
              {/* Secondary Star Sparkle */}
              <circle cx="67" cy="52" r="1.8" fill="#FFF" />
              <ellipse cx="64" cy="55" rx="3" ry="1.5" fill="#6B5344" />
            </g>

            {/* Tiny Cute Kawaii Smile */}
            <path
              d="M 46 56 Q 50 60 54 56"
              stroke="#2D1B0E"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Tiny Triangular Cute Nose */}
            <polygon points="50,52 48,50 52,50" fill="#D4789C" />

            {/* Cat Whiskers */}
            {config.species === 'cat' && (
              <g stroke="#2D1B0E" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
                <line x1="20" y1="52" x2="8" y2="49" />
                <line x1="20" y1="55" x2="9" y2="57" />
                <line x1="80" y1="52" x2="92" y2="49" />
                <line x1="80" y1="55" x2="91" y2="57" />
              </g>
            )}

            {/* Accessory Render (Cap, glasses, flower, scarf) */}
            {renderAccessory()}
          </svg>
        </motion.div>

        {/* Mascot Name Badge below */}
        <span className="mt-0.5 px-2 py-0.5 rounded-full bg-cream/90 border border-terracotta/30 text-[10px] font-bold text-terracotta shadow-xs">
          {config.name}
        </span>
      </motion.div>
    </div>
  );
};
