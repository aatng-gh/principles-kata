// Reference copy of the test (passes against the good pure impl in this dir).
import { beforeEach, describe, expect, it } from 'vitest';
import { type Cart, calculateInvoice } from '../src/invoiceCalculator';

// For the reference tree we duplicated the good calculator under this path for self-contained check.
describe('calculateInvoice reference (pure)', () => {
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
  it('produces correct totals', () => {
    const now = new Date('2026-06-01T12:00:00Z');
    const inv = calculateInvoice(cart, 0.1, now); // the reference src is the pure one
    expect(inv.subtotal).toBeCloseTo(24.5); // 20 + 4.5 (after 10% discount on B)
  });
  it('does not mutate input', () => {
    const original = JSON.parse(JSON.stringify(cart));
    calculateInvoice(cart, 0.1, new Date());
    expect(cart).toEqual(original);
  });
});
