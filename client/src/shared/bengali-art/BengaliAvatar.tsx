import React, { useId } from 'react';
import { KANTHA_COLORS as C } from './kanthaPatterns';
import { AvatarConfig, sanitizeAvatar } from './avatarConfig';

/** Darken (amt < 0) or lighten (amt > 0) a #rrggbb colour. */
function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

const INK = '#2B1A12';

function Backdrop({ kind }: { kind: AvatarConfig['backdrop'] }) {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  switch (kind) {
    case 'kantha':
      return (
        <g>
          <rect width="200" height="220" rx="22" fill="#FFF3DF" />
          <rect x="9" y="9" width="182" height="202" rx="15" fill="none" stroke={C.terra} strokeWidth="2" strokeDasharray="7 5" strokeLinecap="round" />
          <rect x="16" y="16" width="168" height="188" rx="11" fill="none" stroke={C.gold} strokeWidth="1.6" strokeDasharray="3 6" strokeLinecap="round" />
          {[[22, 22], [178, 22], [22, 198], [178, 198]].map(([x, y]) => (
            <path key={`${x}${y}`} d={`M${x} ${y - 6} L${x + 6} ${y} L${x} ${y + 6} L${x - 6} ${y}Z`} fill={C.lotus} />
          ))}
        </g>
      );
    case 'river':
      return (
        <g>
          <rect width="200" height="220" rx="22" fill="#D9EEF1" />
          <circle cx="160" cy="44" r="16" fill={C.gold} />
          <path d="M0 150 H200 V198 Q200 220 178 220 H22 Q0 220 0 198Z" fill={C.river} />
          {[166, 184, 202].map((y) => (
            <path key={y} d={`M10 ${y} q 12 -7 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0`} fill="none" stroke={C.cream} strokeWidth="1.8" strokeDasharray="6 5" strokeLinecap="round" opacity="0.85" />
          ))}
        </g>
      );
    case 'shapla':
      return (
        <g>
          <rect width="200" height="220" rx="22" fill="#E4F1E6" />
          <path d="M0 160 H200 V198 Q200 220 178 220 H22 Q0 220 0 198Z" fill="#6FB0B8" />
          {[[34, 190], [160, 196], [96, 208]].map(([x, y]) => (
            <ellipse key={x} cx={x} cy={y} rx="22" ry="6" fill={C.leaf} />
          ))}
          {[[34, 184], [160, 190]].map(([x, y]) => (
            <g key={x} transform={`translate(${x} ${y})`}>
              <path d="M0 -10 C5 -5 5 2 0 6 C-5 2 -5 -5 0 -10Z" fill="#fff" stroke={C.lotus} strokeWidth="1.2" />
              <path d="M0 6 C-9 5 -15 0 -15 -6 C-8 -5 -3 -1 0 6Z" fill="#FFF4F8" stroke={C.lotus} strokeWidth="1.2" />
              <path d="M0 6 C9 5 15 0 15 -6 C8 -5 3 -1 0 6Z" fill="#FFF4F8" stroke={C.lotus} strokeWidth="1.2" />
              <circle cy="3" r="2.4" fill={C.gold} />
            </g>
          ))}
        </g>
      );
    default: // alpona
      return (
        <g>
          <rect width="200" height="220" rx="22" fill="#FFF3DF" />
          <g transform="translate(100 108)" fill="none" stroke={C.terra} strokeWidth="1.4" opacity="0.4">
            {petals.map((a) => (
              <path key={a} d="M0 -26 C13 -42 13 -70 0 -92 C-13 -70 -13 -42 0 -26Z" transform={`rotate(${a})`} />
            ))}
            <circle r="96" strokeDasharray="2 6" strokeLinecap="round" />
          </g>
        </g>
      );
  }
}

