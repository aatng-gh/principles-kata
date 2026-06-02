// exercises/fp/pure-immutability/02-intermediate-cart-reducer/tests/exercise.test.ts
import { beforeEach, describe, expect, it } from 'vitest';
import {
  type Cart,
  addItem,
  applyCoupon,
  createEmptyCart,
  getTotal,
  removeItem,
  setQuantity,
} from '../src/cartReducer';

describe('cartReducer (pure + immutable)', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = createEmptyCart('cart_42');
  });

  it('addItem produces correct cart and total', () => {
    const c1 = addItem(cart, 'SKU1', 2, 10);
    const c2 = addItem(c1, 'SKU2', 1, 5.5);
    expect(getTotal(c2)).toBeCloseTo(25.5);
    expect(c2.items).toHaveLength(2);
  });

  it('addItem merges qty for duplicate sku', () => {
    const c1 = addItem(cart, 'SKU1', 2, 10);
    const c2 = addItem(c1, 'SKU1', 3, 10);
    expect(c2.items).toHaveLength(1);
    // biome-ignore lint/suspicious/noExplicitAny: test for after-mutation starter behavior
    expect((c2.items[0] as any).qty).toBe(5);
    expect(getTotal(c2)).toBeCloseTo(50);
  });

  it('setQuantity, removeItem and coupon affect total correctly', () => {
    let c = addItem(cart, 'SKU1', 2, 10);
    c = setQuantity(c, 'SKU1', 1);
    c = addItem(c, 'SKU2', 4, 2.5);
    c = applyCoupon(c, 'SAVE10');
    expect(getTotal(c)).toBeCloseTo(18); // (10 + 10) * 0.9
    c = removeItem(c, 'SKU2');
    expect(getTotal(c)).toBeCloseTo(9);
  });

  it('does not mutate the input cart or its items (deep check)', () => {
    const original = JSON.parse(JSON.stringify(cart));
    const c1 = addItem(cart, 'X', 1, 9.99);
    applyCoupon(c1, 'HALF'); // chain on returned, but check orig
    setQuantity(cart, 'X', 99); // attempt on orig

    expect(cart).toEqual(original);
    expect(cart.items).toHaveLength(0);
  });

  it('returns new objects (no input reference reuse on happy path)', () => {
    const c1 = addItem(cart, 'A', 1, 1);
    expect(c1).not.toBe(cart);
    const c2 = applyCoupon(c1, 'SAVE10');
    expect(c2).not.toBe(c1);
  });

  it('is deterministic: same sequence of ops produces identical carts', () => {
    const c1 = addItem(createEmptyCart('c'), 'P', 2, 3);
    const c1b = applyCoupon(c1, 'HALF');
    const c2 = addItem(createEmptyCart('c'), 'P', 2, 3);
    const c2b = applyCoupon(c2, 'HALF');
    expect(c1b).toEqual(c2b);
  });

  it('handles empty and edge cases', () => {
    expect(getTotal(cart)).toBe(0);
    const afterRemove = removeItem(cart, 'nope');
    expect(afterRemove).not.toBe(cart);
    expect(getTotal(afterRemove)).toBe(0);
  });
});
