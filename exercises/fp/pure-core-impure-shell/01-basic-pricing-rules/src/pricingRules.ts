// exercises/fp/pure-core-impure-shell/01-basic-pricing-rules/src/pricingRules.ts
// STARTER — pure pricing logic mixed with Date.now, Math.random "surprise discount", and fake DB side effect.
// calculatePrice is not referentially transparent.

export interface Cart {
  items: Array<{ sku: string; qty: number; unitPrice: number }>;
  userId: string;
}

export interface PriceResult {
  subtotal: number;
  discount: number;
  total: number;
  applied: string[];
}

export function calculatePrice(
  cart: Cart,
  now: Date = new Date(),
  tier = 'standard',
  taxRate = 0.1
): PriceResult {
  const nowTs = now; // use passed (but still has other impurities like lookup and random for the exercise force)
  const subtotal = cart.items.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  const applied: string[] = [];
  let discount = 0;

  // "loyalty" lookup is side-effecty (pretend db) — ignore passed tier
  const lookedTier = lookupLoyaltyTier(cart.userId);
  if (lookedTier === 'gold') {
    discount += subtotal * 0.1;
    applied.push('loyalty-gold');
  }

  // random surprise
  if (Math.random() < 0.3) {
    const surprise = subtotal * 0.05;
    discount += surprise;
    applied.push('surprise-5%');
    console.log('[PRICING] surprise discount at', nowTs.toISOString());
  }

  // time based (non deterministic without explicit now)
  if (nowTs.getDay() === 3) {
    // wed (getDay 0=Sun ... 3=Wed)
    discount += subtotal * 0.05;
    applied.push('wed-special');
  }

  const afterDiscount = Math.max(0, subtotal - discount);
  const tax = afterDiscount * taxRate;
  const total = afterDiscount + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
    applied,
  };
}

function lookupLoyaltyTier(userId: string): string {
  console.log('[DB] lookup tier for', userId);
  // fake: gold for user starting with 'g'
  return userId.startsWith('g') ? 'gold' : 'standard';
}
