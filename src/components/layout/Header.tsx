"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { getLenis } from "@/components/motion/SmoothScroll";
import Container from "@/components/ui/Container";
import { useCart } from "@/lib/cart";

const NAV = [
  { href: "/sklep", label: "Sklep" },
  { href: "/o-nas", label: "O nas" },
  { href: "/dostawa-i-zwroty", label: "Dostawa" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

const FOCUSABLE =
  "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

/**
 * Fixed header (z-30): transparent → blurred espresso after 24px scroll.
 * Cart button with live count opens the CartDrawer.
 * Mobile: full-screen overlay menu with staggered links.
 */
export function Header() {
  const { count, openDrawer } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuNavRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu on navigation (adjust state during render).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the menu is open: scroll lock (Lenis paused — overflow:hidden alone
  // does not stop its programmatic scrolling), Esc closes, focus moves into
  // the menu and Tab is trapped within the header; focus returns to the
  // hamburger on close.
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const lenis = getLenis();
    lenis?.stop();
    const menuButton = menuButtonRef.current;

    // Move focus to the first menu link once the overlay starts appearing.
    const raf = requestAnimationFrame(() =>
      menuNavRef.current?.querySelector<HTMLElement>("a[href]")?.focus(),
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const root = headerRef.current;
      if (!root) return;
      const list = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = !!active && root.contains(active);

      if (e.shiftKey) {
        if (!inside || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (!inside || active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      lenis?.start();
      menuButton?.focus();
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <header
      ref={headerRef}
      style={{ viewTransitionName: "site-header" }}
      className={`fixed inset-x-0 top-0 z-30 border-b transition-colors duration-300 motion-reduce:transition-none ${
        solid
          ? "border-line bg-espresso/70 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Link
          href="/"
          className="font-display text-crema text-xl tracking-tight md:text-2xl"
          aria-label="Craft Coffee — strona główna"
        >
          Craft <span className="text-gold italic">Coffee</span>
        </Link>

        <nav
          aria-label="Nawigacja główna"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 motion-reduce:transition-none hover:text-gold ${
                  active ? "text-gold" : "text-latte"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openDrawer}
            aria-label={`Otwórz koszyk — ${count} szt.`}
            className="border-line text-crema hover:border-gold hover:text-gold flex h-10 items-center gap-2.5 rounded-full border px-4 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 motion-reduce:transition-none"
          >
            Koszyk
            <span className="bg-gold text-espresso flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] tabular-nums">
              {count}
            </span>
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
            className="border-line text-crema hover:border-gold flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200 motion-reduce:transition-none md:hidden"
          >
            <span aria-hidden="true" className="relative block h-2.75 w-4.5">
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 motion-reduce:transition-none ${
                  menuOpen ? "top-1.25 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 motion-reduce:transition-none ${
                  menuOpen ? "top-1.25 -rotate-45" : "top-2.5"
                }`}
              />
            </span>
          </button>
        </div>
      </Container>

      {/* Mobile full-screen overlay menu */}
      <div
        aria-hidden={!menuOpen}
        className={`bg-espresso/95 fixed inset-0 -z-10 backdrop-blur-lg transition-[opacity,visibility] duration-300 motion-reduce:transition-none md:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav
          ref={menuNavRef}
          aria-label="Menu mobilne"
          className="flex h-full flex-col items-start justify-center gap-3 px-8"
        >
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? undefined : -1}
              style={{ transitionDelay: menuOpen ? `${120 + i * 70}ms` : "0ms" }}
              className={`font-display text-crema hover:text-gold text-4xl font-light transition-[opacity,transform,color] duration-500 motion-reduce:transform-none motion-reduce:transition-none ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <p className="text-latte mt-10 font-mono text-[10px] uppercase tracking-[0.2em]">
            Palarnia rzemieślnicza — od 2019
          </p>
        </nav>
      </div>
    </header>
  );
}

export default Header;
