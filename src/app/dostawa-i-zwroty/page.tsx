import type { Metadata } from "next";

import Reveal from "@/components/motion/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

import Faq, { type FaqItem } from "./Faq";

export const metadata: Metadata = {
  title: "Dostawa i zwroty",
  description:
    "Wysyłka świeżo palonej kawy w 48 godzin od wypału. InPost Paczkomat 12,99 zł, kurier DPD 16,99 zł, darmowa dostawa od 149 zł. Zwroty do 14 dni.",
};

const SHIPPING_ROWS: { method: string; time: string; price: string }[] = [
  { method: "InPost Paczkomat", time: "1–2 dni robocze", price: "12,99 zł" },
  { method: "Kurier DPD", time: "1–2 dni robocze", price: "16,99 zł" },
  { method: "Darmowa dostawa", time: "zamówienia od 149 zł", price: "0,00 zł" },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Kiedy wyślecie moją kawę?",
    answer:
      "Każde zamówienie pakujemy maksymalnie 48 godzin od wypału. Palimy na bieżąco, kilka razy w tygodniu. Zamówienia złożone do 12:00 zwykle opuszczają palarnię tego samego lub następnego dnia roboczego.",
  },
  {
    question: "Czy mogę śledzić przesyłkę?",
    answer:
      "Tak. Gdy paczka opuści palarnię, wyślemy Ci e-mail z numerem przesyłki i linkiem do śledzenia na stronie przewoźnika: InPost lub DPD.",
  },
  {
    question: "Jak mogę zwrócić zamówienie?",
    answer:
      "Masz 14 dni od odebrania paczki na odstąpienie od umowy bez podania przyczyny. Napisz na hello@craftcoffee.pl, a wyślemy Ci prostą instrukcję zwrotu. Pieniądze zwracamy w ciągu 14 dni od otrzymania przesyłki z powrotem.",
  },
  {
    question: "Czy mogę zwrócić otwartą kawę?",
    answer:
      "Otwarta kawa to produkt spożywczy, więc nie podlega standardowemu zwrotowi. Jeśli jednak coś jest nie tak z wypałem albo paczka dotarła uszkodzona, napisz do nas. Zawsze znajdziemy rozwiązanie.",
  },
  {
    question: "Czy mogę zmienić adres po złożeniu zamówienia?",
    answer:
      "Tak, o ile paczka nie opuściła jeszcze palarni. Napisz jak najszybciej na hello@craftcoffee.pl, podając numer zamówienia i nowy adres, a zaktualizujemy etykietę przed nadaniem.",
  },
  {
    question: "Jak pakujecie kawę?",
    answer:
      "W szczelne worki z jednostronnym wentylem, który wypuszcza dwutlenek węgla, ale nie wpuszcza tlenu. Na każdym opakowaniu znajdziesz datę wypału, a paczkę wypełniamy materiałami nadającymi się do recyklingu.",
  },
];

export default function DostawaIZwrotyPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-20">
        <Container>
          <p className="text-gold mb-5 font-mono text-[11px] uppercase tracking-[0.2em]">
            Informacje / wysyłka
          </p>
          <SplitHeading
            as="h1"
            className="font-display text-crema max-w-4xl text-[clamp(2.75rem,7vw,6rem)] leading-[0.98] font-light tracking-tight"
          >
            Dostawa i <em>zwroty</em>
          </SplitHeading>
          <Reveal delay={0.3} className="mt-8 max-w-2xl">
            <p className="text-latte text-base leading-relaxed md:text-lg">
              Świeżość traktujemy dosłownie: Twoja kawa opuszcza palarnię
              najpóźniej 48 godzin po wypale. Poniżej wszystko o kosztach,
              terminach i zwrotach.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Cost table */}
      <section className="border-line border-t py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="01 / Koszty dostawy"
            title={
              <>
                Ile kosztuje <em>wysyłka</em>
              </>
            }
          />
          <Reveal className="mt-12">
            <div className="border-line bg-roast overflow-hidden rounded-2xl border">
              <table className="w-full border-collapse text-left font-mono text-xs md:text-sm">
                <caption className="sr-only">
                  Koszty i czas dostawy zamówień
                </caption>
                <thead>
                  <tr className="border-line text-latte border-b uppercase">
                    <th
                      scope="col"
                      className="px-5 py-4 text-[10px] font-normal tracking-[0.2em] md:px-8 md:text-[11px]"
                    >
                      Metoda
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-4 text-[10px] font-normal tracking-[0.2em] md:px-8 md:text-[11px]"
                    >
                      Czas / warunek
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-4 text-right text-[10px] font-normal tracking-[0.2em] md:px-8 md:text-[11px]"
                    >
                      Koszt
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SHIPPING_ROWS.map((row) => (
                    <tr
                      key={row.method}
                      className="border-line hover:bg-roast-2 border-b transition-colors duration-200 last:border-b-0 motion-reduce:transition-none"
                    >
                      <th
                        scope="row"
                        className="text-crema px-5 py-5 font-normal md:px-8"
                      >
                        {row.method}
                      </th>
                      <td className="text-latte px-5 py-5 md:px-8">
                        {row.time}
                      </td>
                      <td className="text-gold px-5 py-5 text-right tabular-nums md:px-8">
                        {row.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="mt-6">
            <p className="text-latte font-mono text-[11px] uppercase tracking-[0.2em]">
              Darmowa dostawa naliczana automatycznie od 149 zł
            </p>
          </Reveal>
        </Container>
      </section>

      {/* FAQ accordion */}
      <section className="border-line border-t py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="02 / Najczęstsze pytania"
            title={
              <>
                Masz <em>pytania</em>? Mamy odpowiedzi
              </>
            }
          />
          <Reveal className="mt-12">
            <Faq items={FAQ_ITEMS} />
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <p className="text-latte text-sm leading-relaxed">
              Nie widzisz tu swojej odpowiedzi? Napisz na{" "}
              <a
                href="mailto:hello@craftcoffee.pl"
                className="text-gold hover:text-gold-soft underline underline-offset-4 transition-colors duration-200 motion-reduce:transition-none"
              >
                hello@craftcoffee.pl
              </a>{" "}
              Odpowiadamy w 24 godziny, od poniedziałku do piątku.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
