"use client";

import { useState } from "react";

import Magnetic from "@/components/motion/Magnetic";
import Button from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import Price from "@/components/ui/Price";
import QtyStepper from "@/components/ui/QtyStepper";
import type { Grind, Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

const GRIND_LABELS: Record<Grind, string> = {
  ziarna: "Całe ziarna",
  "mielona drobno": "Mielona drobno — espresso, kawiarka",
  "mielona grubo": "Mielona grubo — przelew, french press",
};

function weightLabel(weight: 250 | 1000): string {
  return weight === 1000 ? "1 kg" : "250 g";
}

interface ProductConfiguratorProps {
  product: Product;
}

/**
 * Client island of the product page: weight pills, grind select,
 * quantity stepper, live price and the add-to-cart CTA.
 * The cart drawer opens via useCart().add per the cart contract.
 */
export function ProductConfigurator({ product }: ProductConfiguratorProps) {
  const { add } = useCart();
  const [weight, setWeight] = useState<250 | 1000>(
    product.variants[0]?.weight ?? 250,
  );
  const [grind, setGrind] = useState<Grind>(product.grinds[0] ?? "ziarna");
  const [qty, setQty] = useState(1);

  const variant =
    product.variants.find((v) => v.weight === weight) ?? product.variants[0];
  const totalCents = (variant?.priceCents ?? 0) * qty;

  return (
    <div className="border-line border-t pt-7">
      {/* Weight pills */}
      <fieldset>
        <legend className="text-latte font-mono text-[11px] uppercase tracking-[0.2em]">
          Gramatura
        </legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {product.variants.map((v) => {
            const active = v.weight === weight;
            return (
              <button
                key={v.weight}
                type="button"
                aria-pressed={active}
                onClick={() => setWeight(v.weight)}
                className={`inline-flex h-11 items-center gap-3 rounded-full border px-5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 motion-reduce:transition-none ${
                  active
                    ? "border-gold bg-gold text-espresso"
                    : "border-line text-latte hover:border-gold hover:text-crema"
                }`}
              >
                {weightLabel(v.weight)}
                <span
                  className={`text-[10px] tabular-nums ${active ? "text-espresso" : "text-latte"}`}
                >
                  {formatPrice(v.priceCents)}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Grind */}
      <Select
        label="Mielenie"
        value={grind}
        onChange={(event) => setGrind(event.target.value as Grind)}
        className="mt-6"
      >
        {product.grinds.map((g) => (
          <option key={g} value={g}>
            {GRIND_LABELS[g]}
          </option>
        ))}
      </Select>
      {product.grinds.length === 1 && (
        <p className="text-latte mt-2 font-mono text-[11px] tracking-wide">
          Tę kawę sprzedajemy wyłącznie w ziarnach — zasługuje na świeże
          mielenie.
        </p>
      )}

      {/* Qty + live price */}
      <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-latte font-mono text-[11px] uppercase tracking-[0.2em]">
            Ilość
          </p>
          <QtyStepper
            className="mt-3"
            value={qty}
            onChange={setQty}
            label={product.name}
          />
        </div>
        <div className="text-right" aria-live="polite">
          {qty > 1 && (
            <p className="text-latte font-mono text-[11px] tracking-wide tabular-nums">
              {qty} × {formatPrice(variant?.priceCents ?? 0)}
            </p>
          )}
          <Price
            cents={totalCents}
            className="text-crema block text-4xl font-light"
          />
        </div>
      </div>

      {/* CTA */}
      <Magnetic strength={0.15} className="mt-8 w-full">
        <Button
          size="lg"
          className="w-full"
          onClick={() => add(product, { weight, grind }, qty)}
        >
          Dodaj do koszyka
        </Button>
      </Magnetic>
    </div>
  );
}

export default ProductConfigurator;
