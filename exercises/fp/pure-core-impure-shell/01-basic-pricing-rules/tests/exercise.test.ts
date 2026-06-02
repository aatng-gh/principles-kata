// exercises/fp/pure-core-impure-shell/01-basic-pricing-rules/tests/exercise.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Cart, calculatePrice } from '../src/pricingRules';

describe('pricingRules (pure core + impure shell)', () => {
  let cart: Cart;
  const fixedNow = new Date('2026-06-03T12:00:00Z'); // not wed, day=3=wed? 2026-06-03 is Wednesday

  beforeEach(() => {
    cart = {
      userId: 'g123',
      items: [{ sku: 'A', qty: 2, unitPrice: 10 }],
    };
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('produces correct price with explicit now + tier (no hidden effects in pure)', () => {
    // after learner fixes, sig will be calculatePrice(cart, now, tier, tax?)
    const res = calculatePrice(cart, fixedNow, 'gold', 0.1);
    expect(res.subtotal).toBeCloseTo(20);
    expect(res.discount).toBeGreaterThan(0);
    expect(res.total).toBeGreaterThan(0);
    // no db or random logs in pure path (test doesn't assert absence here, judge does)
  });

  it('is deterministic given same now + tier', () => {
    const r1 = calculatePrice(cart, fixedNow, 'standard');
    const r2 = calculatePrice(cart, fixedNow, 'standard');
    expect(r1).toEqual(r2);
  });

  it('wed special applies only when now is wed (explicit)', () => {
    const wed = new Date('2026-06-03T10:00:00Z');
    const res = calculatePrice(cart, wed, 'standard');
    expect(res.applied).toContain('wed-special');
  });
});
