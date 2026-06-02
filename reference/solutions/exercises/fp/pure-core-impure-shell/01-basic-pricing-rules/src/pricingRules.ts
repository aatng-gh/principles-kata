// Reference good: pure core + thin shell.

export interface Cart {
  readonly items: readonly { readonly sku: string; readonly price: number; readonly qty: number }[];
}

export function calculatePricePure(
  cart: Cart,
  loyalty: number,
  now: Date,
  taxRate: number,
  promoSeed: number
): number {
  let total = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
  total = total * (1 - loyalty);
  if (promoSeed > 0.5) total *= 0.95;
  if (now.getHours() < 6) total *= 0.9;
  return total * taxRate;
}

// Impure shell — only this does effects / globals.
export function calculatePrice(cart: Cart, loyalty: number): number {
  const now = new Date();
  const promoSeed = Math.random();
  const taxRate = ((globalThis as unknown) as { fakeDB?: { tax: number } }).fakeDB?.tax ?? 1.1;
  return calculatePricePure(cart, loyalty, now, taxRate, promoSeed);
}
