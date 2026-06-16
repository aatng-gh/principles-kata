// Impure shell: gathers effects (clock, "DB" lookup which logs) then delegates to pure core.
// Never put decision logic here. This is the only place that may call Date, console, async lookups.
// See pure.ts for the referentially transparent calculatePricePure.

import type { Cart, LoyaltyTier, PriceResult } from './pure';
import { calculatePricePure } from './pure';

export async function calculatePriceShell(
  cart: Cart,
  taxRate = 0.1,
  now: Date = new Date()
): Promise<PriceResult> {
  const tier = await lookupLoyaltyTier(cart.userId);
  return calculatePricePure(cart, now, tier, taxRate);
}

async function lookupLoyaltyTier(userId: string): Promise<LoyaltyTier> {
  console.log('[DB] lookup tier for', userId);
  return userId.startsWith('g') ? 'gold' : 'standard';
}

// calculatePrice is an alias to the pure fn (4-arg deterministic signature) to preserve
// the exact public test contract while keeping pure/shell physically separated.
export const calculatePrice = calculatePricePure;
