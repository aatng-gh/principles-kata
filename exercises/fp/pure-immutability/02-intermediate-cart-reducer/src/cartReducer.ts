// exercises/fp/pure-immutability/02-intermediate-cart-reducer/src/cartReducer.ts
export interface CartItem {
  readonly sku: string;
  readonly qty: number;
  readonly unitPrice: number;
}

export interface Cart {
  readonly id: string;
  readonly items: readonly CartItem[];
  readonly couponCode?: string;
}

export function createEmptyCart(id: string): Cart {
  return { id, items: [] };
}

export function addItem(cart: Cart, sku: string, qty: number, unitPrice: number): Cart {
  const hasItem = cart.items.some((item) => item.sku === sku);
  const items = hasItem
    ? cart.items.map((item) => (item.sku === sku ? { ...item, qty: item.qty + qty } : { ...item }))
    : [...cart.items.map((item) => ({ ...item })), { sku, qty, unitPrice }];

  return { ...cart, items };
}

export function setQuantity(cart: Cart, sku: string, qty: number): Cart {
  const items =
    qty > 0
      ? cart.items.map((item) => (item.sku === sku ? { ...item, qty } : { ...item }))
      : cart.items.map((item) => ({ ...item }));

  return { ...cart, items };
}

export function removeItem(cart: Cart, sku: string): Cart {
  return {
    ...cart,
    items: cart.items.filter((item) => item.sku !== sku).map((item) => ({ ...item })),
  };
}

export function applyCoupon(cart: Cart, code: string): Cart {
  return {
    ...cart,
    items: cart.items.map((item) => ({ ...item })),
    couponCode: code,
  };
}

export function getTotal(cart: Cart): number {
  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const discountMultiplier =
    cart.couponCode === 'SAVE10' ? 0.9 : cart.couponCode === 'HALF' ? 0.5 : 1;

  return Math.round(subtotal * discountMultiplier * 100) / 100;
}
