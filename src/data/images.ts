import type { StaticImageData } from "next/image";

import brazylia from "@/assets/products/brazylia-cerrado.webp";
import etiopia from "@/assets/products/etiopia-yirgacheffe.webp";
import gwatemala from "@/assets/products/gwatemala-antigua.webp";
import indonezja from "@/assets/products/indonezja-sumatra.webp";
import kenia from "@/assets/products/kenia-aa.webp";
import kolumbia from "@/assets/products/kolumbia-huila.webp";
import peru from "@/assets/products/peru-cajamarca.webp";
import rwanda from "@/assets/products/rwanda-nyamasheke.webp";
import rzemieslnik from "@/assets/products/rzemieslnik.webp";
import wieczorna from "@/assets/products/wieczorna.webp";

/**
 * Packshots: one bag, one light, one backdrop; only the paper colour and the
 * label mark change per coffee (generated as a single consistent series).
 */
export const productPhotos: Record<string, StaticImageData> = {
  "etiopia-yirgacheffe": etiopia,
  "kolumbia-huila": kolumbia,
  "brazylia-cerrado": brazylia,
  "kenia-aa": kenia,
  "gwatemala-antigua": gwatemala,
  "peru-cajamarca": peru,
  "indonezja-sumatra": indonezja,
  "rwanda-nyamasheke": rwanda,
  rzemieslnik,
  wieczorna,
};
