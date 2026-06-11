import Counter from "@/components/motion/Counter";
import Reveal from "@/components/motion/Reveal";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

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
    value: 12,
    suffix: "",
    label: "Odmian w ofercie",
    description:
      "Single origin z trzech kontynentów, dwie autorskie mieszanki i wypały sezonowe.",
  },
  {
    value: 100,
    suffix: "%",
    label: "Arabica",
    description:
      "Wyłącznie ziarna specialty z małych farm i kooperatyw — bez kompromisów.",
  },
  {
    value: 4.9,
    suffix: "",
    label: "Średnia ocena",
    description:
      "Tysiące zaparzonych filiżanek i opinie, które trzymają nas przy rzemiośle.",
  },
];

/**
 * Section 5 — wyróżniki + count-up counters (mono, on viewport enter).
 * Server component; Counter handles the animation client-side.
 */
export function Highlights() {
  return (
    <section className="py-24 md:py-36">
      <Container>
        <SectionHeading
          eyebrow="03 — W liczbach"
          title={
            <>
              Rzemiosło widać <em>w liczbach</em>
            </>
          }
          description="Nie ścigamy się na ilość. Liczy się świeżość, powtarzalność wypału i to, co zostaje w filiżance."
        />

        <ul className="mt-16 grid list-none gap-x-10 gap-y-14 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <li key={stat.label}>
              <Reveal delay={index * 0.08} className="border-line border-t pt-8">
                <p className="text-crema">
                  <Counter
                    to={stat.value}
                    suffix={stat.suffix}
                    className="text-[clamp(2.75rem,5vw,4.25rem)] leading-none font-light"
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
