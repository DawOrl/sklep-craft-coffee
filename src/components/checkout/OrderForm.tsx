"use client";

import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import CartThumb from "@/components/checkout/CartThumb";
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  SHIPPING_COST_CENTS,
} from "@/components/checkout/shipping";
import Reveal from "@/components/motion/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { Input } from "@/components/ui/Field";
import Price from "@/components/ui/Price";
import useMounted from "@/components/checkout/useMounted";
import { useCart } from "@/lib/cart";
import { createOrder, type OrderData } from "@/lib/checkout";

const FIELD_KEYS = [
  "name",
  "email",
  "phone",
  "address",
  "postalCode",
  "city",
] as const;

type FieldKey = (typeof FIELD_KEYS)[number];
type FieldErrors = Partial<Record<FieldKey, string>>;
type FieldTouched = Partial<Record<FieldKey, boolean>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTAL_RE = /^\d{2}-\d{3}$/;

const EMPTY_VALUES: OrderData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
};

function validateField(key: FieldKey, raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return "To pole jest wymagane";
  if (key === "email" && !EMAIL_RE.test(value)) {
    return "Podaj poprawny adres e-mail";
  }
  if (key === "postalCode" && !POSTAL_RE.test(value)) {
    return "Podaj kod pocztowy w formacie XX-XXX";
  }
  return undefined;
}

/**
 * Two-column checkout: shipping form with inline Polish validation
 * (on submit + blur-after-touch) and an order summary with delivery cost.
 * Submits to the mock createOrder, clears the cart and redirects to success.
 */
