import type { Metadata } from "next";

import Magnetic from "@/components/motion/Magnetic";
import Reveal from "@/components/motion/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "404 — nie znaleziono",
  description: "Strona, której szukasz, nie istnieje.",
};

export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 pt-36 pb-24 text-center md:pt-40">
      <p className="text-gold font-mono text-[11px] tracking-[0.2em]">404</p>
      <SplitHeading
        as="h1"
        className="font-display text-crema mt-6 max-w-3xl text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.98] font-light tracking-tight"
      >
        Ta kawa się <em>wylała</em>
      </SplitHeading>
      <Reveal delay={0.3} className="mt-7">
        <p className="text-latte mx-auto max-w-md text-base leading-relaxed md:text-lg">
          Strona, której szukasz, nie istnieje.
        </p>
      </Reveal>
      <Reveal delay={0.45} className="mt-10">
        <Magnetic>
          <Button href="/" size="lg">
            → Strona główna
          </Button>
        </Magnetic>
      </Reveal>
    </section>
  );
}