function HairBack({ cfg }: { cfg: AvatarConfig }) {
  const h = cfg.hairColor;
  const dark = shade(h, -0.25);
  switch (cfg.hair) {
    case 'long':
      return <path d="M62 78 C54 126 52 164 62 186 C80 178 90 172 100 172 C110 172 120 178 138 186 C148 164 146 126 138 78Z" fill={h} />;
    case 'braids': {
      const braid = (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <ellipse key={i} cx={66 - i * 1.5} cy={118 + i * 15} rx="9" ry="9.5" fill={i % 2 ? dark : h} />
          ))}
          <path d="M58 168 q8 14 8 0z" fill={C.cream} opacity="0" />
          <rect x="55" y="172" width="20" height="6" rx="3" fill={cfg.trim} />
          <path d="M58 178 q6 14 12 0z" fill={h} />
        </g>
      );
      return (
        <g>
          {braid}
          <g transform="translate(200 0) scale(-1 1)">{braid}</g>
        </g>
      );
    }
    case 'bun':
      return (
        <g>
          <circle cx="100" cy="36" r="19" fill={h} />
          <path d="M86 36 q14 -10 28 0 M88 44 q12 -8 24 0" fill="none" stroke={dark} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 'curly':
      return (
        <g fill={h}>
          {[[70, 64, 15], [82, 48, 16], [100, 42, 16], [118, 48, 16], [130, 64, 15], [62, 86, 13], [138, 86, 13], [60, 104, 11], [140, 104, 11]].map(([x, y, r]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
          ))}
        </g>
      );
    default:
      return null;
  }
}

