# Craft Coffee

Sklep internetowy rzemieślniczej palarni kawy specialty - projekt demonstracyjny
e-commerce zbudowany na Next.js 16, z naciskiem na dopracowany design
(„Dark Roast Editorial") i zaawansowane animacje.

> **Demo portfolio** - produkty, palarnia i zamówienia są fikcyjne.
> Płatności działają w trybie mock (integracja Stripe przygotowana do podpięcia).

## Problem i rozwiązanie

Małe lokalne marki (palarnie kawy, rękodzieło, produkty regionalne) często
sprzedają wyłącznie stacjonarnie lub przez wiadomości w social mediach - tracą
sprzedaż poza godzinami otwarcia. Ten projekt pokazuje lekki sklep internetowy,
który rozwiązuje ten problem: katalog z filtrowaniem, koszyk, proces zamówienia
i fundament pod płatności online - sprzedaż 24/7 bez angażowania właściciela.

## Funkcje

- **Strona główna** - hero z polem palonych ziaren 3D (model z Blendera,
  instancing w R3F), bestsellery na zdjęciach produktów, przypinane
  scroll-storytelling „Od ziarna do filiżanki" ze zdjęciami kroków,
  animowane liczniki, CTA na renderze rozsypanych ziaren
- **Katalog** (`/sklep`) - filtry (palenie, rodzaj, mielenie) i sortowanie
  synchronizowane z URL (linki do udostępniania), szybkie dodawanie do koszyka
- **Karta produktu** (`/sklep/[slug]`) - warianty (250 g / 1 kg, stopień
  zmielenia), akordeony, podobne kawy, dane strukturalne JSON-LD, SSG
- **Koszyk** - szufladka + pełny widok, zapis w `localStorage`, pasek postępu
  darmowej dostawy, rozpisana dostawa i suma, pusty koszyk z podpowiedziami
- **Zamówienie** - formularz z walidacją po polsku, podsumowanie, strona
  sukcesu; `createOrder` w [`src/lib/checkout.ts`](src/lib/checkout.ts) to
  jedyne miejsce do podmiany na Stripe Checkout
- **Strony informacyjne** - o nas, dostawa i zwroty (FAQ), kontakt, własne 404

## Design i animacje

Kierunek **„Dark Roast Editorial"** - espresso-czerń, kremowa typografia
serif (Fraunces), złote akcenty, mono-etykiety, subtelne ziarno na całej
stronie. Pełny brief i kontrakty komponentów: [DESIGN.md](DESIGN.md).

- płynny scroll (**Lenis**) zintegrowany z **GSAP ScrollTrigger**
- nagłówki odsłaniane linia po linii (**SplitText**), reveale, parallax
- przypinana sekcja z horyzontalnym przewijaniem (pin + scrub)
- **View Transitions** - obraz produktu płynnie morfuje między katalogiem
  a kartą produktu
- pole ziaren kawy 3D (**react-three-fiber**) reagujące na mysz i scroll;
  geometria z proceduralnego skryptu Blendera, renderowane tylko, gdy hero
  jest na ekranie
- magnetyczne przyciski, własny kursor, marquee
- wszystkie animacje respektują `prefers-reduced-motion`

## Grafika

- **Model ziarna** - `scripts/blender/coffee_beans.py` (Blender 5.2, bez
  zewnętrznych modeli): 4 warianty palonego ziarna z bruzdą w kształcie S,
  eksport `public/models/coffee-beans.glb` (meshopt) oraz rendery Cycles
  rozsypanych ziaren (`src/assets/process/roast.webp`,
  `src/assets/render/beans-spill.webp`).

  ```bash
  blender --background --factory-startup --python-exit-code 1 \
    --python scripts/blender/coffee_beans.py -- [--preview] [--only glb,pile]
  ```

- **Zdjęcia produktów i palarni** (`src/assets/products`, `story`, `process`)
  - wygenerowane jako spójna seria (jedna torba, jedno światło, zmienia się
  kolor papieru i znak na etykiecie), bez prawdziwych marek.

## Stack

| Warstwa | Technologia |
|---|---|
| Framework | Next.js 16 (App Router, SSG, View Transitions) |
| UI | React 19, TypeScript, Tailwind CSS v4 |
| Animacje | GSAP (ScrollTrigger, SplitText), Lenis |
| 3D | three.js, @react-three/fiber, @react-three/drei |
| Stan koszyka | React Context + `useSyncExternalStore` + `localStorage` |
| Płatności | mock → Stripe Checkout (przygotowane) |

## Uruchomienie

```bash
npm install
npm run dev        # http://localhost:3000
```

Build produkcyjny:

```bash
npm run build
npm start
```

## Struktura

```
src/
├── app/                 # routy (App Router): /, /sklep, /sklep/[slug],
│                        # /koszyk, /zamowienie, /o-nas, /kontakt, …
├── components/
│   ├── ui/              # prymitywy: Button, Badge, Price, Field, …
│   ├── motion/          # animacje: SmoothScroll, Reveal, SplitHeading, …
│   ├── layout/          # Header, Footer, CartDrawer
│   ├── three/           # scena 3D hero
│   ├── art/             # zdjęcie produktu (next/image), znak ziarna
│   └── home|shop|product|checkout/   # sekcje per strona
├── data/products.ts     # katalog 10 kaw (docelowo CMS/baza)
└── lib/                 # koszyk, checkout, formatowanie cen
```

## Roadmap

- [ ] Stripe Checkout w trybie testowym (klucze w `.env.local`)
- [ ] Wdrożenie na Vercel
- [ ] Panel administracyjny (produkty, zamówienia)
- [ ] Baza danych (Supabase/Postgres) zamiast pliku danych
- [ ] Kody rabatowe, subskrypcja kawy, integracja z InPost API
