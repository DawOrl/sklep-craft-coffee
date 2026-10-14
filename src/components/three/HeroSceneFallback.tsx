/**
 * Lightweight placeholder shown while the 3D hero chunk loads.
 * Server-safe, zero JS - import directly from this file in `next/dynamic`
 * fallbacks so the three.js bundle is not pulled in with it.
 */
export interface HeroSceneFallbackProps {
  className?: string;
}

export function HeroSceneFallback({ className }: HeroSceneFallbackProps) {
  return (
    <div
      aria-hidden="true"
      className={`bg-[radial-gradient(120%_90%_at_68%_38%,var(--color-roast-2)_0%,var(--color-roast)_38%,var(--color-espresso)_78%)] ${className ?? ''}`}
    />
  );
}

export default HeroSceneFallback;
