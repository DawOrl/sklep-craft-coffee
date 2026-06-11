import type { CartItem } from '@/lib/cart';

export interface OrderData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

const ORDER_ID_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function randomOrderId(): string {
  let suffix = '';
  for (let i = 0; i < 6; i += 1) {
    suffix += ORDER_ID_ALPHABET[Math.floor(Math.random() * ORDER_ID_ALPHABET.length)];
  }
  return `CC-${suffix}`;
}

// TODO: replace this mock with a real Stripe Checkout session (create the
// session server-side from `data` + `items` and redirect to its URL).
export async function createOrder(
  data: OrderData,
  items: CartItem[],
): Promise<{ orderId: string }> {
  void data;
  void items;
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return { orderId: randomOrderId() };
}
