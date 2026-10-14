import Image from "next/image";

import { productPhotos } from "@/data/images";

interface ProductPhotoProps {
  slug: string;
  name: string;
  /** `sizes` for the responsive srcset; match the rendered width. */
  sizes: string;
  className?: string;
  preload?: boolean;
}

/**
 * Product packshot (4:5) filling its parent. The parent sets the size and
 * aspect ratio; the photo covers it. Falls back to a plain roast surface for
 * an unknown slug so a stale cart entry never breaks the layout.
 */
export function ProductPhoto({ slug, name, sizes, className, preload }: ProductPhotoProps) {
  const photo = productPhotos[slug];
  if (!photo) {
    return <div aria-hidden="true" className={`bg-roast-2 h-full w-full ${className ?? ""}`} />;
  }

  return (
    <Image
      src={photo}
      alt={`Torebka kawy ${name}`}
      sizes={sizes}
      placeholder="blur"
      preload={preload}
      className={`h-full w-full object-cover ${className ?? ""}`}
    />
  );
}

export default ProductPhoto;
