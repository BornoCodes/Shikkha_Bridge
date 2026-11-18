import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/ui/PageHeader';
import { Button } from '../../../shared/components/ui/Button';
import { BengaliAvatar } from '../../../shared/avatar/BengaliAvatar';
import {
  ACCESSORY_OPTIONS,
  BACKDROP_OPTIONS,
  COLOR_CHOICES,
  DEFAULT_AVATAR,
  DEFAULT_MALE_AVATAR,
  DEFAULT_FEMALE_AVATAR,
  FACE_OPTIONS,
  HAIR_COLORS,
  HAIR_OPTIONS,
  OUTFIT_OPTIONS,
  SKIN_TONES,
  useAvatar,
  type Accessory,
  type AvatarConfig,
} from '../../../shared/avatar/avatarConfig';
import { ChibiSprite, DEFAULT_MASCOT, useGuide } from '../../../shared/guide';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useTier } from '../../../shared/hooks/useTier';

const MASCOT_SPECIES = [
  { id: 'tiger', label: 'Tiger' },
  { id: 'cat', label: 'Cat' },
  { id: 'owl', label: 'Owl' },
  { id: 'bunny', label: 'Bunny' },
] as const;
const MASCOT_ACCESSORIES = [
  { id: 'cap', label: 'Cap' },
  { id: 'glasses', label: 'Glasses' },
  { id: 'flower', label: 'Flower' },
  { id: 'scarf', label: 'Scarf' },
  { id: 'none', label: 'None' },
] as const;
const MASCOT_COLORS = ['#FDE68A', '#FFF2E2', '#FBCFE8', '#BAE6FD', '#BBF7D0', '#DDD6FE'];

const Section: React.FC<{ title: string; bn?: string; children: React.ReactNode }> = ({ title, bn, children }) => (
  <section className="mt-6 first:mt-0">
    <h3 className="font-heading text-[18px] text-[#2D1B0E] mb-2">
      {title} {bn && <span className="text-[#C84B31] text-[14px] ml-1">{bn}</span>}
    </h3>
    {children}
  </section>
);

