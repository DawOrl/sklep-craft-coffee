import type { Product } from "@/data/products";

interface ProductBagArtProps {
  product: Product;
  className?: string;
}

const ROAST_LEVEL: Record<Product["roast"], number> = {
  jasne: 1,
  średnie: 2,
  ciemne: 3,
};

const MONO = "var(--font-geist-mono), ui-monospace, monospace";
const SERIF = "var(--font-fraunces), Georgia, serif";

/**
 * Consistent flat SVG illustration of a standing doypack coffee bag.
 * Body in palette.bag, details in palette.accent, kraft (crema) label with
 * serif origin initial, mono name and 1–3 roast dots. Scales 80px–600px.
 * THE product image everywhere (cards, product page, cart, drawer).
 */
export function ProductBagArt({ product, className }: ProductBagArtProps) {
  const { name, origin, roast, palette } = product;
  const dots = ROAST_LEVEL[roast] ?? 2;
  const initial = (origin.charAt(0) || "C").toUpperCase();
  const upperName = name.toUpperCase();
  const nameLength = Math.min(84, upperName.length * 5.2);

  return (
    <svg
      viewBox="0 0 200 260"
      role="img"
      aria-label={`Worek kawy ${name}`}
      className={className}
      fill="none"
    >
      {/* ground shadow */}
      <ellipse
        cx="100"
        cy="248"
        rx="60"
        ry="6"
        fill="var(--color-espresso)"
        opacity="0.55"
      />

      {/* bag body (doypack) */}
      <path
        d="M46 50 C46 41 52 36 60 36 H140 C148 36 154 41 154 50 L159 218 C160 232 150 242 136 242 H64 C50 242 40 232 41 218 Z"
        fill={palette.bag}
      />

      {/* side gusset shading */}
      <path
        d="M50 46 L45 230"
        stroke="var(--color-espresso)"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.18"
      />
      <path
        d="M150 46 L155 230"
        stroke="var(--color-espresso)"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.18"
      />

      {/* soft vertical highlight */}
      <path
        d="M64 44 L61 232"
        stroke="var(--color-crema)"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.06"
      />

      {/* top seal: fold line + accent clip */}
      <path
        d="M46 60 H154.4"
        stroke="var(--color-espresso)"
        strokeWidth="1.5"
        opacity="0.35"
      />
      <rect x="72" y="44" width="56" height="7" rx="3.5" fill={palette.accent} />

      {/* bottom gusset crease */}
      <path
        d="M48 230 Q100 240 152 230"
        stroke="var(--color-espresso)"
        strokeWidth="1.5"
        opacity="0.25"
      />

      {/* kraft label */}
      <rect
        x="52"
        y="100"
        width="96"
        height="100"
        rx="3"
        fill="var(--color-crema)"
      />
      <rect
        x="56.5"
        y="104.5"
        width="87"
        height="91"
        rx="1.5"
        stroke={palette.accent}
        strokeWidth="1"
        opacity="0.65"
      />

      {/* label: roastery micro-mark */}
      <text
        x="100"
        y="118"
        textAnchor="middle"
        fontFamily={MONO}
        fontSize="6"
        letterSpacing="2"
        fill="var(--color-espresso)"
        opacity="0.55"
      >
        CRAFT COFFEE
      </text>

      {/* label: serif initial of origin */}
      <text
        x="100"
        y="160"
        textAnchor="middle"
        fontFamily={SERIF}
        fontSize="42"
        fontWeight="500"
        fill={palette.bag}
      >
        {initial}
      </text>

      {/* label: accent rule */}
      <path
        d="M84 169 H116"
        stroke={palette.accent}
        strokeWidth="1.5"
      />

      {/* label: mono product name */}
      <text
        x="100"
        y="181.5"
        textAnchor="middle"
        fontFamily={MONO}
        fontSize="7"
        letterSpacing="1"
        fill="var(--color-espresso)"
        opacity="0.8"
        textLength={nameLength}
        lengthAdjust="spacingAndGlyphs"
      >
        {upperName}
      </text>

      {/* label: roast dots (1–3) */}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={90 + i * 10}
          cy="191"
          r="2.8"
          fill={i < dots ? "var(--color-espresso)" : "none"}
          stroke="var(--color-espresso)"
          strokeWidth="1"
          opacity={i < dots ? 0.85 : 0.35}
        />
      ))}

      {/* origin under the label */}
      <text
        x="100"
        y="222"
        textAnchor="middle"
        fontFamily={MONO}
        fontSize="6.5"
        letterSpacing="2.5"
        fill="var(--color-crema)"
        opacity="0.55"
      >
        {origin.toUpperCase()}
      </text>
    </svg>
  );
}

export default ProductBagArt;
