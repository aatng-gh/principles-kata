// exercises/oop/open-closed/01-basic-discount-engine/src/discountEngine.ts
// STARTER — if/else chain for tiers and promos (closed for extension).

export type CustomerTier = 'regular' | 'vip' | 'premium';

export class DiscountEngine {
  calculateDiscountedPrice(basePrice: number, tier: CustomerTier, promoCode?: string): number {
    if (basePrice < 0) throw new Error('Price cannot be negative');

    let discount = 0;

    // Tier discounts (if/else — the violation)
    if (tier === 'vip') {
      discount += 0.15;
    } else if (tier === 'premium') {
      discount += 0.1;
    } else {
      discount += 0.0;
    }

    // Promo codes (more ifs)
    if (promoCode === 'SUMMER20') {
      discount += 0.2;
    } else if (promoCode === 'LOYAL10') {
      discount += 0.1;
    }

    // Cap at 50%
    discount = Math.min(discount, 0.5);

    return Math.round(basePrice * (1 - discount) * 100) / 100;
  }
}