const Chip: React.FC<{ on: boolean; onClick: () => void; children: React.ReactNode }> = ({ on, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={on}
    className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
      on ? 'bg-[#C84B31] border-[#C84B31] text-white' : 'bg-white/70 border-[#EAD5BC] text-[#6B5344] hover:border-[#C84B31]'
    }`}
  >
    {children}
  </button>
);

const Swatches: React.FC<{ colors: string[]; value: string; onPick: (c: string) => void; label: string }> = ({ colors, value, onPick, label }) => (
  <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
    {colors.map((c) => (
      <button
        key={c}
        type="button"
        onClick={() => onPick(c)}
        aria-label={`${label} ${c}`}
        aria-pressed={value.toLowerCase() === c.toLowerCase()}
        style={{ backgroundColor: c }}
        className={`w-8 h-8 rounded-full border-2 ${value.toLowerCase() === c.toLowerCase() ? 'border-[#2D1B0E] scale-110' : 'border-[#EAD5BC]'} transition-transform`}
      />
    ))}
  </div>
);

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useAvatar(user?.id);
  const [tier, setTier] = useTier(user?.tier);
  const { mascot, setMascot, sound, setSound } = useGuide();

  const patch = (p: Partial<AvatarConfig>) => setAvatar({ ...avatar, ...p });
  const toggleAcc = (a: Accessory) =>
    patch({ accessories: avatar.accessories.includes(a) ? avatar.accessories.filter((x) => x !== a) : [...avatar.accessories, a] });
  const patchMascot = (p: Partial<typeof mascot>) => setMascot({ ...mascot, ...p });

  const setMalePreset = () => {
    localStorage.setItem('shikkha_gender_pref', 'male');
    setAvatar((prev) => ({
      ...DEFAULT_MALE_AVATAR,
      nickname: prev.nickname,
      skin: prev.skin,
    }));
  };

  const setFemalePreset = () => {
    localStorage.setItem('shikkha_gender_pref', 'female');
    setAvatar((prev) => ({
      ...DEFAULT_FEMALE_AVATAR,
      nickname: prev.nickname,
      skin: prev.skin,
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <PageHeader bn="আমার প্রোফাইল" title="My profile" sub="Dress up your character. Everything saves by itself." />

      <div className="grid md:grid-cols-[260px_1fr] gap-8 items-start">
        {/* live preview */}
        <div className="md:sticky md:top-28">
          <div className="paper rounded-2xl p-5 text-center">
            <BengaliAvatar config={avatar} size={200} className="mx-auto" title="Your character" />
            
            {/* Quick character style / gender selector */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={setFemalePreset}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  avatar.hair === 'braids' || avatar.outfit === 'saree'
                    ? 'bg-[#C84B31] text-white border-[#C84B31] shadow-sm'
                    : 'bg-white/80 text-[#6B5344] border-[#EAD5BC] hover:border-[#C84B31]'
                }`}
              >
                <span>👩</span> Female / কন্যা
              </button>
              <button
                type="button"
                onClick={setMalePreset}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  avatar.hair === 'short' && (avatar.outfit === 'panjabi' || avatar.outfit === 'baul' || avatar.outfit === 'uniform')
                    ? 'bg-[#C84B31] text-white border-[#C84B31] shadow-sm'
                    : 'bg-white/80 text-[#6B5344] border-[#EAD5BC] hover:border-[#C84B31]'
                }`}
              >
                <span>👨</span> Male / ছেলে
              </button>
            </div>

            <label className="block mt-4 text-left text-xs font-semibold text-[#2D1B0E]" htmlFor="nick">Nickname</label>
            <input
              id="nick"
              value={avatar.nickname}
              maxLength={16}
              onChange={(e) => patch({ nickname: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-[#EAD5BC] bg-white/80 text-[#2D1B0E] focus:outline-none focus:ring-2 focus:ring-[#C84B31]/30"
            />
            <button type="button" onClick={() => setAvatar({ ...DEFAULT_AVATAR })} className="mt-3 text-xs text-[#6B5344] hover:text-[#C84B31] underline">
              Reset character
            </button>
          </div>
        </div>

        {/* options */}
        <div className="paper rounded-2xl p-6">
          <Section title="Hair" bn="চুল">
            <div className="flex flex-wrap gap-2">
              {HAIR_OPTIONS.map((o) => <Chip key={o.id} on={avatar.hair === o.id} onClick={() => patch({ hair: o.id })}>{o.label} · {o.bn}</Chip>)}
            </div>
            <div className="mt-3"><Swatches colors={HAIR_COLORS} value={avatar.hairColor} onPick={(c) => patch({ hairColor: c })} label="Hair colour" /></div>
          </Section>

          <Section title="Skin" bn="ত্বক">
            <Swatches colors={SKIN_TONES} value={avatar.skin} onPick={(c) => patch({ skin: c })} label="Skin tone" />
          </Section>

          <Section title="Face" bn="মুখ">
            <div className="flex flex-wrap gap-2">
              {FACE_OPTIONS.map((o) => <Chip key={o.id} on={avatar.face === o.id} onClick={() => patch({ face: o.id })}>{o.label}</Chip>)}
            </div>
          </Section>

          <Section title="Clothes" bn="পোশাক">
            <div className="flex flex-wrap gap-2">
              {OUTFIT_OPTIONS.map((o) => <Chip key={o.id} on={avatar.outfit === o.id} onClick={() => patch({ outfit: o.id })}>{o.label} · {o.bn}</Chip>)}
            </div>
            <p className="text-xs text-[#6B5344] mt-3 mb-1.5">Main colour</p>
            <Swatches colors={COLOR_CHOICES} value={avatar.primary} onPick={(c) => patch({ primary: c })} label="Outfit colour" />
            <p className="text-xs text-[#6B5344] mt-3 mb-1.5">Border colour</p>
            <Swatches colors={COLOR_CHOICES} value={avatar.trim} onPick={(c) => patch({ trim: c })} label="Border colour" />
          </Section>

          <Section title="Extras" bn="সাজ">
            <div className="flex flex-wrap gap-2">
              {ACCESSORY_OPTIONS.map((o) => <Chip key={o.id} on={avatar.accessories.includes(o.id)} onClick={() => toggleAcc(o.id)}>{o.label} · {o.bn}</Chip>)}
            </div>
          </Section>

          <Section title="Background" bn="পটভূমি">
            <div className="flex flex-wrap gap-2">
              {BACKDROP_OPTIONS.map((o) => <Chip key={o.id} on={avatar.backdrop === o.id} onClick={() => patch({ backdrop: o.id })}>{o.label} · {o.bn}</Chip>)}
            </div>
          </Section>
        </div>
      </div>

      {/* guide looks */}
      <div className="paper rounded-2xl p-6 mt-8">
        <div className="flex items-center gap-5 flex-wrap">
          <ChibiSprite config={mascot} pose="wave" size={96} />
          <div className="flex-1 min-w-[220px]">
            <h2 className="font-heading text-[22px] text-[#2D1B0E]">Your study guide</h2>
            <p className="text-sm text-[#6B5344]">It walks along the bottom of the screen. Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#EAD5BC] text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#EAD5BC] text-xs">M</kbd> to talk to it.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mt-5">
          <div>
            <label htmlFor="gname" className="block text-xs font-semibold text-[#2D1B0E]">Name</label>
            <input
              id="gname"
              value={mascot.name}
              maxLength={12}
              onChange={(e) => patchMascot({ name: e.target.value })}
              onBlur={() => !mascot.name.trim() && patchMascot({ name: DEFAULT_MASCOT.name })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-[#EAD5BC] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#C84B31]/30"
            />
            <p className="text-xs font-semibold text-[#2D1B0E] mt-4 mb-1.5">Animal</p>
            <div className="flex flex-wrap gap-2">
              {MASCOT_SPECIES.map((o) => <Chip key={o.id} on={mascot.species === o.id} onClick={() => patchMascot({ species: o.id })}>{o.label}</Chip>)}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#2D1B0E] mb-1.5">Colour</p>
            <Swatches colors={MASCOT_COLORS} value={mascot.color} onPick={(c) => patchMascot({ color: c })} label="Guide colour" />
            <p className="text-xs font-semibold text-[#2D1B0E] mt-4 mb-1.5">Accessory</p>
            <div className="flex flex-wrap gap-2">
              {MASCOT_ACCESSORIES.map((o) => <Chip key={o.id} on={mascot.accessory === o.id} onClick={() => patchMascot({ accessory: o.id })}>{o.label}</Chip>)}
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 mt-5 text-sm text-[#6B5344]">
          <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} />
          Play small 8-bit sounds when it talks
        </label>
      </div>

      {/* mode + logout */}
      <div className="paper rounded-2xl p-6 mt-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-[20px] text-[#2D1B0E]">Study mode</h2>
          <p className="text-sm text-[#6B5344]">Pick the one that fits you. You can change it any time.</p>
        </div>
        <div className="flex gap-2">
          <Chip on={tier === 'kids'} onClick={() => setTier('kids')}>School · স্কুল</Chip>
          <Chip on={tier === 'university'} onClick={() => setTier('university')}>University · বিশ্ববিদ্যালয়</Chip>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" onClick={handleLogout}>Log out</Button>
      </div>
    </div>
  );
};
