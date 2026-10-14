import type { Metadata } from "next";

import CartView from "@/components/checkout/CartView";

export const metadata: Metadata = {
  title: "Koszyk",
  description:
    "Twój koszyk w Craft Coffee: sprawdź wybrane kawy i przejdź do zamówienia.",
};

export default function CartPage() {
  return <CartView />;
}
