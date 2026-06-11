import type { Metadata } from "next";

import Reveal from "@/components/motion/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import Container from "@/components/ui/Container";

import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Skontaktuj się z palarnią Craft Coffee — ul. Spokojna 12, 30-001 Kraków. Piszemy i odbieramy od poniedziałku do piątku, 8:00–16:00.",
};

const ROASTERY_ROWS: { label: string; value: string; href?: string }[] = [
  { label: "Palarnia", value: "Craft Coffee" },
  { label: "Adres", value: "ul. Spokojna 12, 30-001 Kraków" },
  { label: "Godziny", value: "pon–pt 8:00–16:00" },
  {
    label: "E-mail",
    value: "hello@craftcoffee.pl",
    href: "mailto:hello@craftcoffee.pl",
  },
];

const HOURS: { days: string; hours: string }[] = [
  { days: "Poniedziałek — piątek", hours: "8:00 — 16:00" },
  { days: "Sobota", hours: "10:00 — 14:00" },
  { days: "Niedziela", hours: "zamknięte" },
];

export default function KontaktPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-20">
        <Container>
          <p className="text-gold mb-5 font-mono text-[11px] uppercase tracking-[0.2em]">
            Kontakt — Kraków
          </p>
          <SplitHeading
            as="h1"
            className="font-display text-crema max-w-4xl text-[clamp(2.75rem,7vw,6rem)] leading-[0.98] font-light tracking-tight"
          >
            Porozmawiajmy o <em>kawie</em>
          </SplitHeading>
          <Reveal delay={0.3} className="mt-8 max-w-2xl">
            <p className="text-latte text-base leading-relaxed md:text-lg">
              Pytanie o ziarno, współpraca dla kawiarni, a może po prostu chcesz
              zajrzeć do palarni? Napisz — odpowiadamy w 24 godziny.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Form + roastery details */}
      <section className="border-line border-t py-20 md:py-28">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Mock form */}
            <div>
              <p className="text-gold font-mono text-[11px] uppercase tracking-[0.2em]">
                01 — Formularz
              </p>
              <h2 className="font-display text-crema mt-4 text-2xl font-light md:text-3xl">
                Napisz do nas
              </h2>
              <Reveal className="mt-8">
                <ContactForm />
              </Reveal>
            </div>

            {/* Roastery data */}
            <div>
              <p className="text-gold font-mono text-[11px] uppercase tracking-[0.2em]">
                02 — Palarnia
              </p>
              <h2 className="font-display text-crema mt-4 text-2xl font-light md:text-3xl">
                Gdzie nas znajdziesz
              </h2>

              <Reveal className="mt-8">
                <div className="border-line bg-roast overflow-hidden rounded-2xl border">
                  <table className="w-full border-collapse text-left font-mono text-xs md:text-sm">
                    <caption className="sr-only">Dane palarni</caption>
                    <tbody>
                      {ROASTERY_ROWS.map((row) => (
                        <tr
                          key={row.label}
                          className="border-line border-b last:border-b-0"
                        >
                          <th
                            scope="row"
                            className="text-latte w-32 px-5 py-4 align-top text-[10px] font-normal uppercase tracking-[0.2em] md:w-40 md:px-7 md:text-[11px]"
                          >
                            {row.label}
                          </th>
                          <td className="text-crema px-5 py-4 md:px-7">
                            {row.href ? (
                              <a
                                href={row.href}
                                className="text-gold hover:text-gold-soft underline underline-offset-4 transition-colors duration-200 motion-reduce:transition-none"
                              >
                                {row.value}
                              </a>
                            ) : (
                              row.value
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>

              <Reveal delay={0.1} className="mt-10">
                <h3 className="text-latte font-mono text-[11px] uppercase tracking-[0.2em]">
                  Odbiór osobisty — godziny
                </h3>
                <dl className="border-line mt-5 border-t">
                  {HOURS.map((row) => (
                    <div
                      key={row.days}
                      className="border-line flex items-baseline justify-between gap-6 border-b py-4"
                    >
                      <dt className="text-crema text-sm">{row.days}</dt>
                      <dd className="text-latte font-mono text-xs tracking-[0.1em] tabular-nums md:text-sm">
                        {row.hours}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="text-latte mt-6 text-sm leading-relaxed">
                  Kawę zamówioną online odbierzesz w palarni bez kosztów
                  dostawy — daj nam tylko znać w wiadomości, kiedy wpadniesz.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
