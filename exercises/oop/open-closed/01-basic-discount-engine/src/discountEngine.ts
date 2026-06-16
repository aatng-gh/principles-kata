// exercises/oop/open-closed/01-basic-discount-engine/src/discountEngine.ts
// Open/Closed: concrete rules extracted to small modules (tierDiscountRule.ts, promoDiscountRule.ts).
// Engine and registration stay here; adding a rule = new file + update to createDefault or a register call.
import { PromoDiscountRule } from './promoDiscountRule';
import { TierDiscountRule } from './tierDiscountRule';

export type CustomerTier = string;

export { TierDiscountRule } from './tierDiscountRule';
export { PromoDiscountRule } from './promoDiscountRule';

export interface DiscountContext {
  readonly basePrice: number;
  readonly tier: CustomerTier;
  readonly promoCode?: string;
}

export interface DiscountRule {
  applies(context: DiscountContext): boolean;
  discountRate(context: DiscountContext): number;
}

export function createDefaultDiscountRules(): DiscountRule[] {
  return [
    new TierDiscountRule('vip', 0.15),
    new TierDiscountRule('premium', 0.1),
    new PromoDiscountRule('SUMMER20', 0.2),
    new PromoDiscountRule('LOYAL10', 0.1),
  ];
}

export class DiscountEngine {
  private readonly rules: DiscountRule[];
  private readonly maxDiscountRate: number;

  constructor(
    rules: readonly DiscountRule[] = createDefaultDiscountRules(),
    maxDiscountRate = 0.5
  ) {
    this.rules = [...rules];
    this.maxDiscountRate = maxDiscountRate;
  }

  register(rule: DiscountRule): void {
    this.rules.push(rule);
  }

  calculateDiscountedPrice(basePrice: number, tier: CustomerTier, promoCode?: string): number {
    if (basePrice < 0) throw new Error('Price cannot be negative');

    const context: DiscountContext =
      promoCode === undefined ? { basePrice, tier } : { basePrice, tier, promoCode };
    const discount = Math.min(
      this.rules
        .filter((rule) => rule.applies(context))
        .reduce((total, rule) => total + rule.discountRate(context), 0),
      this.maxDiscountRate
    );

    return Math.round(basePrice * (1 - discount) * 100) / 100;
  }
}
