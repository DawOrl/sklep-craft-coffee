import type { Metadata } from "next";
import type { ReactNode } from "react";

import Parallax from "@/components/motion/Parallax";
import Reveal from "@/components/motion/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "O nas",
  description:
    "Craft Coffee to rzemieślnicza palarnia z Krakowa. Od 2019 roku palimy kawę specialty w małych seriach — bezpośredni handel, świeży wypał, pełna kontrola.",
};

interface StorySection {
  eyebrow: string;
  title: ReactNode;
  paragraphs: string[];
  glyph: string;
  caption: string;
  parallaxSpeed: number;
}

const STORY: StorySection[] = [
  {
    eyebrow: "01 — Początek",
    title: (
      <>
        Pięć kilogramów i jeden <em>upór</em>
      </>
    ),
    paragraphs: [
      "Zaczynaliśmy w 2019 roku, w wynajętym kącie krakowskiej hali — z używanym piecem na pięć kilogramów i jedną obsesją: świeżością. Pierwsze wypały trafiały do zaprzyjaźnionych kawiarni, a notatki z każdej serii zapisywaliśmy ręcznie w zeszycie.",
      "Ten zeszyt mamy do dziś. Od tamtej pory zmieniło się prawie wszystko — poza przekonaniem, że dobra kawa nie znosi dróg na skróty.",
    ],
    glyph: "&",
    caption: "Ziarno & ogień",
    parallaxSpeed: 0.7,
  },
  {
    eyebrow: "02 — Pochodzenie",
    title: (
      <>
        Znamy ludzi za każdym <em>ziarnem</em>
      </>
    ),
    paragraphs: [
      "Kupujemy bezpośrednio od farmerów i małych kooperatyw — z Etiopii, Kolumbii, Kenii czy Peru. Płacimy powyżej cen giełdowych, bo stabilność po stronie farmy to lepsze ziarno po naszej.",
      "Każdą umowę traktujemy jak relację na lata, nie transakcję na sezon. Dzięki temu wiemy dokładnie, skąd pochodzi każdy worek, który wjeżdża do palarni — i możemy o nim opowiedzieć na opakowaniu.",
    ],
    glyph: "12",
    caption: "Odmian w stałej ofercie",
    parallaxSpeed: -0.7,
  },
  {
    eyebrow: "03 — Rzemiosło",
    title: (
      <>
        Małe serie, pełna <em>kontrola</em>
      </>
    ),
    paragraphs: [
      "Palimy w seriach po kilkanaście kilogramów, kilka razy w tygodniu — nigdy na zapas. Profil każdej kawy rozwijamy tygodniami i cuppingujemy każdą serię, zanim trafi do sprzedaży.",
      "Każda paczka opuszcza palarnię najpóźniej 48 godzin po wypale. Tę różnicę czuć w filiżance — i właśnie dla niej to wszystko robimy.",
    ],
    glyph: "48",
    caption: "Godzin od wypału do wysyłki",
    parallaxSpeed: 0.7,
  },
];

const TIMELINE: { year: string; title: string; text: string }[] = [
  {
    year: "2019",
    title: "Pierwsza palarnia",
    text: "Wynajęty kąt hali na krakowskim Zabłociu i używany piec na pięć kilogramów.",
  },
  {
    year: "2021",
    title: "Własny piec",
    text: "Przeprowadzka na Spokojną 12 i pierwszy własny piec — 25 kilogramów na wsad.",
  },
  {
    year: "2024",
    title: "12 odmian",
    text: "Stała oferta rośnie do dwunastu kaw z trzech kontynentów — w tym dwóch autorskich mieszanek.",
  },
  {
    year: "2026",
    title: "Sklep online",
    text: "Otwieramy sklep internetowy. Świeży wypał zamówisz prosto z palarni, do domu.",
  },
];

const VALUES: { no: string; title: string; text: string }[] = [
  {
    no: "01",
    title: "Świeżość",
    text: "Palimy na bieżąco i wysyłamy w 48 godzin od wypału. Datę palenia znajdziesz na każdym opakowaniu.",
  },
  {
    no: "02",
    title: "Bezpośredni handel",
    text: "Kupujemy ziarno wprost od farmerów i kooperatyw, płacąc uczciwie — powyżej cen giełdowych.",
  },
  {
    no: "03",
    title: "Rzemiosło",
    text: "Profil każdego wypału dopracowujemy ręcznie, a każdą serię cuppingujemy przed wysyłką.",
  },
];

