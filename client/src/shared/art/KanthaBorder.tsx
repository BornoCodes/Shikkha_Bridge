import React from 'react';
import { kanthaTiles, KanthaVariant } from './kanthaPatterns';

interface KanthaBorderProps {
  variant?: KanthaVariant;
  className?: string;
  opacity?: number;
}

/** A thin strip of nakshi kantha embroidery that repeats along its width. */
export const KanthaBorder: React.FC<KanthaBorderProps> = ({ variant = 'stitch', className = '', opacity = 1 }) => {
  const t = kanthaTiles[variant];
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        height: t.h,
        opacity,
        backgroundImage: t.image,
        backgroundRepeat: 'repeat-x',
        backgroundSize: `${t.w}px ${t.h}px`,
      }}
    />
  );
};

/** The header band: running stitch on top of a kolka vine. */
export const KanthaBand: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={className} aria-hidden="true">
    <KanthaBorder variant="stitch" />
    <KanthaBorder variant="vine" />
  </div>
);
