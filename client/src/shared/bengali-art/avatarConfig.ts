import { useMemo } from 'react';
import { useLocalStore } from '../hooks/useLocalStore';

/**
 * The profile character: a customizable Bengali student.
 * Only values from these lists are ever drawn (see sanitizeAvatar), so the
 * SVG can never contain anything unexpected, even if localStorage is edited.
 */
export const SKIN_TONES = ['#FBE0C8', '#F3C9A0', '#D9A06B', '#B97A4B', '#8A5530', '#5E3A22'];
export const HAIR_COLORS = ['#1B1310', '#3B2416', '#6B3B1E', '#8C2F1B', '#8A8A8A'];
export const COLOR_CHOICES = ['#FFFDF8', '#C84B31', '#E8A317', '#4A90A4', '#4E7D5B', '#D4789C', '#26325B', '#2D1B0E'];

export type HairStyle = 'bun' | 'braids' | 'short' | 'curly' | 'long';
export type Outfit = 'saree' | 'panjabi' | 'uniform' | 'baul';
export type Backdrop = 'alpona' | 'kantha' | 'river' | 'shapla';
export type Face = 'smile' | 'grin' | 'calm';
export type Accessory = 'bindi' | 'jhumka' | 'shapla' | 'gamcha' | 'tupi' | 'glasses' | 'ektara';

export interface AvatarConfig {
  nickname: string;
  skin: string;
  hairColor: string;
  hair: HairStyle;
  outfit: Outfit;
  /** main colour of the outfit */
  primary: string;
  /** border / trim colour (the "paar" of a saree) */
  trim: string;
  accessories: Accessory[];
  backdrop: Backdrop;
  face: Face;
}

interface Opt<T extends string> { id: T; label: string; bn: string }

export const HAIR_OPTIONS: Opt<HairStyle>[] = [
  { id: 'braids', label: 'Twin braids', bn: 'বেণী' },
  { id: 'bun', label: 'Bun', bn: 'খোঁপা' },
  { id: 'long', label: 'Open hair', bn: 'খোলা চুল' },
  { id: 'short', label: 'Short', bn: 'ছোট চুল' },
  { id: 'curly', label: 'Curly', bn: 'কোঁকড়া' },
];
export const OUTFIT_OPTIONS: Opt<Outfit>[] = [
  { id: 'saree', label: 'Saree', bn: 'শাড়ি' },
  { id: 'panjabi', label: 'Panjabi', bn: 'পাঞ্জাবি' },
  { id: 'uniform', label: 'School dress', bn: 'স্কুল ড্রেস' },
  { id: 'baul', label: 'Baul robe', bn: 'বাউল' },
];
export const BACKDROP_OPTIONS: Opt<Backdrop>[] = [
  { id: 'alpona', label: 'Alpona', bn: 'আলপনা' },
  { id: 'kantha', label: 'Kantha', bn: 'কাঁথা' },
  { id: 'river', label: 'River', bn: 'নদী' },
  { id: 'shapla', label: 'Shapla pond', bn: 'শাপলা বিল' },
];
export const FACE_OPTIONS: Opt<Face>[] = [
  { id: 'smile', label: 'Smile', bn: 'হাসি' },
  { id: 'grin', label: 'Big grin', bn: 'হা হা' },
  { id: 'calm', label: 'Calm', bn: 'শান্ত' },
];
export const ACCESSORY_OPTIONS: Opt<Accessory>[] = [
  { id: 'bindi', label: 'Tip', bn: 'টিপ' },
  { id: 'jhumka', label: 'Jhumka', bn: 'ঝুমকা' },
  { id: 'shapla', label: 'Shapla', bn: 'শাপলা' },
  { id: 'gamcha', label: 'Gamcha', bn: 'গামছা' },
  { id: 'tupi', label: 'Tupi', bn: 'টুপি' },
  { id: 'glasses', label: 'Glasses', bn: 'চশমা' },
  { id: 'ektara', label: 'Ektara', bn: 'একতারা' },
];

export const DEFAULT_AVATAR: AvatarConfig = {
  nickname: '',
  skin: SKIN_TONES[1],
  hairColor: HAIR_COLORS[0],
  hair: 'braids',
  outfit: 'saree',
  primary: '#FFFDF8',
  trim: '#C84B31',
  accessories: ['bindi', 'jhumka'],
  backdrop: 'alpona',
  face: 'smile',
};

const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback;
const pickColor = (value: unknown, allowed: readonly string[], fallback: string) =>
  typeof value === 'string' && allowed.includes(value) ? value : fallback;

/** Turn anything (including a tampered localStorage value) into a safe config. */
export function sanitizeAvatar(raw: unknown): AvatarConfig {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const d = DEFAULT_AVATAR;
  const accessories = Array.isArray(r.accessories)
    ? (r.accessories.filter((a) => ACCESSORY_OPTIONS.some((o) => o.id === a)) as Accessory[])
    : d.accessories;
  return {
    nickname: typeof r.nickname === 'string' ? r.nickname.slice(0, 20) : '',
    skin: pickColor(r.skin, SKIN_TONES, d.skin),
    hairColor: pickColor(r.hairColor, HAIR_COLORS, d.hairColor),
    hair: pick(r.hair, HAIR_OPTIONS.map((o) => o.id), d.hair),
    outfit: pick(r.outfit, OUTFIT_OPTIONS.map((o) => o.id), d.outfit),
    primary: pickColor(r.primary, COLOR_CHOICES, d.primary),
    trim: pickColor(r.trim, COLOR_CHOICES, d.trim),
    accessories: [...new Set(accessories)],
    backdrop: pick(r.backdrop, BACKDROP_OPTIONS.map((o) => o.id), d.backdrop),
    face: pick(r.face, FACE_OPTIONS.map((o) => o.id), d.face),
  };
}

/** The signed-in user's character, saved in this browser. */
export function useAvatar(userId?: string): [AvatarConfig, (next: AvatarConfig | ((p: AvatarConfig) => AvatarConfig)) => void] {
  const [raw, setRaw] = useLocalStore<AvatarConfig>(`shikkha_avatar_${userId ?? 'guest'}`, DEFAULT_AVATAR);
  const config = useMemo(() => sanitizeAvatar(raw), [raw]);
  return [config, setRaw];
}
