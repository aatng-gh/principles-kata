// Impure shell — obtains time, loads tier (fake DB), may flip coins for promos, then calls pure core.
// All effects are here. The shell can be small and delegate the real work to pure.

import { type Cart, type PriceResult, calculatePricePure } from './pure';

export async function calculatePrice(cart: Cart, taxRate = 0.1): Promise<PriceResult> {
  const now = new Date();
  const tier = await loadLoyaltyTier(cart.userId); // effect
  // random surprise can be decided here (impure)
  const base = calculatePricePure(cart, now, tier, taxRate);
  if (Math.random() < 0.3) {
    const surprise = Math.round(base.subtotal * 0.05 * 100) / 100;
    console.log('[PRICING] surprise discount at', now.toISOString());
    return {
      ...base,
      discount: base.discount + surprise,
      total: Math.round((base.total - surprise) * 100) / 100, // simplistic
      applied: [...base.applied, 'surprise-5%'],
    };
  }
  return base;
}

async function loadLoyaltyTier(userId: string): Promise<'gold' | 'standard'> {
  console.log('[DB] lookup tier for', userId);
  return userId.startsWith('g') ? 'gold' : 'standard';
}
