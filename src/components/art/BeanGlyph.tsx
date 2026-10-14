interface BeanGlyphProps {
  className?: string;
}

/**
 * Flat mark of a roasted bean: oval with the S-shaped centre cut. The same
 * shape as the 3D beans in the hero, used as a separator and small motif.
 */
export function BeanGlyph({ className }: BeanGlyphProps) {
  return (
    <svg viewBox="0 0 24 32" aria-hidden="true" className={className} fill="none">
      <ellipse cx="12" cy="16" rx="10" ry="14.5" fill="currentColor" transform="rotate(-18 12 16)" />
      <path
        d="M15.6 3.6c-4.4 3.2-1.8 8.2-3.6 12.4-1.6 3.8-6.2 6-3.6 12.4"
        stroke="var(--color-espresso)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default BeanGlyph;
