import type { DiscountContext, DiscountRule } from './discountEngine';

export class PromoDiscountRule implements DiscountRule {
  constructor(
    private readonly promoCode: string,
    private readonly rate: number
  ) {}

  applies(context: DiscountContext): boolean {
    return context.promoCode === this.promoCode;
  }

  discountRate(): number {
    return this.rate;
  }
}
