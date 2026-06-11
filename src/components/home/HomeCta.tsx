import Magnetic from "@/components/motion/Magnetic";
import Parallax from "@/components/motion/Parallax";
import Reveal from "@/components/motion/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

/**
 * Section 6 — big closing CTA to /sklep with a slow parallax gold glow.
 * Server component.
 */
export function HomeCta() {
  return (
    <section className="border-line relative overflow-hidden border-t">
      {/* decorative parallax glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <Parallax speed={-0.6}>
          <div className="bg-gold/10 h-[34rem] w-[34rem] rounded-full blur-3xl" />
        </Parallax>
      </div>

      <Container className="relative z-10 py-28 text-center md:py-44">
        <Reveal y={20}>
          <p className="text-gold font-mono text-[11px] uppercase tracking-[0.2em] md:text-xs">
            04 — Do dzieła
          </p>
        </Reveal>

        <SplitHeading
          as="h2"
          delay={0.1}
          className="font-display text-crema mx-auto mt-6 max-w-4xl text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.98] font-light tracking-tight"
        >
          Twoja kawa już <em className="text-gold">czeka</em>
        </SplitHeading>

        <Reveal delay={0.25}>
          <p className="text-latte mx-auto mt-8 max-w-xl text-base leading-relaxed md:text-lg">
            Wybierz ziarna i sposób mielenia — my zajmiemy się resztą. Świeży
            wypał wyjedzie do Ciebie najpóźniej 48 godzin po paleniu.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <Button size="lg" href="/sklep">
                Przejdź do sklepu
              </Button>
            </Magnetic>
            <Button variant="ghost" size="lg" href="/o-nas">
              Poznaj palarnię
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default HomeCta;
