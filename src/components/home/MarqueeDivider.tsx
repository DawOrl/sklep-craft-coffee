import BeanGlyph from "@/components/art/BeanGlyph";
import Marquee from "@/components/motion/Marquee";

const ITEMS = ["Świeży wypał", "100% arabica", "Specialty", "Małe serie"];

/**
 * Section 2 - editorial marquee divider between the hero and bestsellers.
 * Pure CSS (server component); animation disabled under reduced motion.
 */
export function MarqueeDivider() {
  return (
    <section aria-label="Wyróżniki palarni" className="border-line border-y">
      <Marquee speed={28} className="py-5 md:py-7">
        {ITEMS.map((item) => (
          <span key={item} className="flex items-center">
            <span className="font-display text-crema text-[clamp(1.375rem,2.6vw,2.25rem)] leading-none font-light tracking-wide uppercase">
              {item}
            </span>
            <BeanGlyph className="text-gold mx-8 h-5 w-auto md:mx-12 md:h-6" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}

export default MarqueeDivider;
