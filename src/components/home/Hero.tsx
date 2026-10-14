import HeroCanvas from "@/components/home/HeroCanvas";
import Magnetic from "@/components/motion/Magnetic";
import Reveal from "@/components/motion/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

/**
 * Section 1 - full-viewport hero with the 3D bean field in the background,
 * split serif headline and a magnetic CTA. Server component; all motion
 * lives in the imported client primitives.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col justify-center overflow-hidden">
      {/* warm halo behind the bean field - lifts the beans off the dark bg */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 58% 48% at 72% 40%, rgba(201, 154, 95, 0.16), transparent 68%)",
        }}
      />
      {/* 3D background (client-only chunk) */}
      <HeroCanvas className="absolute inset-0" />
      {/* readability: darken only the left (text) side, keep the beans clear */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-espresso/85 via-espresso/25 to-transparent"
      />
      {/* fade into the next section */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-espresso to-transparent"
      />

      <Container className="relative z-10 pt-28 pb-32 md:pt-32">
        <Reveal y={20}>
          <p className="text-gold font-mono text-[11px] uppercase tracking-[0.2em] md:text-xs">
            Palarnia rzemieślnicza / od 2019
          </p>
        </Reveal>

        <SplitHeading
          as="h1"
          delay={0.1}
          className="font-display text-crema mt-6 max-w-5xl text-[clamp(3rem,9vw,8.25rem)] leading-[0.95] font-light tracking-tight"
        >
          Kawa, która ma <em className="text-gold">charakter</em>
        </SplitHeading>

        <Reveal delay={0.3}>
          <p className="text-latte mt-8 max-w-xl text-base leading-relaxed md:text-lg">
            Ziarna specialty z małych farm, palone u nas w seriach po
            kilkanaście kilogramów. Od wypału do wysyłki mija najwyżej 48
            godzin. Resztę poczujesz w filiżance.
          </p>
        </Reveal>

        <Reveal delay={0.45}>
          <div className="mt-10">
            <Magnetic>
              <Button size="lg" href="/sklep">
                Odkryj nasze kawy
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </Container>

      {/* scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span className="text-latte font-mono text-[10px] uppercase tracking-[0.2em]">
          Przewiń
        </span>
        <span className="from-gold block h-12 w-px bg-gradient-to-b to-transparent motion-safe:animate-pulse" />
      </div>
    </section>
  );
}

export default Hero;
