"use client";

import Link from "next/link";

import CartThumb from "@/components/checkout/CartThumb";
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  SHIPPING_COST_CENTS,
} from "@/components/checkout/shipping";
import Reveal from "@/components/motion/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Price from "@/components/ui/Price";
import QtyStepper from "@/components/ui/QtyStepper";
import useMounted from "@/components/checkout/useMounted";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

/**
 * Full cart view: items list with steppers + remove, suma with free-shipping
 * progress, CTA to /zamowienie. Empty state with CTA to /sklep.
 * Cart is hydration-safe (empty during SSR), so content renders after mount.
 */
export function CartView() {
  const { items, totalCents, count, setQty, remove } = useCart();
  const mounted = useMounted();

  const remainingCents = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - totalCents);
  const progress = Math.min(
    100,
    Math.round((totalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100),
  );

  if (!mounted) {
    return (
      <Container className="min-h-[60vh] pt-28 pb-24 md:pt-36">
        <span className="sr-only">Ładowanie koszyka…</span>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center pt-28 pb-24 text-center md:pt-36">
        <Reveal className="flex flex-col items-center gap-6">
          <p className="text-gold font-mono text-[11px] uppercase tracking-[0.2em]">
            Koszyk
          </p>
          <h1 className="font-display text-crema text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02] font-light tracking-tight [&_em]:text-gold [&_em]:italic">
            Twój koszyk jest <em>pusty</em>
          </h1>
          <p className="text-latte max-w-md text-base leading-relaxed">
            Wybierz coś z naszej palarni — świeży wypał już na Ciebie czeka.
          </p>
          <Button href="/sklep" size="lg" className="mt-2">
            Przejdź do sklepu
          </Button>
        </Reveal>
      </Container>
    );
  }

  return (
    <Container className="pt-28 pb-24 md:pt-36">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-gold mb-4 font-mono text-[11px] uppercase tracking-[0.2em]">
            krok 01 — koszyk
          </p>
          <SplitHeading
            as="h1"
            className="font-display text-crema text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02] font-light tracking-tight"
          >
            Twój <em>koszyk</em>
          </SplitHeading>
        </div>
        <p className="text-latte font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums">
          {count} szt.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-14">
        <Reveal>
          <ul className="border-line divide-line divide-y border-y">
            {items.map((item) => (
              <li key={item.key} className="flex items-start gap-5 py-6 sm:gap-6">
                <CartThumb item={item} className="h-28 w-20 p-2" />

                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    href={`/sklep/${item.slug}`}
                    className="font-display text-crema hover:text-gold w-fit text-xl font-light transition-colors duration-200 motion-reduce:transition-none"
                  >
                    {item.name}
                  </Link>
                  <p className="text-latte mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em]">
                    {item.weight} g · {item.grind}
                  </p>
                  <p className="text-latte mt-1 text-xs">
                    <Price cents={item.priceCents} className="text-crema" /> / szt.
                  </p>
                  <QtyStepper
                    size="sm"
                    value={item.qty}
                    onChange={(qty) => setQty(item.key, qty)}
                    label={item.name}
                    className="mt-3 w-fit"
                  />
                </div>

                <div className="flex flex-col items-end justify-between gap-4 self-stretch">
                  <button
                    type="button"
                    onClick={() => remove(item.key)}
                    aria-label={`Usuń ${item.name} z koszyka`}
                    className="border-line text-latte hover:border-ember hover:text-ember flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-200 motion-reduce:transition-none"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 12 12"
                      className="h-3 w-3"
                      stroke="currentColor"
                      strokeWidth="1.25"
                    >
                      <path d="M1 1 L11 11 M11 1 L1 11" />
                    </svg>
                  </button>
                  <Price
                    cents={item.priceCents * item.qty}
                    className="text-crema text-xl"
                  />
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="lg:sticky lg:top-28">
          <aside
            aria-label="Podsumowanie koszyka"
            className="border-line bg-roast rounded-2xl border p-6 md:p-8"
          >
            <h2 className="text-latte font-mono text-[11px] uppercase tracking-[0.2em]">
              Suma
            </h2>
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <span className="text-crema text-sm">Wartość koszyka</span>
              <Price cents={totalCents} className="text-crema text-3xl" />
            </div>

            <div className="border-line mt-6 border-t pt-6">
              <div
                role="progressbar"
                aria-label="Postęp do darmowej dostawy"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="bg-line h-1 overflow-hidden rounded-full"
              >
                <div
                  className="bg-gold h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-latte mt-3 text-xs leading-relaxed" aria-live="polite">
                {remainingCents > 0 ? (
                  <>
                    Dodaj kawy za{" "}
                    <span className="text-crema">{formatPrice(remainingCents)}</span>, by
                    mieć darmową dostawę
                  </>
                ) : (
                  <span className="text-gold">Masz darmową dostawę</span>
                )}
              </p>
            </div>

            <Button href="/zamowienie" size="lg" className="mt-8 w-full">
              Przejdź do zamówienia
            </Button>
            <p className="text-latte mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em]">
              Dostawa {formatPrice(SHIPPING_COST_CENTS)} · darmowa od{" "}
              {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS)}
            </p>
          </aside>
        </Reveal>
      </div>
    </Container>
  );
}

export default CartView;
