import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChibiPose, ChibiSprite } from './ChibiSprite';
import { useGuide } from './GuideProvider';

const SIZE = 72;
const SPEED = 40; // pixels per second
const CHORES: ChibiPose[] = ['read', 'sweep', 'water', 'nap', 'wave', 'idle'];

/**
 * The little guide that lives along the bottom of the screen, wandering back
 * and forth and doing chores. Click it (or press Ctrl+M) to talk.
 */
export const GuideWalker: React.FC = () => {
  const { isOpen, openGuide, mascot, tip, dismissTip } = useGuide();
  const reduce = useReducedMotion();

  const [x, setX] = useState(40);
  const [dir, setDir] = useState<1 | -1>(1);
  const [pose, setPose] = useState<ChibiPose>('idle');
  const [seconds, setSeconds] = useState(0);
  const xRef = useRef(40);

  useEffect(() => {
    if (reduce || isOpen) return;
    let alive = true;
    let timer = 0;
    const next = () => {
      if (!alive) return;
      if (Math.random() < 0.55) {
        const max = Math.max(120, window.innerWidth - SIZE - 16);
        const target = 12 + Math.random() * (max - 12);
        const secs = Math.max(1.4, Math.abs(target - xRef.current) / SPEED);
        setDir(target >= xRef.current ? 1 : -1);
        setPose('walk');
        setSeconds(secs);
        setX(target);
        xRef.current = target;
        timer = window.setTimeout(next, secs * 1000 + 250);
      } else {
        setPose(CHORES[Math.floor(Math.random() * CHORES.length)]);
        setSeconds(0);
        timer = window.setTimeout(next, 3500 + Math.random() * 3500);
      }
    };
    timer = window.setTimeout(next, 900);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [reduce, isOpen]);

  // While the guide is in front of the screen, the walker steps out.
  if (isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none" style={{ height: SIZE + 18 }} aria-live="off">
      <motion.div
        className="absolute bottom-1 left-0"
        initial={false}
        animate={{ x }}
        transition={{ duration: seconds, ease: 'linear' }}
        style={{ width: SIZE }}
      >
        {tip && (
          <div
            className="absolute px-box px-font pointer-events-auto cursor-pointer"
            style={{ bottom: SIZE - 2, left: dir === 1 ? 6 : undefined, right: dir === -1 ? 6 : undefined, width: 190, padding: '10px 12px', fontSize: 8, lineHeight: 1.7 }}
            onClick={() => openGuide(tip.query)}
            role="button"
            tabIndex={-1}
          >
            <button
              aria-label="Dismiss tip"
              onClick={(e) => { e.stopPropagation(); dismissTip(); }}
              className="absolute top-0 right-1 text-[10px] leading-none opacity-60 hover:opacity-100"
            >
              x
            </button>
            {tip.text}
            <div className="mt-1 opacity-60">CTRL+M to chat</div>
          </div>
        )}
        <button
          type="button"
          className="pointer-events-auto block cursor-pointer bg-transparent border-0 p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C84B31] rounded-xl"
          style={{ transform: `scaleX(${dir})`, transition: 'transform 0.2s' }}
          onClick={() => openGuide()}
          aria-label={`Talk to ${mascot.name}, your study guide (Ctrl+M)`}
          title={`${mascot.name} · click or press Ctrl+M`}
        >
          <ChibiSprite config={mascot} pose={reduce ? 'idle' : pose} size={SIZE} />
        </button>
        {tip && <span className="absolute -top-1 right-0 px-font text-[12px] text-[#C84B31] animate-bounce pointer-events-none">!</span>}
      </motion.div>
    </div>
  );
};
