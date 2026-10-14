"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/components/checkout/shipping";
import { getLenis } from "@/components/motion/SmoothScroll";
import Button from "@/components/ui/Button";
import Price from "@/components/ui/Price";
import QtyStepper from "@/components/ui/QtyStepper";
import CartThumb from "@/components/checkout/CartThumb";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

const FOCUSABLE =
  "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

/**
 * Right slide-over cart (z-40): focus trap, Esc closes, body scroll lock,
 * backdrop. Opens automatically after add-to-cart (via cart context).
 */
export function CartDrawer() {
  const { items, totalCents, count, isDrawerOpen, closeDrawer, setQty, remove } =
    useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const remainingCents = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - totalCents);
  const freeShippingProgress = Math.min(
    100,
    Math.round((totalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100),
  );
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isDrawerOpen) return;

    lastFocused.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    // overflow:hidden alone does not stop Lenis (it scrolls programmatically),
    // so pause the instance while the modal layer is open.
    const lenis = getLenis();
    lenis?.stop();

    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);

    // Initial focus after the slide-in starts.
    const raf = requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
        return;
      }
      if (e.key !== "Tab") return;

      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = !!active && !!panel?.contains(active);

      if (e.shiftKey) {
        if (!inside || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (!inside || active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      lenis?.start();
      lastFocused.current?.focus();
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <div
      aria-hidden={!isDrawerOpen}
      className={`fixed inset-0 z-40 ${isDrawerOpen ? "" : "pointer-events-none"}`}
    >
      {/* backdrop */}
      <div
        aria-hidden="true"
        onClick={closeDrawer}
        className={`bg-espresso/60 absolute inset-0 backdrop-blur-sm transition-opacity duration-500 motion-reduce:transition-none ${
          isDrawerOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Koszyk"
        className={`border-line bg-roast absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l shadow-2xl transition-[transform,visibility] duration-500 ease-out motion-reduce:transition-none ${
          isDrawerOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="border-line flex items-center justify-between border-b px-6 py-5">
          <h2 className="font-display text-crema text-2xl font-light">
            Koszyk{" "}
            <span className="text-latte font-mono text-xs tabular-nums">
              ({count})
            </span>
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Zamknij koszyk"
            className="border-line text-latte hover:border-gold hover:text-gold flex h-9 w-9 pointer-coarse:h-11 pointer-coarse:w-11 items-center justify-center rounded-full border transition-colors duration-200 motion-reduce:transition-none"
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
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <p className="font-display text-crema text-2xl font-light">
              Twój koszyk jest pusty
            </p>
            <p className="text-latte text-sm leading-relaxed">
              Wybierz coś z naszej palarni. Świeży wypał już czeka.
            </p>
            <Button href="/sklep" variant="outline" onClick={closeDrawer}>
              Przejdź do sklepu
            </Button>
          </div>
        ) : (
          <>
            <ul
              data-lenis-prevent
              className="divide-line flex-1 divide-y overflow-y-auto px-6"
            >
              {items.map((item) => {
                return (
                  <li key={item.key} className="flex gap-4 py-5">
                    <CartThumb item={item} className="h-24 w-[4.8rem] rounded-lg" />

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/sklep/${item.slug}`}
                          onClick={closeDrawer}
                          className="text-crema hover:text-gold truncate text-sm transition-colors duration-200 motion-reduce:transition-none"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(item.key)}
                          aria-label={`Usuń ${item.name} z koszyka`}
                          className="text-latte hover:text-ember -my-2 py-2 font-mono text-[10px] uppercase tracking-[0.2em] pointer-coarse:-my-3 pointer-coarse:py-3 transition-colors duration-200 motion-reduce:transition-none"
                        >
                          Usuń
                        </button>
                      </div>
                      <p className="text-latte mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em]">
                        {item.weight} g · {item.grind}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <QtyStepper
                          size="sm"
                          value={item.qty}
                          onChange={(qty) => setQty(item.key, qty)}
                          label={item.name}
                        />
                        <Price
                          cents={item.priceCents * item.qty}
                          className="text-crema text-lg"
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-line space-y-4 border-t px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-latte font-mono text-[11px] uppercase tracking-[0.2em]">
                  Suma
                </span>
                <Price cents={totalCents} className="text-crema text-2xl" />
              </div>
              <div>
                <div
                  role="progressbar"
                  aria-label="Postęp do darmowej dostawy"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={freeShippingProgress}
                  className="bg-line h-1 overflow-hidden rounded-full"
                >
                  <div
                    className="bg-gold h-full origin-left rounded-full transition-transform duration-500 ease-out motion-reduce:transition-none"
                    style={{ transform: `scaleX(${freeShippingProgress / 100})` }}
                  />
                </div>
                <p className="text-latte mt-2.5 text-xs" aria-live="polite">
                  {remainingCents > 0 ? (
                    <>
                      Brakuje <span className="text-crema">{formatPrice(remainingCents)}</span> do
                      darmowej dostawy
                    </>
                  ) : (
                    <span className="text-gold">Masz darmową dostawę</span>
                  )}
                </p>
              </div>
              <Button href="/zamowienie" onClick={closeDrawer} className="w-full">
                Przejdź do zamówienia
              </Button>
              <Button href="/koszyk" variant="outline" onClick={closeDrawer} className="w-full">
                Zobacz koszyk
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
