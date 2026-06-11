import Bestsellers from "@/components/home/Bestsellers";
import Hero from "@/components/home/Hero";
import Highlights from "@/components/home/Highlights";
import HomeCta from "@/components/home/HomeCta";
import MarqueeDivider from "@/components/home/MarqueeDivider";
import ProcessStory from "@/components/home/ProcessStory";

/**
 * Home — Craft Coffee. Server component composing the six sections:
 * hero (3D), marquee divider, bestsellers, pinned process story,
 * counters, closing CTA. Metadata comes from the root layout default.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeDivider />
      <Bestsellers />
      <ProcessStory />
      <Highlights />
      <HomeCta />
    </>
  );
}
