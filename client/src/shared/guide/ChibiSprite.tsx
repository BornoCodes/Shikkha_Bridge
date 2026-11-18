import React from 'react';
import type { ChibiMascotConfig } from '../types';

export const DEFAULT_MASCOT: ChibiMascotConfig = {
  name: 'Mimi',
  species: 'tiger',
  color: '#FDE68A',
  accessory: 'cap',
} as ChibiMascotConfig;

export type ChibiPose = 'walk' | 'idle' | 'talk' | 'read' | 'sweep' | 'water' | 'nap' | 'wave';

const OUT = '#2D1B0E';
const PINK = '#F4A7A0';
const TERRA = '#C84B31';
const GOLD = '#E8A317';

interface Props {
  config: ChibiMascotConfig;
  pose?: ChibiPose;
  size?: number;
  className?: string;
}

const HEX = /^#[0-9a-fA-F]{6}$/;

/**
 * The study-guide chibi. Pure SVG: species, colour and accessory come from the
 * existing mascot config, and `pose` decides what it is doing.
 */
export const ChibiSprite: React.FC<Props> = ({ config, pose = 'idle', size = 80, className }) => {
  const body = HEX.test(config.color) ? config.color : DEFAULT_MASCOT.color;
  const species = config.species;
  const walking = pose === 'walk';
  const napping = pose === 'nap';
  const eyeY = pose === 'read' ? 36 : 34;

  const stroke = { stroke: OUT, strokeWidth: 1.8, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

  return (
    <svg viewBox="0 0 80 80" width={size} height={size} className={className} role="img" aria-label={`${config.name} the study guide`}>
      <ellipse cx="40" cy="77.5" rx="17" ry="2.6" fill={OUT} opacity="0.16" />

      <g className={walking ? 'cb-bob' : pose === 'idle' || pose === 'talk' ? 'cb-breathe' : undefined}>
        {/* legs */}
        <g className={walking ? 'cb-leg-l' : undefined}>
          <rect x="29" y="66" width="9" height="10" rx="4.5" fill={body} {...stroke} />
        </g>
        <g className={walking ? 'cb-leg-r' : undefined}>
          <rect x="42" y="66" width="9" height="10" rx="4.5" fill={body} {...stroke} />
        </g>

        {/* tail (tiger / cat) */}
        {(species === 'tiger' || species === 'cat') && (
          <path d="M54 64 Q70 62 68 50" fill="none" stroke={OUT} strokeWidth="5.5" strokeLinecap="round" />
        )}
        {(species === 'tiger' || species === 'cat') && (
          <path d="M54 64 Q70 62 68 50" fill="none" stroke={body} strokeWidth="3" strokeLinecap="round" />
        )}

        {/* body */}
        <ellipse cx="40" cy="58" rx="15" ry="12.5" fill={body} {...stroke} />
        <ellipse cx="40" cy="61" rx="8.5" ry="7.5" fill="#FFF8F0" opacity="0.85" />
        {species === 'tiger' && (
          <path d="M26 54 h5 M25 59 h5 M54 54 h-5 M55 59 h-5" stroke="#C2761B" strokeWidth="2.2" strokeLinecap="round" />
        )}

        {/* scarf sits on the body, under the head */}
        {config.accessory === 'scarf' && (
          <g>
            <path d="M25 49 Q40 59 55 49 L57 55 Q40 67 23 55Z" fill={TERRA} {...stroke} />
            <path d="M28 52 Q40 61 52 52" fill="none" stroke="#FFF8F0" strokeWidth="1.2" strokeDasharray="2.5 2.5" />
            <path d="M50 58 l5 14 l-7 -3Z" fill={TERRA} {...stroke} />
          </g>
        )}

        {/* arms */}
        <ellipse cx="24" cy="58" rx="4.6" ry="7" transform="rotate(14 24 58)" fill={body} {...stroke} />
        {pose === 'wave' ? (
          <ellipse cx="59" cy="44" rx="4.6" ry="7" transform="rotate(-24 59 44)" fill={body} {...stroke} />
        ) : (
          <ellipse cx="56" cy="58" rx="4.6" ry="7" transform="rotate(-14 56 58)" fill={body} {...stroke} />
        )}

        {/* ears (behind the head) */}
        {species === 'tiger' && (
          <g>
            <circle cx="22" cy="15" r="7.5" fill={body} {...stroke} />
            <circle cx="58" cy="15" r="7.5" fill={body} {...stroke} />
            <circle cx="22" cy="15" r="3.6" fill={PINK} />
            <circle cx="58" cy="15" r="3.6" fill={PINK} />
          </g>
        )}
        {species === 'cat' && (
          <g>
            <path d="M19 26 L20 6 L35 15Z" fill={body} {...stroke} />
            <path d="M61 26 L60 6 L45 15Z" fill={body} {...stroke} />
            <path d="M23 20 L23.5 11 L30 15Z" fill={PINK} />
            <path d="M57 20 L56.5 11 L50 15Z" fill={PINK} />
          </g>
        )}
        {species === 'owl' && (
          <g>
            <path d="M20 22 L23 5 L35 14Z" fill="#B7791F" {...stroke} />
            <path d="M60 22 L57 5 L45 14Z" fill="#B7791F" {...stroke} />
          </g>
        )}
        {species === 'bunny' && (
          <g>
            <ellipse cx="29" cy="13.5" rx="5.5" ry="12" fill={body} {...stroke} />
            <ellipse cx="51" cy="13.5" rx="5.5" ry="12" fill={body} {...stroke} />
            <ellipse cx="29" cy="14.5" rx="2.6" ry="8" fill={PINK} />
            <ellipse cx="51" cy="14.5" rx="2.6" ry="8" fill={PINK} />
          </g>
        )}

        {/* head */}
        <circle cx="40" cy="32" r="22" fill={body} {...stroke} />
        {species === 'tiger' && (
          <g stroke="#C2761B" strokeWidth="2.4" strokeLinecap="round">
            <path d="M40 11 v7 M33 12.5 l1.4 6 M47 12.5 l-1.4 6" />
            <path d="M19 33 h6 M19.5 38 h5 M61 33 h-6 M60.5 38 h-5" />
          </g>
        )}

        {/* face */}
        {species === 'owl' ? (
          <g>
            <circle cx="31" cy="33" r="8.5" fill="#FFF8F0" {...stroke} />
            <circle cx="49" cy="33" r="8.5" fill="#FFF8F0" {...stroke} />
            {napping ? (
              <path d="M27 34 q4 3.5 8 0 M45 34 q4 3.5 8 0" fill="none" stroke={OUT} strokeWidth="2" strokeLinecap="round" />
            ) : (
              <g className="cb-blink">
                <circle cx="31" cy={eyeY - 0.5} r="3.6" fill={OUT} /><circle cx="49" cy={eyeY - 0.5} r="3.6" fill={OUT} />
                <circle cx="32.2" cy={eyeY - 1.8} r="1.2" fill="#fff" /><circle cx="50.2" cy={eyeY - 1.8} r="1.2" fill="#fff" />
              </g>
            )}
            <path d="M36.5 39 h7 l-3.5 6Z" fill={GOLD} {...stroke} />
          </g>
        ) : (
          <g>
            {napping ? (
              <path d="M28 35 q4 3.5 8 0 M44 35 q4 3.5 8 0" fill="none" stroke={OUT} strokeWidth="2" strokeLinecap="round" />
            ) : (
              <g className="cb-blink">
                <ellipse cx="32" cy={eyeY} rx="3" ry="3.7" fill={OUT} /><ellipse cx="48" cy={eyeY} rx="3" ry="3.7" fill={OUT} />
                <circle cx="33.1" cy={eyeY - 1.4} r="1.1" fill="#fff" /><circle cx="49.1" cy={eyeY - 1.4} r="1.1" fill="#fff" />
              </g>
            )}
            <ellipse cx="40" cy="42" rx="7.5" ry="5.2" fill="#FFF8F0" opacity={species === 'bunny' ? 0.7 : 0.95} />
            <path d="M37.6 39.4 h4.8 l-2.4 3Z" fill="#D4789C" />
            {pose === 'talk' ? (
              <ellipse cx="40" cy="45.4" rx="3" ry="2.7" fill="#7A2E22" className="cb-mouth" />
            ) : (
              <path d="M40 42.4 v1.4 M36.4 44.6 q3.6 2.8 7.2 0" fill="none" stroke={OUT} strokeWidth="1.5" strokeLinecap="round" />
            )}
            {species === 'bunny' && <rect x="38" y="45" width="4" height="3.4" rx="1" fill="#fff" stroke={OUT} strokeWidth="0.9" />}
          </g>
        )}
        <ellipse cx="25" cy="41" rx="4" ry="2.6" fill="#F2766A" opacity="0.38" />
        <ellipse cx="55" cy="41" rx="4" ry="2.6" fill="#F2766A" opacity="0.38" />

        {/* accessories on the head */}
        {config.accessory === 'cap' && (
          <g>
            <path d="M28 19 v7 q12 6 24 0 v-7" fill="#3A2A1C" {...stroke} />
            <path d="M16 15 L40 5 L64 15 L40 25Z" fill={OUT} stroke={OUT} strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M60 16 L63 29" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="63" cy="30" r="2.2" fill={GOLD} />
          </g>
        )}
        {config.accessory === 'glasses' && (
          <g fill="rgba(255,255,255,0.35)" stroke={OUT} strokeWidth="1.8">
            <circle cx="32" cy={eyeY} r="7" /><circle cx="48" cy={eyeY} r="7" />
            <path d="M39 33.5 h2" fill="none" strokeLinecap="round" />
          </g>
        )}
        {config.accessory === 'flower' && (
          <g transform="translate(57 14)">
            <path d="M0 -8 C4 -4 4 2 0 5 C-4 2 -4 -4 0 -8Z" fill="#fff" stroke="#D4789C" strokeWidth="1.2" />
            <path d="M0 5 C-7 4 -11 0 -11 -5 C-6 -4 -2 0 0 5Z" fill="#FFF4F8" stroke="#D4789C" strokeWidth="1.2" />
            <path d="M0 5 C7 4 11 0 11 -5 C6 -4 2 0 0 5Z" fill="#FFF4F8" stroke="#D4789C" strokeWidth="1.2" />
            <circle cy="2.4" r="2" fill={GOLD} />
          </g>
        )}
      </g>

      {/* ---- props for chores ---- */}
      {pose === 'read' && (
        <g>
          <path d="M21 56 L40 60 L40 75 L21 71Z" fill="#FFFDF8" {...stroke} />
          <path d="M59 56 L40 60 L40 75 L59 71Z" fill="#FFFDF8" {...stroke} />
          <path d="M25 62 l11 2.4 M25 66 l11 2.4 M55 62 l-11 2.4 M55 66 l-11 2.4" stroke="#C84B31" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          <path d="M40 60 V75" stroke={TERRA} strokeWidth="2" />
        </g>
      )}
      {pose === 'sweep' && (
        <g className="cb-sweep">
          <line x1="64" y1="34" x2="67" y2="68" stroke="#8C5A2B" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 66 L74 66 L77 77 L58 77Z" fill={GOLD} {...stroke} />
          <path d="M63 68 l-1 8 M67 68 v8 M71 68 l1 8" stroke={OUT} strokeWidth="1" opacity="0.5" />
        </g>
      )}
      {pose === 'water' && (
        <g>
          <path d="M60 50 h12 v11 q0 3 -3 3 h-6 q-3 0 -3 -3Z" fill="#4A90A4" {...stroke} />
          <path d="M60 54 L51 47" stroke={OUT} strokeWidth="4.4" strokeLinecap="round" />
          <path d="M60 54 L51 47" stroke="#4A90A4" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M72 52 q5 4 0 9" fill="none" stroke={OUT} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="49" cy="52" r="1.5" fill="#4A90A4" className="cb-drop" />
          <circle cx="47" cy="56" r="1.5" fill="#4A90A4" className="cb-drop cb-drop-2" />
          <circle cx="50" cy="55" r="1.5" fill="#4A90A4" className="cb-drop cb-drop-3" />
          <path d="M12 72 h12 l-2 6 h-8Z" fill={TERRA} {...stroke} />
          <path d="M18 72 q-6 -4 -5 -10 q6 1 5 10 M18 72 q6 -4 5 -10 q-6 1 -5 10" fill="#4E7D5B" stroke={OUT} strokeWidth="1.3" strokeLinejoin="round" />
        </g>
      )}
      {napping && (
        <g fontFamily="'Press Start 2P', monospace" fill={OUT}>
          <text x="58" y="20" fontSize="9" className="cb-z">z</text>
          <text x="65" y="11" fontSize="7" className="cb-z cb-z-2">z</text>
        </g>
      )}
    </svg>
  );
};
