// exercises/oop/open-closed/01-basic-discount-engine/tests/exercise.test.ts
import { describe, expect, it } from 'vitest';
import { CustomerTier, DiscountEngine } from '../src/discountEngine';

describe('DiscountEngine (OCP basic)', () => {
  let engine: DiscountEngine;

  beforeEach(() => {
    engine = new DiscountEngine();
  });

  it('applies no discount for regular tier', () => {
    expect(engine.calculateDiscountedPrice(100, 'regular')).toBe(100);
  });

  it('applies 15% for vip', () => {
    expect(engine.calculateDiscountedPrice(100, 'vip')).toBeCloseTo(85);
  });

  it('applies 10% for premium', () => {
    expect(engine.calculateDiscountedPrice(200, 'premium')).toBeCloseTo(180);
  });

  it('stacks with SUMMER20 promo', () => {
    const price = engine.calculateDiscountedPrice(100, 'regular', 'SUMMER20');
    expect(price).toBeCloseTo(80); // 20%
  });

  it('stacks with LOYAL10', () => {
    const price = engine.calculateDiscountedPrice(100, 'vip', 'LOYAL10');
    // 15% + 10% = 25%, capped? no
    expect(price).toBeCloseTo(75);
  });

  it('caps total discount at 50%', () => {
    const price = engine.calculateDiscountedPrice(100, 'vip', 'SUMMER20');
    expect(price).toBeCloseTo(50);
  });

  it('rejects negative price', () => {
    expect(() => engine.calculateDiscountedPrice(-10, 'regular')).toThrow(/negative/);
  });
});
