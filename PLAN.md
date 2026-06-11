# Craft Coffee — plan rozbudowy

> Projekt demo do portfolio (`dorlowski.dev`, slug: `sklep-craft-coffee`).
> Cel: pokazać kompetencje w **e-commerce** — koszyk, płatności, zarządzanie
> produktami. Segment rosnący ~10%/rok w PL.

## Kontekst (z case study)

- **Problem:** małe lokalne marki (palarnie kawy, rękodzieło, produkty
  regionalne) sprzedają stacjonarnie lub przez wiadomości na social mediach —
  tracą sprzedaż poza godzinami otwarcia.
- **Rozwiązanie:** lekki sklep internetowy — katalog z filtrowaniem, koszyk,
  proces zamówienia, płatności online.
- **Efekt:** sprzedaż 24/7, automatyczne płatności, zasięg poza region;
  samodzielne zarządzanie asortymentem.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · **Stripe** (płatności).
Hosting: Vercel. Stan koszyka: React Context + `localStorage`.

## Struktura

1. **Strona główna** — hero marki, bestsellery, wyróżniki (świeże palenie itp.).
2. **Katalog** (`/sklep`) — siatka produktów, filtry (rodzaj kawy, palenie),
   sortowanie; dane w `src/data/products.ts` (docelowo CMS/baza).
3. **Karta produktu** (`/sklep/[slug]`) — galeria, opis, warianty (gramatura,
   mielenie), przycisk „Dodaj do koszyka”.
4. **Koszyk** — lista pozycji, ilości, suma; przejście do płatności.
5. **Checkout** — dane dostawy + Stripe Checkout.
6. **Strony pomocnicze** — o marce, dostawa i zwroty, kontakt, stopka.

## Etapy realizacji

- [ ] **Etap 1 — fundament:** layout sklepu, dane produktów, komponenty
      (ProductCard, Price, Badge), Context koszyka + `localStorage`.
- [ ] **Etap 2 — katalog + produkt:** lista z filtrami/sortowaniem, karta
      produktu z wariantami, dodawanie do koszyka.
- [ ] **Etap 3 — koszyk + checkout:** widok koszyka, integracja **Stripe
      Checkout** (test mode), strona sukcesu/anulowania.
- [ ] **Etap 4 — SEO/dane:** dane strukturalne `Product`/`Offer`, metadane per
      produkt, sitemap (produkty), OG image.
- [ ] **Etap 5 — polish:** stany puste/ładowania, RWD, dostępność, Lighthouse,
      wdrożenie na Vercel (klucze Stripe w env).

## Uwaga techniczna

- Klucze Stripe: **secret** tylko po stronie serwera (API route / route handler),
  publishable może być `NEXT_PUBLIC_`. Nigdy nie commituj kluczy — `.env.local`.

## Pomysły rozszerzeń

- Panel administracyjny (dodawanie produktów, podgląd zamówień).
- Integracja z bazą (Supabase/Postgres) zamiast pliku danych.
- Kody rabatowe, subskrypcja kawy (cykliczne dostawy).
- Integracja z kurierem / InPost API.

## Po wdrożeniu (powrót do portfolio)

1. Wrzuć na Vercel → zapisz URL (Stripe w trybie test wystarczy do demo).
2. W `dorlowski.dev`: dodaj wpis do `scripts/shots.config.json`
   (`slug: "sklep-craft-coffee"`, `url`), uruchom `npm run shots sklep-craft-coffee`.
3. Uzupełnij `liveUrl`/`githubUrl` w `cv-data.ts` i usuń `draft: true`.
