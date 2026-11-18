import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalStore } from '../hooks/useLocalStore';
import type { ChibiMascotConfig } from '../types';
import { DEFAULT_MASCOT } from './ChibiSprite';
import { answer, Choice, greet, GuideReply, proactiveTip, StudyState, Tip } from './guideBrain';
import { chime, select } from './pixelAudio';
import { useStudyState } from './useStudyState';

const SPECIES = ['cat', 'tiger', 'owl', 'bunny'];
const ACCESSORIES = ['glasses', 'cap', 'flower', 'scarf', 'none'];
const AUTO_OPEN_MS = 1600;

export function sanitizeMascot(raw: unknown): ChibiMascotConfig {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const d = DEFAULT_MASCOT;
  return {
    ...d,
    name: typeof r.name === 'string' && r.name.trim() ? r.name.trim().slice(0, 12) : d.name,
    species: (SPECIES.includes(r.species as string) ? r.species : d.species) as ChibiMascotConfig['species'],
    color: typeof r.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(r.color) ? r.color : d.color,
    accessory: (ACCESSORIES.includes(r.accessory as string) ? r.accessory : d.accessory) as ChibiMascotConfig['accessory'],
  };
}

interface GuideContextValue {
  state: StudyState;
  isOpen: boolean;
  openGuide: (query?: string) => void;
  closeGuide: () => void;
  toggleGuide: () => void;
  ask: (query: string) => void;
  choose: (c: Choice) => void;
  turn: GuideReply | null;
  /** changes every time the guide starts a new reply */
  turnId: number;
  lineIndex: number;
  advance: () => void;
  /** the dialog calls this when the last line has finished typing */
  lastLineTyped: () => void;
  /** set while the guide is about to open a page on its own */
  opening: { label: string } | null;
  cancelOpening: () => void;
  mascot: ChibiMascotConfig;
  setMascot: (m: ChibiMascotConfig) => void;
  sound: boolean;
  setSound: (on: boolean) => void;
  tip: Tip | null;
  dismissTip: () => void;
}

const GuideContext = createContext<GuideContextValue | null>(null);

export function useGuide(): GuideContextValue {
  const ctx = useContext(GuideContext);
  if (!ctx) throw new Error('useGuide must be used inside <GuideProvider>');
  return ctx;
}

export const GuideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = useStudyState();

  const [rawMascot, setRawMascot] = useLocalStore<ChibiMascotConfig>(`shikkha_mascot_${user?.id ?? 'guest'}`, DEFAULT_MASCOT);
  const mascot = useMemo(() => sanitizeMascot(rawMascot), [rawMascot]);
  const [sound, setSound] = useLocalStore<boolean>('shikkha_guide_sound', false);

  const [isOpen, setOpen] = useState(false);
  const [turn, setTurn] = useState<GuideReply | null>(null);
  const [turnId, setTurnId] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [armed, setArmed] = useState(false); // last line typed, countdown to open may run
  const [cancelled, setCancelled] = useState(false);

  /* ---- the "I have a tip" bubble: once per browser session ---- */
  const tipValue = useMemo(() => proactiveTip(state), [state]);
  const [tipVisible, setTipVisible] = useState(false);
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('shikkha_tip_seen') === '1'; } catch { /* ignore */ }
    if (seen || !tipValue) return;
    const show = window.setTimeout(() => {
      setTipVisible(true);
      try { sessionStorage.setItem('shikkha_tip_seen', '1'); } catch { /* ignore */ }
    }, 3000);
    const hide = window.setTimeout(() => setTipVisible(false), 3000 + 14000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [tipValue]);

  const play = useCallback((t: GuideReply) => {
    setTurn(t);
    setTurnId((n) => n + 1);
    setLineIndex(0);
    setArmed(false);
    setCancelled(false);
  }, []);

  const ask = useCallback((query: string) => play(answer(query, state)), [play, state]);

  const openGuide = useCallback(
    (query?: string) => {
      setTipVisible(false);
      setOpen(true);
      if (sound) chime();
      play(query ? answer(query, state) : greet(state));
    },
    [play, sound, state],
  );

  const closeGuide = useCallback(() => {
    setOpen(false);
    setTurn(null);
    setArmed(false);
  }, []);

  const toggleGuide = useCallback(() => (isOpen ? closeGuide() : openGuide()), [isOpen, closeGuide, openGuide]);

  const choose = useCallback(
    (c: Choice) => {
      if (sound) select();
      if (c.to) play({ lines: [`Okay! Opening ${c.label}.`], open: { to: c.to, label: c.label } });
      else if (c.query) ask(c.query);
    },
    [ask, play, sound],
  );

  const advance = useCallback(() => {
    setLineIndex((i) => (turn && i < turn.lines.length - 1 ? i + 1 : i));
  }, [turn]);

  const lastLineTyped = useCallback(() => setArmed(true), []);
  const cancelOpening = useCallback(() => setCancelled(true), []);

  /* ---- open a page on its own, a moment after the guide finishes talking ---- */
  const target = turn?.open;
  const shouldOpen = isOpen && armed && !cancelled && !!target;
  const targetLabel = target?.label;
  const targetTo = target?.to;
  const opening = useMemo(() => (shouldOpen && targetLabel ? { label: targetLabel } : null), [shouldOpen, targetLabel]);
  useEffect(() => {
    if (!shouldOpen || !targetTo) return;
    const t = window.setTimeout(() => {
      navigate(targetTo);
      closeGuide();
    }, AUTO_OPEN_MS);
    return () => clearTimeout(t);
  }, [shouldOpen, targetTo, navigate, closeGuide]);

  /* ---- keyboard: Ctrl+M (or Alt+M) toggles, Esc cancels / closes ---- */
  const latest = useRef({ isOpen, opening, toggleGuide, closeGuide, cancelOpening });
  latest.current = { isOpen, opening, toggleGuide, closeGuide, cancelOpening };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const l = latest.current;
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        l.toggleGuide();
      } else if (e.key === 'Escape' && l.isOpen) {
        e.preventDefault();
        if (l.opening) l.cancelOpening();
        else l.closeGuide();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value: GuideContextValue = {
    state, isOpen, openGuide, closeGuide, toggleGuide, ask, choose, turn, turnId, lineIndex, advance, lastLineTyped,
    opening, cancelOpening, mascot, setMascot: setRawMascot, sound, setSound,
    tip: tipVisible ? tipValue : null,
    dismissTip: () => setTipVisible(false),
  };
  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
};
