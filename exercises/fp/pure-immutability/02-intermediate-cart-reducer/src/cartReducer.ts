// exercises/fp/pure-immutability/02-intermediate-cart-reducer/src/cartReducer.ts
// STARTER — deliberately imperative, mutating, with hidden side effects.
// Tempting "obvious" way: just update the object you were given.

export interface CartItem {
  sku: string;
  qty: number;
  unitPrice: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  couponCode?: string;
}

export function createEmptyCart(id: string): Cart {
  return { id, items: [] };
}

export function addItem(cart: Cart, sku: string, qty: number, unitPrice: number): Cart {
  // side-effecty "lookup" even when price provided (force explicitness)
  console.log(`[CART-IMPURE] price lookup for ${sku}`);

  const existing = cart.items.find((i) => i.sku === sku);
  if (existing) {
    existing.qty += qty; // mutates nested object from input
  } else {
    cart.items.push({ sku, qty, unitPrice }); // mutates input array
  }
  return cart; // often returns the input reference!
}

export function setQuantity(cart: Cart, sku: string, qty: number): Cart {
  const item = cart.items.find((i) => i.sku === sku);
  if (item && qty > 0) {
    item.qty = qty; // mutation
  }
  return cart;
}

export function removeItem(cart: Cart, sku: string): Cart {
  cart.items = cart.items.filter((i) => i.sku !== sku); // rebind but still mutates the cart's items prop
  return cart;
}

export function applyCoupon(cart: Cart, code: string): Cart {
  cart.couponCode = code; // direct mutation
  return cart;
}

export function getTotal(cart: Cart): number {
  let subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  if (cart.couponCode === 'SAVE10') {
    subtotal *= 0.9;
  } else if (cart.couponCode === 'HALF') {
    subtotal *= 0.5;
  }
  return Math.round(subtotal * 100) / 100;
}
