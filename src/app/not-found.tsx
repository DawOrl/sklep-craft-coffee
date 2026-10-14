import type { Metadata } from "next";
import Image from "next/image";

import beansSpill from "@/assets/render/beans-spill.webp";
import Magnetic from "@/components/motion/Magnetic";
import Reveal from "@/components/motion/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Nie znaleziono strony",
  description: "Strona, której szukasz, nie istnieje.",
};

export default function NotFound() {
  return (
    <section className="relative flex flex-1 flex-col items-center overflow-hidden pt-36 text-center md:pt-40">
      <p className="text-gold relative px-6 font-mono text-[11px] tracking-[0.2em]">BŁĄD 404</p>
      <SplitHeading
        as="h1"
        className="font-display text-crema relative mt-6 max-w-3xl px-6 text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.98] font-light tracking-tight"
      >
        Ta kawa się <em>wylała</em>
      </SplitHeading>
      <Reveal delay={0.3} className="relative mt-7 px-6">
        <p className="text-latte mx-auto max-w-md text-base leading-relaxed md:text-lg">
          Strona, której szukasz, nie istnieje albo zmieniła adres. Ziarna
          pozbieramy, a Ty wróć do sklepu.
        </p>
      </Reveal>
      <Reveal delay={0.45} className="relative z-10 mt-10 px-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Magnetic>
            <Button href="/sklep" size="lg">
              Przejdź do sklepu
            </Button>
          </Magnetic>
          <Button href="/" variant="ghost" size="lg">
            Strona główna
          </Button>
        </div>
      </Reveal>

      {/* rozsypane ziarna: render z Blendera, ten sam co na stronie głównej */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative -mt-6 h-[clamp(15rem,36vw,32rem)] w-full"
      >
        <Image
          src={beansSpill}
          alt=""
          sizes="100vw"
          placeholder="blur"
          className="h-full w-full object-cover object-[50%_62%]"
        />
        <div className="from-espresso absolute inset-0 bg-gradient-to-b via-espresso/20 to-transparent" />
        <div className="from-espresso absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent" />
      </div>
    </section>
  );
}
