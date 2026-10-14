import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

import cupping from "@/assets/story/cupping.webp";
import roaster from "@/assets/story/roaster.webp";
import sacks from "@/assets/story/sacks.webp";

import Parallax from "@/components/motion/Parallax";
import Reveal from "@/components/motion/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "O nas",
  description:
    "Craft Coffee to rzemieślnicza palarnia z Krakowa. Od 2019 roku palimy kawę specialty w małych seriach: bezpośredni handel, świeży wypał, pełna kontrola.",
};

interface StorySection {
  eyebrow: string;
  title: ReactNode;
  paragraphs: string[];
  image: StaticImageData;
  alt: string;
  caption: string;
  parallaxSpeed: number;
}

const STORY: StorySection[] = [
  {
    eyebrow: "01 / Początek",
    title: (
      <>
        Pięć kilogramów i jeden <em>upór</em>
      </>
    ),
    paragraphs: [
      "Zaczynaliśmy w 2019 roku, w wynajętym kącie krakowskiej hali, z używanym piecem na pięć kilogramów i jedną obsesją: świeżością. Pierwsze wypały trafiały do zaprzyjaźnionych kawiarni, a notatki z każdej serii zapisywaliśmy ręcznie w zeszycie.",
      "Ten zeszyt mamy do dziś. Od tamtej pory zmieniło się prawie wszystko, poza przekonaniem, że dobra kawa nie znosi dróg na skróty.",
    ],
    image: roaster,
    alt: "Mały piec do palenia kawy z tacą pełną świeżo palonych ziaren w ceglanej hali, obok zeszyt na stole",
    caption: "Piec na pięć kilogramów",
    parallaxSpeed: 0.7,
  },
  {
    eyebrow: "02 / Pochodzenie",
    title: (
      <>
        Znamy ludzi za każdym <em>ziarnem</em>
      </>
    ),
    paragraphs: [
      "Kupujemy bezpośrednio od farmerów i małych kooperatyw: z Etiopii, Kolumbii, Kenii czy Peru. Płacimy powyżej cen giełdowych, bo stabilność po stronie farmy to lepsze ziarno po naszej.",
      "Każdą umowę traktujemy jak relację na lata, nie transakcję na sezon. Dzięki temu wiemy dokładnie, skąd pochodzi każdy worek, który wjeżdża do palarni, i możemy o nim opowiedzieć na opakowaniu.",
    ],
    image: sacks,
    alt: "Jutowe worki z zielonym, niepalonym ziarnem kawy i drewniana szufelka w otwartym worku",
    caption: "Zielone ziarno prosto od farm",
    parallaxSpeed: -0.7,
  },
  {
    eyebrow: "03 / Rzemiosło",
    title: (
      <>
        Małe serie, pełna <em>kontrola</em>
      </>
    ),
    paragraphs: [
      "Palimy w seriach po kilkanaście kilogramów, kilka razy w tygodniu, nigdy na zapas. Profil każdej kawy rozwijamy tygodniami i cuppingujemy każdą serię, zanim trafi do sprzedaży.",
      "Każda paczka opuszcza palarnię najpóźniej 48 godzin po wypale. Tę różnicę czuć w filiżance i właśnie dla niej to wszystko robimy.",
    ],
    image: cupping,
    alt: "Rząd porcelanowych czarek z mieloną kawą i łyżki do cuppingu na drewnianym stole",
    caption: "Cupping przed każdą wysyłką",
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
    text: "Przeprowadzka na Spokojną 12 i pierwszy własny piec: 25 kilogramów na wsad.",
  },
  {
    year: "2024",
    title: "Dziesięć kaw",
    text: "Stała oferta rośnie do dziesięciu kaw z trzech kontynentów, w tym dwóch autorskich mieszanek.",
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
    text: "Kupujemy ziarno wprost od farmerów i kooperatyw, płacąc uczciwie: powyżej cen giełdowych.",
  },
  {
    no: "03",
    title: "Rzemiosło",
    text: "Profil każdego wypału dopracowujemy ręcznie, a każdą serię cuppingujemy przed wysyłką.",
  },
];

function StoryTile({
  image,
  alt,
  caption,
  parallaxSpeed,
}: Pick<StorySection, "image" | "alt" | "caption" | "parallaxSpeed">) {
  return (
    <figure className="border-line bg-roast relative aspect-[4/5] overflow-hidden rounded-2xl border">
      {/* image is 120% tall so the parallax drift never shows an edge */}
      <Parallax speed={parallaxSpeed} className="absolute inset-x-0 -inset-y-[10%]">
        <Image
          src={image}
          alt={alt}
          placeholder="blur"
          sizes="(min-width: 768px) 46vw, 92vw"
          className="h-full w-full object-cover"
        />
      </Parallax>
      <figcaption className="text-crema bg-espresso/70 absolute bottom-6 left-6 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em]">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function ONasPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-24">
        <Container>
          <p className="text-gold mb-5 font-mono text-[11px] uppercase tracking-[0.2em]">
            Nasza historia / Kraków
          </p>
          <SplitHeading
            as="h1"
            className="font-display text-crema max-w-5xl text-[clamp(2.75rem,7vw,6rem)] leading-[0.98] font-light tracking-tight"
          >
            Palimy <em>kawę</em> od 2019 roku
          </SplitHeading>
          <Reveal delay={0.3} className="mt-8 max-w-2xl">
            <p className="text-latte text-base leading-relaxed md:text-lg">
              Craft Coffee to mała palarnia z Krakowa. Nie gonimy za skalą.
              Gonimy za profilem, który pozwala ziarnu opowiedzieć, skąd
              pochodzi.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Story sections: alternating layout */}
      {STORY.map((section, i) => (
        <section
          key={section.eyebrow}
          className="border-line border-t py-20 md:py-28"
        >
          <Container>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
              <Reveal className={i % 2 === 1 ? "md:order-2" : undefined}>
                <StoryTile
                  image={section.image}
                  alt={section.alt}
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
            eyebrow="04 / Oś czasu"
            title={
              <>
                Od pierwszego <em>wypału</em>
              </>
            }
            description="Siedem lat, jeden kierunek: coraz lepsze ziarno i coraz krótsza droga z palarni do Twojej filiżanki."
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
            eyebrow="05 / Wartości"
            title={
              <>
                W co <em>wierzymy</em>
              </>
            }
          />
          <ol className="border-line mt-14 border-b">
            {VALUES.map((value, i) => (
              <li key={value.no} className="border-line border-t">
                <Reveal delay={i * 0.08}>
                  <article className="grid gap-4 py-8 md:grid-cols-12 md:items-baseline md:gap-8 md:py-10">
                    <span className="text-gold font-mono text-[11px] tracking-[0.2em] md:col-span-1">
                      {value.no}
                    </span>
                    <h3 className="font-display text-crema text-3xl font-light tracking-tight md:col-span-4 md:text-5xl">
                      {value.title}
                    </h3>
                    <p className="text-latte max-w-xl text-base leading-relaxed md:col-span-7 md:text-lg">
                      {value.text}
                    </p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
