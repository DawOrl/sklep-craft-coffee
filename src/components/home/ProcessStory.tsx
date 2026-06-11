"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import SectionHeading from "@/components/ui/SectionHeading";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Step {
  number: string;
  title: string;
  tag: string;
  copy: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Zbiór",
    tag: "Ręczna selekcja",
    copy: "Wiśnie kawowca zbierane są ręcznie, wyłącznie w pełni dojrzałe. Selekcja zaczyna się na krzaku — zanim ziarno w ogóle ruszy w drogę do palarni.",
  },
  {
    number: "02",
    title: "Palenie",
    tag: "Małe serie",
    copy: "Każde ziarno ma własny profil wypału, dopracowany w dziesiątkach prób. Palimy kilka razy w tygodniu, w seriach po kilkanaście kilogramów — nigdy na zapas.",
  },
  {
    number: "03",
    title: "Mielenie",
    tag: "Pod Twoją metodę",
    copy: "Najwięcej aromatu zostaje w całych ziarnach, dlatego mielimy dopiero przy pakowaniu. Grubość dobieramy pod Twoją metodę — od espresso po french press.",
  },
  {
    number: "04",
    title: "Parzenie",
    tag: "Twoja filiżanka",
    copy: "Reszta dzieje się u Ciebie. Świeża woda, dobra proporcja i chwila uwagi — tak z ziarna wychodzi charakter, nad którym pracujemy od zbioru.",
  },
];

/**
 * Section 4 — „Od ziarna do filiżanki": pinned horizontal storytelling.
 *
 * Desktop + motion OK: section pinned (ScrollTrigger pin, scrub: 1), the
 * track translates horizontally across 4 panels, gold progress bar tracks
 * scroll progress. On mobile (<768px) or prefers-reduced-motion the layout
 * degrades to vertically stacked sections — both via the SAME media query:
 * gsap.matchMedia for the animation, `motion-safe:md:*` utilities for CSS.
 */
export function ProcessStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          // body is display:flex (flex-col), which silently flips ScrollTrigger's
          // pinSpacing default to false — without this the following sections
          // scroll OVER the pinned panels instead of waiting for the pin to end.
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              gsap.set(progressRef.current, { scaleX: self.progress });
            }
          },
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Od ziarna do filiżanki — nasz proces"
      className="border-line bg-roast relative border-y motion-safe:md:h-svh motion-safe:md:overflow-hidden"
    >
      <div className="flex h-full flex-col py-20 md:py-0 motion-safe:md:pt-28 motion-safe:md:pb-12">
        {/* header + progress bar */}
        <div className="mx-auto flex w-full max-w-[88rem] flex-wrap items-end justify-between gap-8 px-6 md:px-10">
          <SectionHeading
            eyebrow="02 — Proces"
            title={
              <>
                Od ziarna do <em>filiżanki</em>
              </>
            }
          />
          <div
            className="hidden items-center gap-4 pb-3 motion-safe:md:flex"
            aria-hidden="true"
          >
            <span className="text-latte font-mono text-[11px] uppercase tracking-[0.2em]">
              01 — 04
            </span>
            <div className="bg-line h-0.5 w-44 overflow-hidden rounded-full">
              <div
                ref={progressRef}
                className="bg-gold h-full w-full origin-left"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        </div>

        {/* track: vertical stack by default, horizontal pinned ride on md+ */}
        <div
          ref={trackRef}
          className="mt-16 flex flex-col gap-20 px-6 will-change-transform md:px-10 motion-safe:md:mt-0 motion-safe:md:w-max motion-safe:md:flex-1 motion-safe:md:flex-row motion-safe:md:items-center motion-safe:md:gap-[7vw] motion-safe:md:pr-[14vw]"
        >
          {STEPS.map((step) => (
            <article
              key={step.number}
              className="border-line relative shrink-0 border-l pl-6 md:pl-10 motion-safe:md:w-[56vw] motion-safe:md:max-w-3xl"
            >
              <span
                aria-hidden="true"
                className="text-crema/10 pointer-events-none block font-mono text-[clamp(6rem,20vh,13rem)] leading-none font-medium select-none"
              >
                {step.number}
              </span>
              <div className="-mt-8 md:-mt-14">
                <p className="text-gold font-mono text-[11px] uppercase tracking-[0.2em]">
                  {step.tag}
                </p>
                <h3 className="font-display text-crema mt-3 text-4xl font-light tracking-tight md:text-6xl">
                  {step.title}
                </h3>
                <p className="text-latte mt-5 max-w-md text-base leading-relaxed md:text-lg">
                  {step.copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProcessStory;
