// exercises/fp/pure-immutability/01-basic-invoice-calculator/tests/exercise.test.ts
import { beforeEach, describe, expect, it } from 'vitest';
import { type Cart, calculateInvoice } from '../src/invoiceCalculator';

describe('calculateInvoice (pure + immutable)', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = {
      id: 'cart_1',
      items: [
        { sku: 'A', unitPrice: 10, qty: 2 },
        { sku: 'B', unitPrice: 5, qty: 1, discount: 0.1 },
      ],
    };
  });

  it('produces correct totals for the example cart', () => {
    const fixedNow = new Date('2026-06-01T12:00:00Z');
    const inv = calculateInvoice(cart, 0.1, fixedNow);

    expect(inv.subtotal).toBeCloseTo(24.5); // 20 + 4.5 (after 10% discount on B)
    expect(inv.tax).toBeCloseTo(2.45);
    expect(inv.total).toBeCloseTo(26.95);
    expect(inv.createdAt).toEqual(fixedNow);
    // Strengthen determinism: id must be derived from the provided `now` (starter uses Date.now() and will fail this)
    expect(inv.id).toContain(String(fixedNow.getTime()));
  });

  it('does not mutate the input cart or its items (deep check)', () => {
    const original = JSON.parse(JSON.stringify(cart));
    const fixedNow = new Date('2026-06-01T12:00:00Z');
    calculateInvoice(cart, 0.1, fixedNow);

    expect(cart).toEqual(original);
  });

  it('is deterministic: same inputs + same now produce identical output', () => {
    const now = new Date('2026-06-01T12:00:00Z');
    const inv1 = calculateInvoice(cart, 0.1, now);
    const inv2 = calculateInvoice(cart, 0.1, now);
    expect(inv1).toEqual(inv2);
    expect(inv1).not.toBe(inv2); // new object, not same ref
  });

  it('handles empty cart', () => {
    const empty: Cart = { id: 'c2', items: [] };
    const inv = calculateInvoice(empty, 0.1, new Date());
    expect(inv.subtotal).toBe(0);
    expect(inv.total).toBe(0);
  });
});
