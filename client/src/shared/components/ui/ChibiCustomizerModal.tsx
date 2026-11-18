import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { ChibiMascotConfig, MascotSpecies, MascotAccessory } from '../../types';
import { Sparkles, Heart } from 'lucide-react';

interface ChibiCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: ChibiMascotConfig;
  onSave: (config: ChibiMascotConfig) => void;
}

export const ChibiCustomizerModal: React.FC<ChibiCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onSave,
}) => {
  const [name, setName] = useState(currentConfig.name);
  const [species, setSpecies] = useState<MascotSpecies>(currentConfig.species);
  const [color, setColor] = useState(currentConfig.color);
  const [accessory, setAccessory] = useState<MascotAccessory>(currentConfig.accessory);

  const speciesList: { id: MascotSpecies; label: string; icon: string; desc: string }[] = [
    { id: 'cat', label: 'Chibi Cat', icon: '🐱', desc: 'Curious & cheerful' },
    { id: 'tiger', label: 'Tiger Cub', icon: '🐯', desc: 'Brave & energetic' },
    { id: 'owl', label: 'Wise Owlet', icon: '🦉', desc: 'Smart & thoughtful' },
    { id: 'bunny', label: 'Chibi Bunny', icon: '🐰', desc: 'Gentle & friendly' },
  ];

  const colorPalette = [
    { label: 'Peach Cream', hex: '#FFF2E2' },
    { label: 'Turmeric Gold', hex: '#FDE68A' },
    { label: 'Soft Lotus', hex: '#FBCFE8' },
    { label: 'River Teal', hex: '#CCFBF1' },
    { label: 'Pure Cloud', hex: '#FFFFFF' },
  ];

  const accessories: { id: MascotAccessory; label: string; icon: string }[] = [
    { id: 'cap', label: 'Graduation Cap', icon: '🎓' },
    { id: 'glasses', label: 'Scholar Glasses', icon: '👓' },
    { id: 'flower', label: 'Red Lotus', icon: '🌸' },
    { id: 'scarf', label: 'Bengal Scarf', icon: '🧣' },
    { id: 'none', label: 'Natural Cute', icon: '✨' },
  ];

  const handleSave = () => {
    onSave({
      ...currentConfig,
      name: name.trim() || 'Mimi',
      species,
      color,
      accessory,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customize Your AI Study Companion" maxWidth="lg">
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-xs text-matti-light">
            Your chibi companion cheers you on during disruptions, tracks what topics you should master first, and guides your recovery path!
          </p>
        </div>

        {/* Mascot Name */}
        <Input
          label="Mascot Name"
          placeholder="e.g. Mimi, Pitu, Bondhu..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Choose Species */}
        <div>
          <label className="block text-xs font-bold text-matti mb-2">
            Choose Character Type:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {speciesList.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSpecies(s.id)}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                  species === s.id
                    ? 'border-terracotta bg-terracotta/10 shadow-xs ring-2 ring-terracotta/20'
                    : 'border-parchment-dark bg-white/60 hover:border-terracotta/40'
                }`}
              >
                <span className="text-3xl mb-1">{s.icon}</span>
                <span className="text-xs font-bold text-matti">{s.label}</span>
                <span className="text-[10px] text-matti-light">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <label className="block text-xs font-bold text-matti mb-2">
            Companion Color Tint:
          </label>
          <div className="flex flex-wrap gap-3">
            {colorPalette.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setColor(c.hex)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  color === c.hex
                    ? 'border-terracotta ring-2 ring-terracotta/30 bg-white font-bold'
                    : 'border-parchment-dark bg-white/60 hover:border-terracotta/40'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-black/20"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accessories */}
        <div>
          <label className="block text-xs font-bold text-matti mb-2">
            Wearable Accessory:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {accessories.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAccessory(a.id)}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                  accessory === a.id
                    ? 'border-terracotta bg-terracotta/10 font-bold shadow-xs'
                    : 'border-parchment-dark bg-white/60 hover:border-terracotta/40'
                }`}
              >
                <span className="text-xl mb-0.5">{a.icon}</span>
                <span className="text-[11px] text-matti">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-parchment-dark flex justify-end gap-3">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSave} className="shadow-md shadow-terracotta/20">
            <Sparkles className="w-4 h-4 mr-1.5" />
            Save My Companion
          </Button>
        </div>
      </div>
    </Modal>
  );
};
