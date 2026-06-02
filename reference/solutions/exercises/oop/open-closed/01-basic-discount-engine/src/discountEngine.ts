// Reference good impl for OCP 01 — open via rules, closed core.

export type CustomerTier = 'regular' | 'vip' | 'premium';

export interface DiscountRule {
  applies(tier: CustomerTier, promoCode: string | undefined, basePrice: number): boolean;
  computeDiscount(basePrice: number, tier: CustomerTier, promoCode: string | undefined): number;
}

class VipTierRule implements DiscountRule {
  applies(tier: CustomerTier) {
    return tier === 'vip';
  }
  computeDiscount(base: number) {
    return base * 0.15;
  }
}

class PremiumTierRule implements DiscountRule {
  applies(tier: CustomerTier) {
    return tier === 'premium';
  }
  computeDiscount(base: number) {
    return base * 0.1;
  }
}

class SummerPromoRule implements DiscountRule {
  applies(_tier: CustomerTier, promo?: string) {
    return promo === 'SUMMER20';
  }
  computeDiscount(base: number) {
    return base * 0.2;
  }
}

class LoyalPromoRule implements DiscountRule {
  applies(_tier: CustomerTier, promo?: string) {
    return promo === 'LOYAL10';
  }
  computeDiscount(base: number) {
    return base * 0.1;
  }
}

class CapRule implements DiscountRule {
  applies() {
    return true;
  }
  computeDiscount(base: number, _t: CustomerTier, _p: string | undefined, accumulated: number) {
    // special: used after to cap total
    return 0; // actual cap applied in engine
  }
}

export class DiscountEngine {
  private rules: DiscountRule[] = [
    new VipTierRule(),
    new PremiumTierRule(),
    new SummerPromoRule(),
    new LoyalPromoRule(),
  ];

  register(rule: DiscountRule) {
    this.rules.push(rule);
  }

  calculateDiscountedPrice(basePrice: number, tier: CustomerTier, promoCode?: string): number {
    if (basePrice < 0) throw new Error('Price cannot be negative');

    let totalDiscount = 0;
    for (const rule of this.rules) {
      if (rule.applies(tier, promoCode, basePrice)) {
        totalDiscount += rule.computeDiscount(basePrice, tier, promoCode);
      }
    }
    totalDiscount = Math.min(totalDiscount, 0.5);
    return Math.round(basePrice * (1 - totalDiscount) * 100) / 100;
  }
}
