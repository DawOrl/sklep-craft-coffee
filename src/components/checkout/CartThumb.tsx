import ProductPhoto from "@/components/art/ProductPhoto";
import type { CartItem } from "@/lib/cart";

interface CartThumbProps {
  item: CartItem;
  /** Size of the tile, e.g. "h-28 w-[5.6rem]" (keep it 4:5). */
  className?: string;
}

/** Packshot thumbnail on a roast tile (plain tile for unknown slugs). */
export function CartThumb({ item, className }: CartThumbProps) {
  return (
    <div className={`bg-roast shrink-0 overflow-hidden rounded-xl ${className ?? ""}`}>
      {/* zoom on the bag: at thumbnail size the full studio frame is mostly backdrop */}
      <ProductPhoto
        slug={item.slug}
        name={item.name}
        sizes="160px"
        className="origin-[50%_56%] scale-[1.42]"
      />
    </div>
  );
}

export default CartThumb;
