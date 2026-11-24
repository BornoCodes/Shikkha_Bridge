import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlponaRosette } from '../../bengali-art/Motifs';

/**
 * Route transition: the old page fades, a terracotta kantha "curtain" with a
 * spinning alpona sweeps across the screen, and the new page rises in behind it.
 * Visitors who prefer reduced motion get a plain, quick fade instead.
 */
const Curtain: React.FC<{ onDone: () => void }> = ({ onDone }) => (
  <motion.div
    className="curtain"
    initial={{ x: '-101%' }}
    animate={{ x: ['-101%', '0%', '0%', '101%'] }}
    transition={{ duration: 0.8, times: [0, 0.36, 0.5, 1], ease: ['easeOut', 'linear', 'easeIn'] }}
    onAnimationComplete={onDone}
    aria-hidden="true"
  >
    <motion.div animate={{ rotate: 200 }} transition={{ duration: 0.8, ease: 'easeInOut' }}>
      <AlponaRosette size={104} color="#FFD9A0" accent="#FFFFFF" />
    </motion.div>
  </motion.div>
);

export const RouteTransition: React.FC = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const reduce = useReducedMotion();

  const previous = useRef(location.pathname);
  const [curtainKey, setCurtainKey] = useState<string | null>(null);

  useEffect(() => {
    if (previous.current !== location.pathname) {
      previous.current = location.pathname;
      if (!reduce) setCurtainKey(location.pathname + Date.now());
      window.scrollTo({ top: 0 });
    }
  }, [location.pathname, reduce]);

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0.12 : 0.4, delay: reduce ? 0 : 0.05, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, transition: { duration: reduce ? 0.08 : 0.2 } }}
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
      {curtainKey && <Curtain key={curtainKey} onDone={() => setCurtainKey(null)} />}
    </>
  );
};
