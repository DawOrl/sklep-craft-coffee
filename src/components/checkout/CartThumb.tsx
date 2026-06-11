import ProductBagArt from "@/components/art/ProductBagArt";
import { getProduct } from "@/data/products";
import type { CartItem } from "@/lib/cart";

interface CartThumbProps {
  item: CartItem;
  /** Size + padding of the tile, e.g. "h-28 w-20 p-2". */
  className?: string;
}

/** Mini bag art on a roast tile; palette swatch fallback for unknown slugs. */
export function CartThumb({ item, className }: CartThumbProps) {
  const product = getProduct(item.slug);

  return (
    <div className={`bg-roast shrink-0 rounded-xl ${className ?? ""}`}>
      {product ? (
        <ProductBagArt product={product} className="h-full w-full" />
      ) : (
        <div
          aria-hidden="true"
          className="h-full w-full rounded-lg"
          style={{ backgroundColor: item.palette.bag }}
        />
      )}
    </div>
  );
}

export default CartThumb;
