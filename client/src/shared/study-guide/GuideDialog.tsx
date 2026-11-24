import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChibiSprite } from './ChibiSprite';
import { useGuide } from './GuideProvider';
import { rootChoices } from './guideBrain';
import { blip } from './pixelAudio';

const TYPE_MS = 24;

/**
 * Front-of-screen mode: the guide pops up with a Pokemon-style dialog box,
 * types its words one character at a time and offers a small menu.
 *
 *  Enter  = next line / pick the highlighted menu item / send what you typed
 *  Up/Down= move in the menu      Esc = cancel opening, then close
 */
export const GuideDialog: React.FC = () => {
  const g = useGuide();
  const reduce = useReducedMotion();
  const lines = g.turn?.lines ?? [];
  const line = lines[g.lineIndex] ?? '';
  const isLast = g.lineIndex >= lines.length - 1;

  const key = `${g.turnId}-${g.lineIndex}`;
  const [typing, setTyping] = useState({ key: '', n: 0 });
  const [text, setText] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const skipKey = useRef('');
  const soundRef = useRef(g.sound);
  soundRef.current = g.sound;

  // derived, so a new reply starts at 0 characters on the very same render
  const shown = reduce ? line.length : typing.key === key ? typing.n : 0;
  const done = shown >= line.length;
  const finishNow = () => { skipKey.current = key; setTyping({ key, n: line.length }); };

  // typewriter
  useEffect(() => {
    if (!g.isOpen || reduce) return;
    let n = 0;
    const id = window.setInterval(() => {
      if (skipKey.current === key) { window.clearInterval(id); return; }
      n += 1;
      setTyping({ key, n });
      if (soundRef.current && n % 2 === 0 && line[n - 1] !== ' ') blip();
      if (n >= line.length) window.clearInterval(id);
    }, TYPE_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, g.isOpen, reduce]);

  useEffect(() => {
    if (g.isOpen && done && isLast) g.lastLineTyped();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, isLast, g.isOpen, key]);

  useEffect(() => { setSel(0); }, [g.turn]);
  useEffect(() => {
    if (g.isOpen) window.setTimeout(() => inputRef.current?.focus(), 50);
  }, [g.isOpen, g.turn]);

  const choices = g.turn?.choices ?? [];
  const showChoices = done && isLast && choices.length > 0 && !g.opening;

  const submitText = () => {
    const q = text.trim();
    if (!q) return false;
    setText('');
    g.ask(q);
    return true;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' && showChoices) { e.preventDefault(); setSel((s) => (s + 1) % choices.length); }
    else if (e.key === 'ArrowUp' && showChoices) { e.preventDefault(); setSel((s) => (s - 1 + choices.length) % choices.length); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (submitText()) return;
      if (!done) finishNow();
      else if (!isLast) g.advance();
      else if (showChoices) g.choose(choices[sel]);
    }
  };

  const onBoxClick = () => {
    if (!done) finishNow();
    else if (!isLast) g.advance();
  };

  const talking = !done;

  return (
    <AnimatePresence>
      {g.isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center px-3 pb-3 sm:pb-6"
          style={{ background: 'rgba(45,27,14,0.38)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.18 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) g.closeGuide(); }}
          role="dialog"
          aria-modal="true"
          aria-label={`${g.mascot.name}, your study guide`}
          onKeyDown={onKeyDown}
        >
          <div className="w-full max-w-[780px] flex flex-col sm:flex-row items-center sm:items-end gap-2 sm:gap-4">
            <motion.div
              initial={reduce ? false : { y: 70, scale: 0.6, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={reduce ? undefined : { y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20 }}
              className="shrink-0 -mb-2"
            >
              <ChibiSprite config={g.mascot} pose={talking ? 'talk' : 'idle'} size={150} className="w-[110px] h-[110px] sm:w-[150px] sm:h-[150px]" />
            </motion.div>

            <motion.div
              className="relative flex-1 w-full"
              initial={reduce ? false : { y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? undefined : { y: 30, opacity: 0 }}
              transition={{ duration: 0.22, delay: reduce ? 0 : 0.06 }}
            >
              <div className="px-tag px-font absolute -top-5 left-5 px-3 py-1 text-[10px] uppercase tracking-wide">{g.mascot.name}</div>

              <div className="px-box px-font px-5 pt-6 pb-4 sm:px-7 cursor-default" onClick={onBoxClick}>
                <button
                  type="button"
                  className="absolute top-2 right-3 text-[8px] opacity-60 hover:opacity-100 bg-transparent border-0 px-font"
                  onClick={(e) => { e.stopPropagation(); g.setSound(!g.sound); }}
                  aria-pressed={g.sound}
                >
                  SOUND {g.sound ? 'ON' : 'OFF'}
                </button>

                <p className="sr-only-live" role="status">{line}</p>
                <p aria-hidden="true" className="min-h-[88px] text-[11px] sm:text-[12px] leading-[1.95] break-words">
                  {line.slice(0, shown)}
                  {done && !showChoices && !g.opening && (
                    <span className="px-caret ml-1 inline-block">{isLast ? '■' : '▼'}</span>
                  )}
                </p>

                {g.opening && (
                  <p className="text-[9px] leading-[1.8] text-[#C84B31]">
                    <span className="px-caret">▶</span> OPENING {g.opening.label.toUpperCase().slice(0, 34)}...
                    <br />
                    <span className="text-[#6B5344]">ESC TO STAY HERE</span>
                  </p>
                )}

                {showChoices && (
                  <ul className="mt-1 mb-2 space-y-0.5" role="menu">
                    {choices.map((c, i) => (
                      <li key={c.label} role="none">
                        <button
                          role="menuitem"
                          type="button"
                          data-active={i === sel}
                          className="px-menu-item px-font text-[10px] sm:text-[11px] py-1.5 px-2"
                          onMouseEnter={() => setSel(i)}
                          onClick={(e) => { e.stopPropagation(); g.choose(c); }}
                        >
                          <span className={i === sel ? 'px-caret inline-block w-4' : 'inline-block w-4'}>{i === sel ? '▶' : ''}</span>
                          {c.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <form
                  className="mt-2 flex gap-2"
                  onSubmit={(e) => { e.preventDefault(); submitText(); }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    ref={inputRef}
                    className="px-input flex-1 min-w-0 px-3 py-2 text-[9px] sm:text-[10px]"
                    placeholder='Ask me... "open library"'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    aria-label="Ask the study guide"
                    maxLength={80}
                  />
                  <button type="submit" className="px-tag px-font text-[9px] px-3 cursor-pointer">ASK</button>
                </form>
                <p className="mt-2 text-[7px] sm:text-[8px] text-[#6B5344] leading-[1.8]">ENTER: NEXT · ESC: CLOSE · CTRL+M: TOGGLE</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// re-export so callers can show the same suggestions elsewhere
export { rootChoices };
