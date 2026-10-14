import Counter from "@/components/motion/Counter";
import Reveal from "@/components/motion/Reveal";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { products } from "@/data/products";

// Średnia z ocen w katalogu (zaokrąglona do 0,1), żeby liczba zgadzała się ze sklepem.
const AVERAGE_RATING =
  Math.round((products.reduce((sum, p) => sum + p.rating, 0) / products.length) * 10) / 10;

interface Stat {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const STATS: Stat[] = [
  {
    value: 48,
    suffix: "h",
    label: "Od wypału do wysyłki",
    description:
      "Pakujemy zaraz po odgazowaniu, więc kawa dociera do Ciebie w szczycie formy.",
  },
  {
    value: products.length,
    suffix: "",
    label: "Kaw w ofercie",
    description:
      "Single origin z trzech kontynentów, dwie autorskie mieszanki i wypały sezonowe.",
  },
  {
    value: 100,
    suffix: "%",
    label: "Arabica",
    description:
      "Wyłącznie ziarna specialty z małych farm i kooperatyw. Bez kompromisów.",
  },
  {
    value: AVERAGE_RATING,
    suffix: "",
    label: "Średnia ocena kaw",
    description:
      "Średnia z ocen wszystkich kaw w sklepie. Opinie trzymają nas przy rzemiośle.",
  },
];

/**
 * Section 5 - wyróżniki + count-up counters (mono, on viewport enter).
 * Server component; Counter handles the animation client-side.
 */
export function Highlights() {
  const [lead, ...rest] = STATS;
  return (
    <section className="py-24 md:py-36">
      <Container>
        {/* 48 h is the promise the whole roastery is built around, so it gets
            the stage; the other three facts support it in a quieter row. */}
        <div className="grid gap-14 lg:grid-cols-12 lg:items-end lg:gap-10">
          <SectionHeading
            className="lg:col-span-6"
            eyebrow="03 / W liczbach"
            title={
              <>
                Rzemiosło widać <em>w liczbach</em>
              </>
            }
            description="Nie ścigamy się na ilość. Liczy się świeżość, powtarzalność wypału i to, co zostaje w filiżance."
          />
          <Reveal className="border-line border-t pt-8 lg:col-span-5 lg:col-start-8">
            <p className="text-gold">
              <Counter
                to={lead.value}
                suffix={lead.suffix}
                className="text-[clamp(5.5rem,13vw,11rem)] leading-[0.85] font-light tracking-tight"
              />
            </p>
            <h3 className="text-crema mt-6 font-mono text-[11px] font-normal uppercase tracking-[0.2em]">
              {lead.label}
            </h3>
            <p className="text-latte mt-3 max-w-sm text-base leading-relaxed">
              {lead.description}
            </p>
          </Reveal>
        </div>

        <ul className="mt-20 grid list-none gap-x-10 gap-y-12 sm:grid-cols-3 md:mt-28">
          {rest.map((stat, index) => (
            <li key={stat.label}>
              <Reveal delay={index * 0.08} className="border-line border-t pt-8">
                <p className="text-crema">
                  <Counter
                    to={stat.value}
                    suffix={stat.suffix}
                    className="text-[clamp(2.5rem,4.4vw,3.75rem)] leading-none font-light"
                  />
                </p>
                <h3 className="text-gold mt-5 font-mono text-[11px] font-normal uppercase tracking-[0.2em]">
                  {stat.label}
                </h3>
                <p className="text-latte mt-3 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default Highlights;