function HairFront({ cfg }: { cfg: AvatarConfig }) {
  const h = cfg.hairColor;
  const dark = shade(h, -0.25);
  const cap = (
    <path d="M65 90 C61 54 80 38 100 38 C120 38 139 54 135 90 C128 72 116 63 100 63 C84 63 72 72 65 90Z" fill={h} />
  );
  switch (cfg.hair) {
    case 'short':
      return (
        <g>
          <path d="M64 92 C58 50 80 34 100 34 C120 34 142 50 136 92 C130 76 122 66 108 62 C96 66 76 66 64 92Z" fill={h} />
          <path d="M84 52 q16 -8 32 0" fill="none" stroke={dark} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 'curly':
      return (
        <g fill={h}>
          {[[78, 62, 11], [92, 54, 11], [108, 54, 11], [122, 62, 11], [70, 74, 8], [130, 74, 8]].map(([x, y, r]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
          ))}
        </g>
      );
    default:
      return (
        <g>
          {cap}
          <path d="M100 40 V62" stroke={dark} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
  }
}

function Outfit({ cfg, uid }: { cfg: AvatarConfig; uid: string }) {
  const torso = 'M32 222 C32 172 60 144 100 142 C140 144 168 172 168 222Z';
  const clip = `torso-${uid}`;
  const common = (
    <defs>
      <clipPath id={clip}><path d={torso} /></clipPath>
    </defs>
  );
  switch (cfg.outfit) {
    case 'panjabi':
      return (
        <g>
          {common}
          <path d={torso} fill={cfg.primary} />
          <path d="M32 222 C32 172 60 144 100 142 C140 144 168 172 168 222" fill="none" stroke={shade(cfg.primary, -0.12)} strokeWidth="2" />
          <path d="M100 160 V222" stroke={cfg.trim} strokeWidth="3" strokeDasharray="5 4" strokeLinecap="round" />
          {[176, 192, 208].map((y) => (
            <circle key={y} cx="100" cy={y} r="2.8" fill={cfg.trim} />
          ))}
          <path d="M82 144 Q100 158 118 144 L118 152 Q100 166 82 152Z" fill={cfg.trim} />
          <g clipPath={`url(#${clip})`}>
            <path d="M32 214 H168" stroke={cfg.trim} strokeWidth="2.6" strokeDasharray="6 4" />
          </g>
        </g>
      );
    case 'uniform':
      return (
        <g>
          {common}
          <path d={torso} fill="#FFFDF8" />
          <path d="M32 222 C32 172 60 144 100 142 C140 144 168 172 168 222" fill="none" stroke="#E2D7C3" strokeWidth="2" />
          <path d="M100 160 L88 144 L74 150 L94 176Z" fill="#fff" stroke={cfg.trim} strokeWidth="2" strokeLinejoin="round" />
          <path d="M100 160 L112 144 L126 150 L106 176Z" fill="#fff" stroke={cfg.trim} strokeWidth="2" strokeLinejoin="round" />
          <path d="M100 164 L93 172 L97 214 L100 218 L103 214 L107 172Z" fill={cfg.primary === '#FFFDF8' ? cfg.trim : cfg.primary} />
          <rect x="128" y="182" width="18" height="16" rx="2" fill="none" stroke="#E2D7C3" strokeWidth="1.8" />
        </g>
      );
    case 'baul': {
      const patches: [number, number, number, number, string][] = [
        [50, 178, 28, 24, C.terra], [84, 192, 30, 26, C.river], [122, 174, 28, 26, C.leaf],
        [60, 206, 24, 18, C.lotus], [138, 202, 24, 22, '#8C5A2B'],
      ];
      return (
        <g>
          {common}
          <path d={torso} fill={cfg.primary} />
          <g clipPath={`url(#${clip})`}>
            {patches.map(([x, y, w, h, c]) => (
              <g key={`${x}${y}`}>
                <rect x={x} y={y} width={w} height={h} fill={c} />
                <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} fill="none" stroke={C.cream} strokeWidth="1.4" strokeDasharray="3 2.5" />
              </g>
            ))}
            <rect x="30" y="188" width="140" height="7" fill={cfg.trim} />
            <path d="M30 191.5 H170" stroke={C.cream} strokeWidth="1.4" strokeDasharray="4 3" />
          </g>
          <ellipse cx="100" cy="146" rx="17" ry="9" fill={cfg.skin} />
        </g>
      );
    }
    default: // saree
      return (
        <g>
          {common}
          <path d={torso} fill={cfg.primary} />
          <g clipPath={`url(#${clip})`}>
            {/* blouse */}
            <rect x="0" y="0" width="200" height="178" fill={cfg.trim} />
            {/* pallu draping over the shoulder, with the painted border */}
            <path d="M46 160 L80 143 L184 226 L146 236Z" fill={cfg.primary} />
            <path d="M46 160 L146 236" stroke={cfg.trim} strokeWidth="5" />
            <path d="M80 143 L184 226" stroke={cfg.trim} strokeWidth="5" />
            <path d="M62 152 L166 231" stroke={C.gold} strokeWidth="1.8" strokeDasharray="3 4" strokeLinecap="round" />
            {/* the part of the saree below the waist */}
            <rect x="0" y="178" width="200" height="60" fill={cfg.primary} />
            <rect x="0" y="178" width="200" height="6" fill={cfg.trim} />
            <path d="M0 181 H200" stroke={C.gold} strokeWidth="1.5" strokeDasharray="3 4" />
            <path d="M120 232 L184 226 L146 236Z" fill={cfg.primary} />
          </g>
          <path d="M82 144 L100 168 L118 144Z" fill={cfg.skin} />
        </g>
      );
  }
}

function Accessories({ cfg, uid }: { cfg: AvatarConfig; uid: string }) {
  const has = (a: AvatarConfig['accessories'][number]) => cfg.accessories.includes(a);
  const gam = `gam-${uid}`;
  return (
    <g>
      {has('gamcha') && (
        <g>
          <defs>
            <pattern id={gam} width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#F8F4EC" />
              <path d="M0 5H10M5 0V10" stroke={C.terra} strokeWidth="3.2" />
            </pattern>
          </defs>
          <path d="M56 148 C74 170 126 170 144 148 L152 168 C128 190 72 190 48 168Z" fill={`url(#${gam})`} stroke={shade(C.terra, -0.2)} strokeWidth="1.2" />
        </g>
      )}
      {has('ektara') && (
        <g>
          <line x1="176" y1="176" x2="184" y2="104" stroke="#6B3B1E" strokeWidth="5" strokeLinecap="round" />
          <rect x="179" y="98" width="12" height="9" rx="2" fill="#8C5A2B" transform="rotate(5 185 102)" />
          <ellipse cx="172" cy="196" rx="15" ry="19" fill="#C8854A" stroke="#8C5A2B" strokeWidth="2" />
          <ellipse cx="172" cy="190" rx="9" ry="11" fill="#E8B27A" opacity="0.7" />
          <line x1="184" y1="106" x2="172" y2="212" stroke="#F4EEE2" strokeWidth="1.3" />
          <circle cx="164" cy="190" r="6" fill={cfg.skin} />
        </g>
      )}
      {has('jhumka') && (
        <g fill={C.gold} stroke={shade(C.gold, -0.35)} strokeWidth="0.8">
          {[66, 134].map((x) => (
            <g key={x}>
              <circle cx={x} cy="104" r="2.6" />
              <path d={`M${x - 4} 108 h8 l-4 10Z`} />
              <circle cx={x} cy="120" r="1.6" />
            </g>
          ))}
        </g>
      )}
      {has('bindi') && <circle cx="100" cy="79" r="3.3" fill="#D62D20" />}
      {has('tupi') && (
        <g>
          <path d="M66 72 C64 40 136 40 134 72 C122 63 78 63 66 72Z" fill="#FFFDF8" stroke="#D9C9A8" strokeWidth="1.6" />
          {[78, 89, 100, 111, 122].map((x) => (
            <path key={x} d={`M${x} 64 l3 -3 l3 3 l-3 3Z`} fill={C.terra} />
          ))}
        </g>
      )}
      {has('shapla') && (
        <g transform="translate(130 56)">
          <path d="M0 -11 C6 -5 6 3 0 8 C-6 3 -6 -5 0 -11Z" fill="#fff" stroke={C.lotus} strokeWidth="1.3" />
          <path d="M0 8 C-10 7 -16 1 -16 -6 C-8 -5 -3 0 0 8Z" fill="#FFF4F8" stroke={C.lotus} strokeWidth="1.3" />
          <path d="M0 8 C10 7 16 1 16 -6 C8 -5 3 0 0 8Z" fill="#FFF4F8" stroke={C.lotus} strokeWidth="1.3" />
          <circle cy="4" r="2.6" fill={C.gold} />
        </g>
      )}
      {has('glasses') && (
        <g fill="rgba(255,255,255,0.22)" stroke={INK} strokeWidth="2.2">
          <circle cx="86" cy="94" r="11.5" />
          <circle cx="114" cy="94" r="11.5" />
          <path d="M97.5 93 H102.5 M74.5 93 L67 90 M125.5 93 L133 90" fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

function Mouth({ face }: { face: AvatarConfig['face'] }) {
  const lip = '#7A2E22';
  if (face === 'grin')
    return (
      <g>
        <path d="M89 106 Q100 123 111 106Z" fill="#8C2F1B" />
        <path d="M91 106.5 Q100 111 109 106.5 L108.5 108.6 Q100 113 91.5 108.6Z" fill="#fff" />
      </g>
    );
  if (face === 'calm') return <path d="M93 110 Q100 113.5 107 110" fill="none" stroke={lip} strokeWidth="2.3" strokeLinecap="round" />;
  return <path d="M91 108 Q100 117 109 108" fill="none" stroke={lip} strokeWidth="2.5" strokeLinecap="round" />;
}

interface Props {
  config: AvatarConfig;
  size?: number;
  /** show only the head and shoulders, cropped to a circle (for the nav bar) */
  round?: boolean;
  className?: string;
  title?: string;
}

export const BengaliAvatar: React.FC<Props> = ({ config, size = 200, round = false, className, title = 'Your character' }) => {
  const cfg = sanitizeAvatar(config);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const skinDark = shade(cfg.skin, -0.12);
  const viewBox = round ? '28 30 144 144' : '0 0 200 220';
  const height = round ? size : (size * 220) / 200;
  const clip = `round-${uid}`;

  return (
    <svg viewBox={viewBox} width={size} height={height} className={className} role="img" aria-label={title}>
      <defs>
        {round ? (
          <clipPath id={clip}><circle cx="100" cy="102" r="72" /></clipPath>
        ) : (
          <clipPath id={clip}><rect width="200" height="220" rx="22" /></clipPath>
        )}
      </defs>
      <g clipPath={`url(#${clip})`}>
        {round ? <rect x="20" y="20" width="160" height="170" fill="#FFF3DF" /> : <Backdrop kind={cfg.backdrop} />}
        <HairBack cfg={cfg} />
        <Outfit cfg={cfg} uid={uid} />
        {/* neck */}
        <rect x="89" y="118" width="22" height="30" rx="8" fill={skinDark} />
        {/* ears + head */}
        <circle cx="66" cy="94" r="6.5" fill={skinDark} />
        <circle cx="134" cy="94" r="6.5" fill={skinDark} />
        <ellipse cx="100" cy="90" rx="34" ry="38" fill={cfg.skin} />
        <HairFront cfg={cfg} />
        {/* face */}
        <path d="M79 85 Q86 80.5 93 84 M107 84 Q114 80.5 121 85" fill="none" stroke={cfg.hairColor} strokeWidth="2.3" strokeLinecap="round" />
        <ellipse cx="86" cy="94" rx="4.2" ry="5.2" fill={INK} />
        <ellipse cx="114" cy="94" rx="4.2" ry="5.2" fill={INK} />
        <circle cx="87.6" cy="92" r="1.5" fill="#fff" />
        <circle cx="115.6" cy="92" r="1.5" fill="#fff" />
        <ellipse cx="77" cy="105" rx="7" ry="4" fill="#F2766A" opacity="0.32" />
        <ellipse cx="123" cy="105" rx="7" ry="4" fill="#F2766A" opacity="0.32" />
        <path d="M99 100 Q96.5 106 101.5 107" fill="none" stroke={skinDark} strokeWidth="1.8" strokeLinecap="round" />
        <Mouth face={cfg.face} />
        <Accessories cfg={cfg} uid={uid} />
      </g>
    </svg>
  );
};
