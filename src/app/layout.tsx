import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";

import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import CursorFollower from "@/components/motion/CursorFollower";
import SmoothScroll from "@/components/motion/SmoothScroll";
import { CartProvider } from "@/lib/cart";

import "./globals.css";

// Variable font (full wght axis; design uses 300–600) + optical sizing,
// softness and wonk axes. latin-ext covers Polish diacritics.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s — Craft Coffee",
    default: "Craft Coffee — rzemieślnicza palarnia kawy",
  },
  description:
    "Kawa specialty palona w małych seriach. Single origin z Etiopii, Kolumbii i Kenii oraz autorskie mieszanki — od wypału do wysyłki w 48 godzin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      {/* min-h-svh (not %-based) — Lenis sets html height:auto, which would
          collapse a percentage min-height chain and break the sticky footer. */}
      <body className="bg-espresso text-crema flex min-h-svh flex-col font-sans">
        <CartProvider>
          <a
            href="#tresc"
            className="bg-gold text-espresso sr-only z-50 rounded-full px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
          >
            Przejdź do treści
          </a>
          <SmoothScroll>
            <Header />
            <main id="tresc" className="flex flex-1 flex-col">
              {children}
            </main>
            <Footer />
          </SmoothScroll>
          <CartDrawer />
          <CursorFollower />
          <div className="grain-overlay" aria-hidden="true" />
        </CartProvider>
      </body>
    </html>
  );
}
