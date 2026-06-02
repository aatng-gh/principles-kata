// exercises/fp/pure-core-impure-shell/01-basic-pricing-rules/tests/exercise.test.ts
import { beforeEach, describe, expect, it } from 'vitest';
import { type Cart, calculatePrice } from '../src/pricingRules';

describe('pricingRules (pure core impure shell basic)', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = { items: [{ sku: 'a', price: 10, qty: 2 }] };
    (globalThis as any).fakeDB = { tax: 1.1 };
  });

  it('computes a price (impure so non-det but test only checks shape)', () => {
    const p = calculatePrice(cart, 0.1);
    expect(typeof p).toBe('number');
    expect(p).toBeGreaterThan(10);
  });
});
