import React from 'react';
import { GuideDialog } from './GuideDialog';
import { GuideWalker } from './GuideWalker';

export { GuideProvider, useGuide } from './GuideProvider';
export { ChibiSprite, DEFAULT_MASCOT } from './ChibiSprite';

/** Drop this once inside <GuideProvider>: the walker and the dialog. */
export const Guide: React.FC = () => (
  <>
    <GuideWalker />
    <GuideDialog />
  </>
);
