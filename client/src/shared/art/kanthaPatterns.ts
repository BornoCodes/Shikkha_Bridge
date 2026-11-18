/**
 * Nakshi kantha border tiles, drawn as tiny SVGs and used as repeating
 * backgrounds. Colours come from the app palette.
 *
 * stitch  = two rows of running stitch (the heart of kantha)
 * zigzag  = cross-stitch zigzag
 * vine    = flowing kolka vine with leaves
 * lotus   = a row of padma (lotus) flowers
 * diamond = the diamond motif often seen on borders
 */
export const KANTHA_COLORS = {
  terra: '#C84B31',
  gold: '#E8A317',
  lotus: '#D4789C',
  lotusLight: '#E8A0BE',
  river: '#4A90A4',
  leaf: '#4E7D5B',
  ink: '#2D1B0E',
  cream: '#FFF8F0',
};

const C = KANTHA_COLORS;

const tile = (w: number, h: number, body: string) => ({
  w,
  h,
  image: `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`,
  )}")`,
});

export type KanthaVariant = 'stitch' | 'zigzag' | 'vine' | 'lotus' | 'diamond';

export const kanthaTiles: Record<KanthaVariant, { w: number; h: number; image: string }> = {
  stitch: tile(
    24,
    12,
    `<g stroke-linecap="round" stroke-width="2">
       <path d="M0 3h9M13 3h9" stroke="${C.terra}"/>
       <path d="M-6 9h9M7 9h9M19 9h9" stroke="${C.gold}"/>
     </g>`,
  ),
  zigzag: tile(
    16,
    12,
    `<path d="M0 8 L4 3 L8 8 L12 3 L16 8" fill="none" stroke="${C.gold}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
     <circle cx="4" cy="10.4" r="1" fill="${C.lotus}"/><circle cx="12" cy="10.4" r="1" fill="${C.lotus}"/>`,
  ),
  vine: tile(
    48,
    20,
    `<path d="M0 10 Q12 2 24 10 T48 10" fill="none" stroke="${C.terra}" stroke-width="1.8" stroke-linecap="round"/>
     <ellipse cx="12" cy="3.6" rx="2.3" ry="3.5" fill="${C.lotus}" transform="rotate(-18 12 3.6)"/>
     <ellipse cx="36" cy="16.4" rx="2.3" ry="3.5" fill="${C.leaf}" transform="rotate(162 36 16.4)"/>
     <circle cx="24" cy="10" r="2" fill="${C.gold}"/><circle cx="0" cy="10" r="2" fill="${C.gold}"/><circle cx="48" cy="10" r="2" fill="${C.gold}"/>`,
  ),
  lotus: tile(
    44,
    24,
    `<path d="M22 3 C26.5 8 26.5 14 22 19 C17.5 14 17.5 8 22 3Z" fill="${C.lotus}"/>
     <path d="M22 19 C14 18.5 9 14 8 8.5 C14 9.2 19 13 22 19Z" fill="${C.lotusLight}"/>
     <path d="M22 19 C30 18.5 35 14 36 8.5 C30 9.2 25 13 22 19Z" fill="${C.lotusLight}"/>
     <path d="M11 20.5 Q22 24 33 20.5" fill="none" stroke="${C.leaf}" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="2.5" cy="12" r="1.6" fill="${C.gold}"/><circle cx="41.5" cy="12" r="1.6" fill="${C.gold}"/>`,
  ),
  diamond: tile(
    20,
    12,
    `<path d="M10 1 L17 6 L10 11 L3 6Z" fill="none" stroke="${C.terra}" stroke-width="1.5" stroke-linejoin="round"/>
     <circle cx="10" cy="6" r="1.4" fill="${C.gold}"/>`,
  ),
};
