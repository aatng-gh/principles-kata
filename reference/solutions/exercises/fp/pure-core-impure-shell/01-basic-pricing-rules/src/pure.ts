// Pure core — 100% deterministic pricing. No Date, random, I/O, console, or DB.
// Why this design (pure-core-impure-shell): the math and rule application are referentially transparent.
// Given the same cart snapshot + explicit now + explicit loyalty tier, the output (including "applied" list
// for deterministic rules) is always identical. This core can be unit-tested with any synthetic now/tier
// without fakes or time mocking. The shell (see shell.ts) is responsible for obtaining now, tier, etc.
// and can be tested with integration or contract tests.

export interface CartItem {
  readonly sku: string;
  readonly qty: number;
  readonly unitPrice: number;
}

export interface Cart {
  readonly items: readonly CartItem[];
  readonly userId: string;
}

export interface PriceResult {
  readonly subtotal: number;
  readonly discount: number;
  readonly total: number;
  readonly applied: readonly string[];
}

export function calculatePricePure(
  cart: Cart,
  now: Date,
  tier: 'gold' | 'standard',
  taxRate = 0.1
): PriceResult {
  const subtotal = cart.items.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  const applied: string[] = [];
  let discount = 0;

  if (tier === 'gold') {
    discount += subtotal * 0.1;
    applied.push('loyalty-gold');
  }

  // surprise is non-deterministic by nature; for pure core we either remove it or make probability
  // an explicit input. Here we omit random from pure (shell can decide to apply surprise before calling).
  // wed special uses the *passed* now only.
  if (now.getDay() === 3) {
    discount += subtotal * 0.05;
    applied.push('wed-special');
  }

  const afterDiscount = Math.max(0, subtotal - discount);
  const tax = Math.round(afterDiscount * taxRate * 100) / 100;
  const total = Math.round((afterDiscount + tax) * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total,
    applied,
  };
}
