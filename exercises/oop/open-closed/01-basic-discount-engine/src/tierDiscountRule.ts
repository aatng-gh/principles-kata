import type { CustomerTier, DiscountContext, DiscountRule } from './discountEngine';

export class TierDiscountRule implements DiscountRule {
  constructor(
    private readonly tier: CustomerTier,
    private readonly rate: number
  ) {}

  applies(context: DiscountContext): boolean {
    return context.tier === this.tier;
  }

  discountRate(): number {
    return this.rate;
  }
}
