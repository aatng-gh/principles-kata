// Pure core: referentially transparent pricing math. No Date, Math.random, console, or DB inside.
// All decisions driven by explicit parameters (now, tier).
// See shell.ts for the effectful wiring that obtains now/tier and calls this.

export interface Cart {
  readonly items: readonly {
    readonly sku: string;
    readonly qty: number;
    readonly unitPrice: number;
  }[];
  readonly userId: string;
}

export interface PriceResult {
  readonly subtotal: number;
  readonly discount: number;
  readonly total: number;
  readonly applied: readonly string[];
}

export type LoyaltyTier = 'gold' | 'standard';

const roundCurrency = (amount: number): number => Math.round(amount * 100) / 100;

const subtotalFor = (cart: Cart): number =>
  cart.items.reduce((subtotal, item) => subtotal + item.unitPrice * item.qty, 0);

const isWednesday = (now: Date): boolean => now.getDay() === 3;

const appliedRules = (now: Date, tier: LoyaltyTier): readonly string[] => [
  ...(tier === 'gold' ? ['loyalty-gold'] : []),
  ...(isWednesday(now) ? ['wed-special'] : []),
];

const discountRateFor = (rules: readonly string[]): number =>
  rules.reduce(
    (rate, rule) => rate + (rule === 'loyalty-gold' ? 0.1 : rule === 'wed-special' ? 0.05 : 0),
    0
  );

export function calculatePricePure(
  cart: Cart,
  now: Date,
  tier: LoyaltyTier = 'standard',
  taxRate = 0.1
): PriceResult {
  const subtotal = subtotalFor(cart);
  const applied = appliedRules(now, tier);
  const discount = subtotal * discountRateFor(applied);
  const afterDiscount = Math.max(0, subtotal - discount);
  const tax = afterDiscount * taxRate;
  const total = afterDiscount + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: roundCurrency(discount),
    total: roundCurrency(total),
    applied,
  };
}