export function OrderForm() {
  const router = useRouter();
  const { items, totalCents, clear } = useCart();

  const [values, setValues] = useState<OrderData>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<FieldTouched>({});
  const [submitting, setSubmitting] = useState(false);
  const mounted = useMounted();
  const completedRef = useRef(false);

  // Empty cart → back to /koszyk (after mount only; cart is empty during SSR).
  useEffect(() => {
    if (!mounted || completedRef.current) return;
    if (items.length === 0) router.replace("/koszyk");
  }, [mounted, items.length, router]);

  const freeShipping = totalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  const shippingCents = freeShipping ? 0 : SHIPPING_COST_CENTS;
  const grandTotalCents = totalCents + shippingCents;

  const handleChange =
    (key: FieldKey) => (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value;
      setValues((prev) => ({ ...prev, [key]: next }));
      // Live re-validation only once the field has been touched.
      if (touched[key]) {
        setErrors((prev) => ({ ...prev, [key]: validateField(key, next) }));
      }
    };

  const handleBlur = (key: FieldKey) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: validateField(key, values[key]) }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors: FieldErrors = {};
    for (const key of FIELD_KEYS) {
      const error = validateField(key, values[key]);
      if (error) nextErrors[key] = error;
    }
    setTouched(Object.fromEntries(FIELD_KEYS.map((key) => [key, true])));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const data = Object.fromEntries(
        FIELD_KEYS.map((key) => [key, values[key].trim()]),
      ) as unknown as OrderData;
      const { orderId } = await createOrder(data, items);
      completedRef.current = true;
      clear();
      router.push(`/zamowienie/sukces?nr=${orderId}`);
    } catch {
      setSubmitting(false);
    }
  }

  const fieldError = (key: FieldKey) => (touched[key] ? errors[key] : undefined);

  // Cart is empty during SSR — render the summary only after the client
  // snapshot loads, so totals are never shown from the empty server cart.
  if (!mounted) {
    return (
      <Container className="min-h-[60vh] pt-28 pb-24 md:pt-36">
        <span className="sr-only">Ładowanie zamówienia…</span>
      </Container>
    );
  }

  return (
    <Container className="pt-28 pb-24 md:pt-36">
      <div className="max-w-3xl">
        <p className="text-gold mb-4 font-mono text-[11px] uppercase tracking-[0.2em]">
          krok 02 — dane i dostawa
        </p>
        <SplitHeading
          as="h1"
          className="font-display text-crema text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02] font-light tracking-tight"
        >
          Zamówienie
        </SplitHeading>
        <p className="text-latte mt-5 text-base leading-relaxed md:text-lg">
          Uzupełnij dane do wysyłki — Twoja kawa trafi do palenia zaraz po
          złożeniu zamówienia.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start lg:gap-14"
      >
        <Reveal>
          <fieldset
            disabled={submitting}
            className="grid gap-6 sm:grid-cols-2"
            aria-label="Dane do wysyłki"
          >
            <Input
              label="Imię i nazwisko"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={handleChange("name")}
              onBlur={handleBlur("name")}
              error={fieldError("name")}
              className="sm:col-span-2"
            />
            <Input
              label="E-mail"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              error={fieldError("email")}
            />
            <Input
              label="Telefon"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={values.phone}
              onChange={handleChange("phone")}
              onBlur={handleBlur("phone")}
              error={fieldError("phone")}
            />
            <Input
              label="Ulica i numer"
              name="address"
              autoComplete="street-address"
              value={values.address}
              onChange={handleChange("address")}
              onBlur={handleBlur("address")}
              error={fieldError("address")}
              className="sm:col-span-2"
            />
            <Input
              label="Kod pocztowy"
              name="postalCode"
              autoComplete="postal-code"
              placeholder="00-000"
              value={values.postalCode}
              onChange={handleChange("postalCode")}
              onBlur={handleBlur("postalCode")}
              error={fieldError("postalCode")}
            />
            <Input
              label="Miasto"
              name="city"
              autoComplete="address-level2"
              value={values.city}
              onChange={handleChange("city")}
              onBlur={handleBlur("city")}
              error={fieldError("city")}
            />
          </fieldset>
        </Reveal>

        <Reveal delay={0.1} className="lg:sticky lg:top-28">
          <aside
            aria-label="Podsumowanie zamówienia"
            className="border-line bg-roast rounded-2xl border p-6 md:p-8"
          >
            <h2 className="text-latte font-mono text-[11px] uppercase tracking-[0.2em]">
              Podsumowanie
            </h2>

            <ul className="divide-line mt-2 divide-y">
              {items.map((item) => (
                <li key={item.key} className="flex items-center gap-4 py-4">
                  <CartThumb item={item} className="h-16 w-12 p-1.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-crema truncate text-sm">{item.name}</p>
                    <p className="text-latte mt-1 font-mono text-[10px] uppercase tracking-[0.2em]">
                      {item.weight} g · {item.grind} · ×{item.qty}
                    </p>
                  </div>
                  <Price
                    cents={item.priceCents * item.qty}
                    className="text-crema text-base"
                  />
                </li>
              ))}
            </ul>

            <dl className="border-line space-y-3 border-t pt-5 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-latte">Suma</dt>
                <dd>
                  <Price cents={totalCents} className="text-crema" />
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-latte">Dostawa</dt>
                <dd>
                  {freeShipping ? (
                    <span className="text-gold font-mono text-[11px] uppercase tracking-[0.2em]">
                      darmowa
                    </span>
                  ) : (
                    <Price cents={SHIPPING_COST_CENTS} className="text-crema" />
                  )}
                </dd>
              </div>
              <div className="border-line flex items-baseline justify-between gap-4 border-t pt-4">
                <dt className="text-crema">Razem</dt>
                <dd>
                  <Price cents={grandTotalCents} className="text-crema text-2xl" />
                </dd>
              </div>
            </dl>

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              aria-busy={submitting}
              className="mt-7 w-full"
            >
              {submitting ? "Przetwarzanie…" : "Złóż zamówienie"}
            </Button>
            <p className="text-latte mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em]">
              Płatności Stripe — wkrótce. To zamówienie testowe.
            </p>
          </aside>
        </Reveal>
      </form>
    </Container>
  );
}

export default OrderForm;
