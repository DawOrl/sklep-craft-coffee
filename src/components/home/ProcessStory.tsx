"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

import brew from "@/assets/process/brew.webp";
import grind from "@/assets/process/grind.webp";
import harvest from "@/assets/process/harvest.webp";
import roast from "@/assets/process/roast.webp";
import SectionHeading from "@/components/ui/SectionHeading";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Step {
  number: string;
  title: string;
  tag: string;
  copy: string;
  image: StaticImageData;
  alt: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Zbiór",
    tag: "Ręczna selekcja",
    copy: "Wiśnie kawowca zbierane są ręcznie, wyłącznie w pełni dojrzałe. Selekcja zaczyna się na krzaku, zanim ziarno w ogóle ruszy w drogę do palarni.",
    image: harvest,
    alt: "Dojrzałe czerwone i pomarańczowe wiśnie kawowca na gałęzi wśród ciemnozielonych liści",
  },
  {
    number: "02",
    title: "Palenie",
    tag: "Małe serie",
    copy: "Każde ziarno ma własny profil wypału, dopracowany w dziesiątkach prób. Palimy kilka razy w tygodniu, w seriach po kilkanaście kilogramów. Nigdy na zapas.",
    image: roast,
    alt: "Rozsypane świeżo palone ziarna kawy z wyraźną bruzdą, w ciepłym bocznym świetle",
  },
  {
    number: "03",
    title: "Mielenie",
    tag: "Pod Twoją metodę",
    copy: "Najwięcej aromatu zostaje w całych ziarnach, dlatego mielimy dopiero przy pakowaniu. Grubość dobieramy pod Twoją metodę: od espresso po french press.",
    image: grind,
    alt: "Świeżo zmielona kawa sypie się z młynka do stalowego kubka",
  },
  {
    number: "04",
    title: "Parzenie",
    tag: "Twoja filiżanka",
    copy: "Reszta dzieje się u Ciebie. Świeża woda, dobra proporcja i chwila uwagi. Tak z ziarna wychodzi charakter, nad którym pracujemy od zbioru.",
    image: brew,
    alt: "Woda z czajnika z długą wylewką spływa na kawę w ceramicznym dripperze",
  },
];

/**
 * Section 4 - „Od ziarna do filiżanki": pinned horizontal storytelling.
 *
 * Desktop + motion OK: section pinned (ScrollTrigger pin, scrub: 1), the
 * track translates horizontally across 4 panels, gold progress bar tracks
 * scroll progress. On mobile (<768px) or prefers-reduced-motion the layout
 * degrades to vertically stacked sections - both via the SAME media query:
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
          // pinSpacing default to false - without this the following sections
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
      aria-label="Od ziarna do filiżanki: nasz proces"
      className="border-line bg-roast relative border-y motion-safe:md:h-svh motion-safe:md:overflow-hidden"
    >
      <div className="flex h-full flex-col py-20 md:py-0 motion-safe:md:pt-28 motion-safe:md:pb-12">
        {/* header + progress bar */}
        <div className="mx-auto flex w-full max-w-[88rem] flex-wrap items-end justify-between gap-8 px-6 md:px-10">
          <SectionHeading
            eyebrow="02 / Proces"
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
              01 / 04
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
          {STEPS.map((step, index) => (
            <article
              key={step.number}
              className="relative shrink-0 motion-safe:md:grid motion-safe:md:w-[min(76vw,68rem)] motion-safe:md:grid-cols-[auto_minmax(0,1fr)] motion-safe:md:items-end motion-safe:md:gap-12"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:max-w-2xl motion-safe:md:aspect-[4/5] motion-safe:md:h-[min(60vh,40rem)]">
                <Image
                  src={step.image}
                  alt={step.alt}
                  placeholder="blur"
                  sizes="(min-width: 768px) 32vw, 92vw"
                  className="h-full w-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
              <div className="border-line mt-8 border-l pl-6 md:pl-10 motion-safe:md:mt-0 motion-safe:md:pb-4">
                <span
                  aria-hidden="true"
                  className="text-crema/10 pointer-events-none block font-mono text-[clamp(5rem,16vh,11rem)] leading-none font-medium select-none"
                >
                  {step.number}
                </span>
                <div className="-mt-6 md:-mt-10">
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProcessStory;
