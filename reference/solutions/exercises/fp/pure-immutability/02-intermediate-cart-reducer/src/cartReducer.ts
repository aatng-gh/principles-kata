// Reference good impl — fully pure + immutable updates.

export interface CartItem {
  readonly sku: string;
  readonly qty: number;
  readonly unitPrice: number;
}

export interface Cart {
  readonly id: string;
  readonly items: readonly CartItem[];
  readonly coupon?: string;
  readonly total: number;
}

function recomputeTotal(items: readonly CartItem[], coupon?: string): number {
  const sub = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  return coupon === 'SAVE10' ? Math.round(sub * 0.9 * 100) / 100 : sub;
}

export function addItem(cart: Cart, item: CartItem): Cart {
  const items = [...cart.items, item];
  return {
    ...cart,
    items,
    total: recomputeTotal(items, cart.coupon),
  };
}

export function applyCoupon(cart: Cart, code: string): Cart {
  return {
    ...cart,
    coupon: code,
    total: recomputeTotal(cart.items, code),
  };
}

export function changeQty(cart: Cart, sku: string, newQty: number): Cart {
  const items = cart.items.map((it) => (it.sku === sku ? { ...it, qty: newQty } : it));
  return {
    ...cart,
    items,
    total: recomputeTotal(items, cart.coupon),
  };
}
