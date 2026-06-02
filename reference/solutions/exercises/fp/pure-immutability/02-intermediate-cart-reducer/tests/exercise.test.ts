// exercises/fp/pure-immutability/02-intermediate-cart-reducer/tests/exercise.test.ts
import { beforeEach, describe, expect, it } from 'vitest';
import { type Cart, type CartItem, addItem, applyCoupon, changeQty } from '../src/cartReducer';

describe('cartReducer (pure immutability intermediate)', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = {
      id: 'cart1',
      items: [{ sku: 'A', qty: 1, unitPrice: 10 }],
      total: 10,
    };
  });

  it('addItem returns new cart, original untouched, correct total', () => {
    const original = JSON.parse(JSON.stringify(cart));
    const item: CartItem = { sku: 'B', qty: 2, unitPrice: 5 };
    const next = addItem(cart, item);

    expect(next).not.toBe(cart);
    expect(cart).toEqual(original); // no mutation
    expect(next.items).toHaveLength(2);
    expect(next.total).toBeCloseTo(20);
  });

  it('applyCoupon returns new, does not mutate, applies discount', () => {
    const original = JSON.parse(JSON.stringify(cart));
    const next = applyCoupon(cart, 'SAVE10');
    expect(next).not.toBe(cart);
    expect(cart).toEqual(original);
    expect(next.total).toBeCloseTo(9);
    expect(next.coupon).toBe('SAVE10');
  });

  it('changeQty returns new, original + nested item untouched', () => {
    const originalItems = JSON.parse(JSON.stringify(cart.items));
    const next = changeQty(cart, 'A', 3);
    expect(next).not.toBe(cart);
    expect(cart.items).toEqual(originalItems);
    expect(next.total).toBeCloseTo(30);
  });

  it('is deterministic: same ops produce equal result', () => {
    const c1 = { id: 'c', items: [{ sku: 'X', qty: 1, unitPrice: 2 }], total: 2 };
    const c2 = JSON.parse(JSON.stringify(c1));
    const r1 = applyCoupon(addItem(c1, { sku: 'Y', qty: 1, unitPrice: 3 }), 'SAVE10');
    const r2 = applyCoupon(addItem(c2, { sku: 'Y', qty: 1, unitPrice: 3 }), 'SAVE10');
    expect(r1).toEqual(r2);
  });
});
