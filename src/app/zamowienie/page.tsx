import type { Metadata } from "next";

import OrderForm from "@/components/checkout/OrderForm";

export const metadata: Metadata = {
  title: "Zamówienie",
  description:
    "Dane do wysyłki i podsumowanie zamówienia. Świeżo palona kawa w drodze do Ciebie.",
};

export default function OrderPage() {
  return <OrderForm />;
}
