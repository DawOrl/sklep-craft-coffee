import type { Metadata } from "next";
import { Suspense } from "react";

import OrderNumber from "@/components/checkout/OrderNumber";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Zamówienie przyjęte",
  description:
    "Dziękujemy za zamówienie — Twoja kawa trafia do palenia i wyruszy do Ciebie w 48 godzin.",
};

const STEPS = [
  {
    nr: "01",
    title: "Potwierdzenie e-mail",
    copy: "Na Twój adres wysłaliśmy potwierdzenie z pełnym podsumowaniem zamówienia.",
  },
  {
    nr: "02",
    title: "Palenie i pakowanie",
    copy: "Twoją kawę palimy w małej serii i pakujemy ręcznie w naszej palarni.",
  },
  {
    nr: "03",
    title: "Wysyłka w 48 h",
    copy: "Paczka opuszcza palarnię najpóźniej 48 godzin od wypału — numer śledzenia dostaniesz e-mailem.",
  },
] as const;

export default function OrderSuccessPage() {
  return (
    <Container className="pt-28 pb-24 md:pt-36">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <SectionHeading
          as="h1"
          align="center"
          eyebrow="zamówienie przyjęte"
          title="Dziękujemy"
          description="Twoje zamówienie właśnie trafiło do palarni. Zajmiemy się nim od razu."
        />
        <Suspense
          fallback={
            <p
              aria-hidden="true"
              className="font-mono text-[11px] uppercase tracking-[0.2em]"
            >
              &nbsp;
            </p>
          }
        >
          <OrderNumber />
        </Suspense>
      </div>

      <section
        aria-labelledby="co-dalej"
        className="mx-auto mt-16 max-w-4xl md:mt-20"
      >
        <h2
          id="co-dalej"
          className="text-gold text-center font-mono text-[11px] uppercase tracking-[0.2em]"
        >
          Co dalej
        </h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.nr} className="h-full">
              <Reveal delay={index * 0.08} className="h-full">
                <article className="border-line bg-roast h-full rounded-2xl border p-6">
                  <p className="text-gold font-mono text-[11px] uppercase tracking-[0.2em]">
                    {step.nr}
                  </p>
                  <h3 className="font-display text-crema mt-4 text-xl font-light">
                    {step.title}
                  </h3>
                  <p className="text-latte mt-2 text-sm leading-relaxed">
                    {step.copy}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-14 flex justify-center">
        <Button href="/sklep" size="lg">
          Wróć do sklepu
        </Button>
      </div>
    </Container>
  );
}