function StoryTile({
  glyph,
  caption,
  parallaxSpeed,
}: Pick<StorySection, "glyph" | "caption" | "parallaxSpeed">) {
  return (
    <div className="border-line bg-roast relative aspect-[4/5] overflow-hidden rounded-2xl border">
      <Parallax
        speed={parallaxSpeed}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span
          aria-hidden="true"
          className="font-display text-gold/15 text-[clamp(9rem,22vw,17rem)] leading-none font-light italic select-none"
        >
          {glyph}
        </span>
      </Parallax>
      <span className="text-latte border-line bg-espresso/60 absolute bottom-6 left-6 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] backdrop-blur">
        {caption}
      </span>
    </div>
  );
}

export default function ONasPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-24">
        <Container>
          <p className="text-gold mb-5 font-mono text-[11px] uppercase tracking-[0.2em]">
            Nasza historia — Kraków
          </p>
          <SplitHeading
            as="h1"
            className="font-display text-crema max-w-5xl text-[clamp(2.75rem,7vw,6rem)] leading-[0.98] font-light tracking-tight"
          >
            Palimy <em>kawę</em> od 2019 roku
          </SplitHeading>
          <Reveal delay={0.3} className="mt-8 max-w-2xl">
            <p className="text-latte text-base leading-relaxed md:text-lg">
              Craft Coffee to mała palarnia z Krakowa. Nie gonimy za skalą —
              gonimy za profilem, który pozwala ziarnu opowiedzieć, skąd
              pochodzi.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Story sections — alternating layout */}
      {STORY.map((section, i) => (
        <section
          key={section.eyebrow}
          className="border-line border-t py-20 md:py-28"
        >
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
              <Reveal className={i % 2 === 1 ? "md:order-2" : undefined}>
                <StoryTile
                  glyph={section.glyph}
                  caption={section.caption}
                  parallaxSpeed={section.parallaxSpeed}
                />
              </Reveal>
              <div className={i % 2 === 1 ? "md:order-1" : undefined}>
                <SectionHeading
                  eyebrow={section.eyebrow.toUpperCase()}
                  title={section.title}
                />
                <div className="mt-6 max-w-xl space-y-5">
                  {section.paragraphs.map((paragraph) => (
                    <Reveal key={paragraph.slice(0, 24)} delay={0.1}>
                      <p className="text-latte text-base leading-relaxed md:text-lg">
                        {paragraph}
                      </p>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>
      ))}

      {/* Timeline 2019 → 2026 */}
      <section className="border-line border-t py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="04 — OŚ CZASU"
            title={
              <>
                Od pierwszego <em>wypału</em>
              </>
            }
            description="Siedem lat, jeden kierunek — coraz lepsze ziarno i coraz krótsza droga z palarni do Twojej filiżanki."
          />
          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {TIMELINE.map((item, i) => (
              <li key={item.year}>
                <Reveal delay={i * 0.08} className="h-full">
                  <div className="border-line flex h-full flex-col border-t pt-6">
                    <span className="text-gold font-mono text-sm tracking-[0.2em]">
                      {item.year}
                    </span>
                    <h3 className="font-display text-crema mt-4 text-xl font-light md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="text-latte mt-3 text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Values */}
      <section className="border-line border-t py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="05 — WARTOŚCI"
            title={
              <>
                W co <em>wierzymy</em>
              </>
            }
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {VALUES.map((value, i) => (
              <Reveal key={value.no} delay={i * 0.08} className="h-full">
                <article className="border-line bg-roast hover:bg-roast-2 flex h-full flex-col rounded-2xl border p-8 transition-colors duration-300 motion-reduce:transition-none md:p-10">
                  <span className="text-gold font-mono text-[11px] tracking-[0.2em]">
                    {value.no}
                  </span>
                  <h3 className="font-display text-crema mt-6 text-2xl font-light md:text-3xl">
                    {value.title}
                  </h3>
                  <p className="text-latte mt-4 text-sm leading-relaxed md:text-base">
                    {value.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
