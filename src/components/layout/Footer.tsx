import Link from "next/link";

import NewsletterForm from "@/components/layout/NewsletterForm";
import Container from "@/components/ui/Container";

const COLUMNS = [
  {
    title: "Sklep",
    links: [
      { label: "Wszystkie kawy", href: "/sklep" },
      { label: "Koszyk", href: "/koszyk" },
      { label: "Zamówienie", href: "/zamowienie" },
    ],
  },
  {
    title: "Informacje",
    links: [
      { label: "O nas", href: "/o-nas" },
      { label: "Dostawa i zwroty", href: "/dostawa-i-zwroty" },
      { label: "Kontakt", href: "/kontakt" },
    ],
  },
] as const;

/** Site footer: big serif CTA, link columns, demo newsletter, small print. */
export function Footer() {
  return (
    <footer className="border-line border-t">
      <Container className="pt-20 pb-10 md:pt-28">
        {/* Big CTA */}
        <div className="border-line border-b pb-16 md:pb-20">
          <p className="text-gold font-mono text-[11px] uppercase tracking-[0.2em]">
            Masz pytania? Wpadnij na espresso
          </p>
          <Link href="/kontakt" className="group mt-6 inline-block">
            <span className="font-display text-crema group-hover:text-gold-soft block text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] font-light tracking-tight transition-colors duration-300 motion-reduce:transition-none">
              Napijmy się <em className="text-gold italic">kawy</em>
            </span>
            <span className="text-latte group-hover:text-gold mt-4 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 motion-reduce:transition-none">
              Skontaktuj się z nami
              <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>

        {/* Link columns + contact + newsletter */}
        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-4 md:py-16">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="text-gold font-mono text-[11px] uppercase tracking-[0.2em]">
                {col.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-latte hover:text-crema text-sm transition-colors duration-200 motion-reduce:transition-none"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-gold font-mono text-[11px] uppercase tracking-[0.2em]">
              Kontakt
            </h2>
            <ul className="text-latte mt-5 space-y-3 font-mono text-xs leading-relaxed">
              <li>ul. Spokojna 12</li>
              <li>30-001 Kraków</li>
              <li>
                <a
                  href="mailto:hello@craftcoffee.pl"
                  className="hover:text-crema transition-colors duration-200 motion-reduce:transition-none"
                >
                  hello@craftcoffee.pl
                </a>
              </li>
              <li>
                <a
                  href="tel:+48123456789"
                  className="hover:text-crema transition-colors duration-200 motion-reduce:transition-none"
                >
                  +48 12 345 67 89
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h2 className="text-gold font-mono text-[11px] uppercase tracking-[0.2em]">
              Newsletter
            </h2>
            <p className="text-latte mt-5 text-sm leading-relaxed">
              Świeże wypały i nowości. Raz w miesiącu, bez spamu.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Small print */}
        <div className="border-line text-latte flex flex-col gap-3 border-t pt-8 font-mono text-[10px] uppercase tracking-[0.2em] md:flex-row md:items-center md:justify-between">
          <p>© 2026 Craft Coffee / projekt demonstracyjny</p>
          <p>Palone w Krakowie · 100% arabica</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
