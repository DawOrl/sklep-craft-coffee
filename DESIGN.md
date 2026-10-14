# Craft Coffee - Design System & Architecture Contract

> **BINDING CONTRACT.** Every agent working on this repo must follow this file exactly:
> colors, fonts, motion language, TypeScript contracts, file ownership.
> All site copy is in **POLISH**. Tone: rzemieślniczy, spokojny, pewny siebie,
> bez wykrzykników, forma „Ty". Prices in PLN.

## 1. Art direction - "Dark Roast Editorial"

Premium, magazynowy klimat ciemnej palarni kawy. Głęboka espresso-czerń, kremowe
serify, złote akcenty, dużo światła (whitespace), cienkie linie 1px, editorial
numbering („01 - Etiopia"), subtelne ziarno (grain) na całej stronie.
Inspiracja: Awwwards-owe strony marek specialty coffee.

## 2. Color tokens (Tailwind v4 `@theme` in `globals.css`)

NEVER hardcode other colors. Use ONLY these tokens (available as Tailwind
utilities, e.g. `bg-espresso`, `text-crema`, `border-line`):

```css
--color-espresso: #120d0a;   /* tło główne */
--color-roast:    #1b1410;   /* powierzchnie, karty */
--color-roast-2:  #251b14;   /* hover powierzchni, wyróżnione karty */
--color-line:     #2e2219;   /* bordery 1px */
--color-crema:    #efe6d4;   /* tekst główny, nagłówki */
--color-latte:    #a6937d;   /* tekst wyciszony, opisy */
--color-gold:     #c99a5f;   /* akcent: CTA, detale, hover linków */
--color-gold-soft:#e2c794;   /* hover akcentu, podkreślenia */
--color-ember:    #c05f3c;   /* rzadko: badge „nowość/limitowana" */
```

Exception: per-product `palette` colors (sekcja 6) used ONLY for bag photo colours /
product accents.

## 3. Typography

- **Display (h1–h3, ceny duże):** `Fraunces` via `next/font/google`, variable
  (`wght` 300–600, normal + italic). CSS var `--font-fraunces`, Tailwind utility
  `font-display`. Italic Fraunces for emphasized single words inside headlines.
- **Body/UI:** Geist Sans (`--font-geist-sans`, default `font-sans`).
- **Labels/eyebrows/mono details:** Geist Mono (`font-mono`), uppercase,
  `tracking-[0.2em]`, 11–12px - e.g. `„01 - ETIOPIA"`, `„ŚWIEŻY WYPAŁ"`.
- Scale: hero `clamp(3rem, 9vw, 8.25rem)` leading ~0.95; section h2
  `clamp(2.25rem, 5vw, 4rem)`; body 16–18px, `text-latte` for descriptions.

## 4. Motion language (GSAP + Lenis)

Stack: `gsap` + `gsap/ScrollTrigger` (+ `gsap/SplitText` - free since GSAP 3.13),
`lenis` smooth scroll. ALL motion components live in `src/components/motion/`
and MUST respect `prefers-reduced-motion` (render static, no pin/scrub).

- **Eases/durations:** default `power3.out`, hero `expo.out`; 0.7–1.1s;
  stagger 0.06–0.08.
- **Reveal:** y: 32→0, opacity 0→1, trigger at 85% viewport, play once.
- **Headlines:** split into lines, each line in `overflow-hidden` mask,
  y: 110%→0, stagger.
- **Parallax images:** `yPercent` ±12, scrub.
- **Pinned storytelling:** ScrollTrigger `pin: true, scrub: 1` (home: sekcja
  „Od ziarna do filiżanki" - horizontal scroll przez 4 kroki).
- **Marquee:** CSS keyframes `translateX(-50%)`, duplicated content, ~28s linear.
- **Magnetic buttons:** strength ~0.35, only on `(hover: hover) and (pointer: fine)`.
- **Custom cursor:** 8px gold dot + 36px ring (lerp 0.15), `mix-blend-difference`;
  grows on interactive hover; hidden on touch + reduced-motion.
- **Counters:** count-up on viewport enter (gsap), mono font.
- **Lenis + ScrollTrigger integration:** lenis instance drives
  `ScrollTrigger.update` via `lenis.on('scroll', ...)` + `gsap.ticker`.
- **Grain:** fixed, pointer-events-none, full-screen SVG `feTurbulence`
  data-URI overlay, opacity ~0.05, z-40 (cursor z-50).

### Motion component contracts (`src/components/motion/`)

```tsx
<SmoothScroll>{children}</SmoothScroll>      // Lenis provider (client), used in layout
<Reveal delay?: number className?>…</Reveal>  // slide-up reveal on scroll
<SplitHeading as?: 'h1'|'h2'|'h3' className?>tekst</SplitHeading> // line-mask reveal
<Parallax speed?: number className?>…</Parallax>
<Magnetic>…</Magnetic>
<Counter to: number suffix?: string className? />
<Marquee speed?: number className?>…</Marquee>
<CursorFollower />                            // mounted once in layout
```

### View Transitions (page transitions)

If Next 16 docs confirm the experimental flag (`experimental.viewTransition`
in `next.config.ts`) - enable it. Shared-element morph contract: the product
image wrapper gets inline `style={{ viewTransitionName: 'vt-product-' + slug }}`
in BOTH the catalog card and the product page hero. Keep default cross-fade for
other navigations. If the flag doesn't exist in this version, skip silently.

## 5. Layout & UI primitives

- `Container`: `mx-auto max-w-[88rem] px-6 md:px-10`.
- `Button` (`components/ui/Button.tsx`): variants `solid` (bg-gold,
  text-espresso, hover bg-gold-soft), `outline` (border-line, text-crema,
  hover border-gold), `ghost`; sizes `sm|md|lg`; rounded-full; mono uppercase
  tracking for labels; renders `<Link>` when `href` given. Wrapped in Magnetic
  where it matters.
- `Badge`: mono uppercase 10–11px, border 1px; `bestseller`→gold,
  `nowość`/`limitowana`→ember.
- `Price` (`components/ui/Price.tsx`): renders formatted PLN, Fraunces for
  amount; props `{ cents: number; className?: string }`.
- `SectionHeading`: eyebrow (mono gold uppercase) + serif title
  (uses SplitHeading) + optional description.
- `QtyStepper`: − / qty / +, border-line, mono.
- Form `Input`/`Select`/`Textarea` (`components/ui/Field.tsx`): dark, bg-roast,
  border-line, focus:border-gold, label mono uppercase; error text-ember.
- **Header** (fixed, z-30): transparent → `backdrop-blur bg-espresso/70
  border-b border-line` after ~24px scroll. Logo wordmark serif „Craft Coffee".
  Nav: Sklep, O nas, Dostawa, Kontakt. Cart button with live count
  (`useCart().count`) opens CartDrawer. Mobile: full-screen overlay menu with
  staggered links.
- **Footer**: big serif CTA „Napijmy się kawy", link columns (Sklep, Informacje,
  Kontakt), mock newsletter input, mono small print
  „© 2026 Craft Coffee - projekt demonstracyjny".
- **CartDrawer** (right slide-over, z-40, focus-trapped, Esc closes): items with
  photo thumbs, QtyStepper, remove, suma, free-shipping progress, CTAs
  „Przejdź do zamówienia" → `/zamowienie` and „Zobacz koszyk" → `/koszyk`.
  Opens automatically after add-to-cart.

## 6. Data contract - `src/data/products.ts`

```ts
export type Roast = 'jasne' | 'średnie' | 'ciemne';
export type Grind = 'ziarna' | 'mielona drobno' | 'mielona grubo';
export interface ProductVariant { weight: 250 | 1000; priceCents: number }
export interface Product {
  slug: string;            // np. 'etiopia-yirgacheffe'
  name: string;            // np. 'Etiopia Yirgacheffe'
  origin: string;          // kraj
  region?: string;
  roast: Roast;
  kind: 'single origin' | 'mieszanka';
  process?: 'washed' | 'natural' | 'honey';
  notes: [string, string, string];   // np. ['jagody','jaśmin','cytrusy']
  description: string;     // 1–2 zdania, karta katalogu
  story: string;           // 2–3 akapity (\n\n), karta produktu
  altitudeMasl?: number;
  variants: ProductVariant[];        // [0] = 250g = cena bazowa
  grinds: Grind[];
  badges?: ('bestseller' | 'nowość' | 'limitowana')[];
  palette: { bag: string; accent: string };  // kolory ilustracji worka
  rating: number;          // 4.5–5.0
}
export const products: Product[];            // 10 kaw
export function getProduct(slug: string): Product | undefined;
export function getBestsellers(): Product[]; // 3–4 z badge bestseller
```

10 coffees, realistic PL specialty copy (Etiopia Yirgacheffe, Kolumbia Huila,
Brazylia Cerrado, Kenia AA, Gwatemala Antigua, Peru Cajamarca, Indonezja
Sumatra, Rwanda, espresso blend „Rzemieślnik", bezkofeinowa „Wieczorna").
Prices 4200–6900 cents (250g), 1kg ≈ 3.2× ceny 250g. Palety `bag` harmonizing
with the dark theme (muted: oliwka, ceglasty, piaskowy, bordo, szałwia…),
`accent` lighter version.

## 7. Cart contract - `src/lib/cart.tsx`

```tsx
export interface CartItem {
  key: string;             // `${slug}|${weight}|${grind}`
  slug: string; name: string;
  weight: 250 | 1000; grind: Grind;
  qty: number; priceCents: number;       // unit price
  palette: { bag: string; accent: string };
}
export function CartProvider({ children }): JSX.Element;
export function useCart(): {
  items: CartItem[];
  add(product: Product, opts: { weight: 250|1000; grind: Grind }, qty?: number): void;
  remove(key: string): void;
  setQty(key: string, qty: number): void;  // qty 0 removes
  clear(): void;
  totalCents: number; count: number;
  isDrawerOpen: boolean; openDrawer(): void; closeDrawer(): void;
};
```

Persist to `localStorage` key `craft-coffee-cart-v1`. Hydration-safe: read in
`useEffect` after mount (render empty cart server-side; no SSR mismatch).
`add()` also calls `openDrawer()`.

`src/lib/format.ts`: `formatPrice(cents: number): string` → `49,00 zł`
(`Intl.NumberFormat('pl-PL', { style:'currency', currency:'PLN' })`).

`src/lib/checkout.ts`: `createOrder(data: OrderData, items: CartItem[]):
Promise<{ orderId: string }>` - MOCK (~1.2s delay, random id `CC-XXXXXX`).
Single TODO comment: replace with Stripe Checkout session later.

## 8. Product photos - `src/components/art/ProductPhoto.tsx`

`<ProductPhoto slug name sizes className? preload?>` renders the product
packshot (`src/assets/products/<slug>.webp`, map in `src/data/images.ts`) with
`next/image` and a blur placeholder. One consistent series: the same flat-bottom
bag, light and backdrop; only the paper colour (`palette.bag`) and the label
mark change (origin initial, `&` for blends). The parent sets size and aspect
(4:5, or square crop on wide bestseller cards). Small thumbnails zoom in on the
bag (`CartThumb`). `BeanGlyph` (same file folder) is the flat bean mark used as
a separator.

## 9. 3D - `src/components/three/HeroScene.tsx`

Default export, client component `<HeroScene className?>`. Geometry comes from
`public/models/coffee-beans.glb` (4 bean variants built by
`scripts/blender/coffee_beans.py`: flattened ellipsoid, flat side with an
S-shaped centre cut, roast colour baked into `COLOR_0`, meshopt compression).
One `InstancedMesh` per variant, per-bean brightness jitter via instance colour,
satin `MeshPhysicalMaterial` lit by drei `Environment` + `Lightformer` panels
(no HDR download). Separate layouts for landscape and portrait viewports. Beans
settle in on load, float slowly, the group follows the mouse and scroll.
`frameloop` is `demand` when the hero is off screen or under reduced motion
(static frame). Consumed via `next/dynamic` (`ssr: false`) inside a client
wrapper, canvas fades in once the model is ready.

## 10. Routes & file ownership

| Route / file | Owner |
|---|---|
| `src/app/layout.tsx`, `globals.css`, `next.config.ts` | foundation-design |
| `src/components/ui/*`, `motion/*`, `layout/*` (Header, Footer, CartDrawer), `art/*` (ProductPhoto, BeanGlyph), `src/lib/format.ts` | foundation-design |
| `src/data/products.ts`, `src/lib/cart.tsx`, `src/lib/checkout.ts` | foundation-data |
| `src/app/page.tsx`, `src/components/home/*` | page-home |
| `src/components/three/*` | page-hero3d |
| `src/app/sklep/page.tsx`, `src/components/shop/*` | page-catalog |
| `src/app/sklep/[slug]/page.tsx`, `src/components/product/*` | page-product |
| `src/app/koszyk/page.tsx`, `src/app/zamowienie/page.tsx`, `src/app/zamowienie/sukces/page.tsx`, `src/components/checkout/*` | page-checkout |
| `src/app/o-nas/page.tsx`, `src/app/dostawa-i-zwroty/page.tsx`, `src/app/kontakt/page.tsx`, `src/app/not-found.tsx` | page-aux |

Do NOT edit files you don't own. Import across boundaries per contracts above.

## 11. Page specs (short)

- **/** - (1) Hero: full-viewport, HeroScene background, mono eyebrow
  „PALARNIA RZEMIEŚLNICZA - OD 2019", giant split headline „Kawa, która ma
  *charakter*" (italic accent), sub, magnetic CTA „Odkryj nasze kawy" →
  `/sklep`, scroll indicator; (2) marquee divider „ŚWIEŻY WYPAŁ • 100% ARABICA
  • SPECIALTY • MAŁE SERIE •"; (3) Bestsellery: asymmetric editorial grid,
  numbered cards 01–04; (4) „Od ziarna do filiżanki" - PINNED horizontal
  storytelling, 4 steps (Zbiór → Palenie → Mielenie → Parzenie), huge numbers,
  step copy; (5) Wyróżniki + Counters: „48h od wypału do wysyłki", „12 odmian",
  „100% arabica", „4.9 ocena"; (6) duża CTA sekcja → /sklep.
- **/sklep** - filter bar (palenie, rodzaj, mielenie dostępne), sort (cena ↑↓,
  nazwa, ocena), staggered grid of ProductCards (packshot, notes, price, hover
  lift + quick-add), client-side filtering of static data, URL-synced via
  `useSearchParams` + `router.replace`, empty state, licznik wyników mono.
- **/sklep/[slug]** - `generateStaticParams`; breadcrumb mono; left: big bag
  art (view-transition name) on roast surface w/ parallax; right sticky:
  name (split reveal), notes pills, rating, variant pickers (weight pills +
  grind select), live Price, QtyStepper, „Dodaj do koszyka" (magnetic),
  accordion (pochodzenie/parzenie/dostawa); below: story + spec table
  (region, proces, wysokość) + „Podobne kawy" (same roast, 3 szt.);
  Product JSON-LD.
- **/koszyk** - full cart table, steppers, remove, suma + darmowa dostawa od
  14900 cents (progress bar), CTA „Przejdź do zamówienia" → `/zamowienie`;
  empty state z CTA do sklepu.
- **/zamowienie** - 2 kolumny: form (imię, email, telefon, adres, miasto, kod
  pocztowy; walidacja inline po polsku) + podsumowanie pozycji; submit →
  `createOrder` (loading state na przycisku) → push `/zamowienie/sukces` +
  `clear()`. Mono note „Płatności Stripe - wkrótce. To zamówienie testowe."
- **/zamowienie/sukces** - order id, serif podziękowanie, kroki „co dalej",
  CTA powrotu. Reads orderId from searchParam.
- **/o-nas** - story palarni (3 sekcje z parallax), timeline 2019→2026, wartości.
- **/dostawa-i-zwroty** - accordion FAQ + tabela kosztów (InPost 12,99 zł,
  kurier 16,99 zł, darmowa od 149 zł).
- **/kontakt** - mock form + dane palarni (adres, godziny - mono table).
- **not-found** - 404 „Ta kawa się wylała", CTA home. Styled, split heading.

## 12. Quality bar

- `npm run build` green, zero TS/ESLint errors.
- Każdy interaktywny element: focus-visible ring (gold), aria-labels.
- `prefers-reduced-motion` respected by EVERY animation.
- Three.js only via dynamic import on home (keep other routes light).
- Metadata per page (title template `%s - Craft Coffee` in layout), PL lang.
- Server components by default; `'use client'` only where needed.
