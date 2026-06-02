// Reference good implementation — policies built and composed via higher-order functions.
// Why this design: the *shape* of "apply only if...", "log when applying", "never exceed" is captured once in
// the HOFs. Concrete business rules (loyalty %, promo %) become plain data or tiny fns passed to the HOFs.
// computeFee reuses the exact same HOFs + a different base + different cap. Adding "student only if not vip"
// is a new predicate + wrap, no if duplication. Pure, no hidden mutation.

export interface UserContext {
  readonly tier: 'standard' | 'premium' | 'vip';
  readonly hasPromo: boolean;
}

export type Policy = (price: number, ctx: UserContext) => number;

export function withLogging(label: string): (p: Policy) => Policy {
  return (policy: Policy) => (price, ctx) => {
    const result = policy(price, ctx);
    if (result !== price) {
      console.log(`[POLICY] applied ${label}`);
    }
    return result;
  };
}

export function withCap(max: number): (p: Policy) => Policy {
  return (policy: Policy) => (price, ctx) => {
    const after = policy(price, ctx);
    return after > max ? max : after;
  };
}

export function withCondition(pred: (ctx: UserContext) => boolean): (p: Policy) => Policy {
  return (policy: Policy) => (price, ctx) => (pred(ctx) ? policy(price, ctx) : price);
}

function identity(price: number): number {
  return price;
}

function loyaltyDiscount(price: number, ctx: UserContext): number {
  if (ctx.tier === 'premium') return price * 0.9;
  if (ctx.tier === 'vip') return price * 0.8;
  return price;
}

function promoDiscount(price: number, ctx: UserContext): number {
  return ctx.hasPromo ? price * 0.95 : price;
}

export function computeFinalPrice(basePrice: number, ctx: UserContext): number {
  const policy = withCap(1000)(
    withLogging('promo 5%')(withCondition((c) => c.hasPromo)(promoDiscount))
  )(withLogging('loyalty')(withCondition((c) => c.tier !== 'standard')(loyaltyDiscount))(identity));
  // or build list and reduce: but above shows HOF wrapping
  return Math.round(policy(basePrice, ctx) * 100) / 100;
}

// Fee uses same HOF vocabulary, different base + cap
function vipFeeHalver(fee: number, ctx: UserContext): number {
  return ctx.tier === 'vip' ? fee * 0.5 : fee;
}
function promoZeroFee(fee: number, ctx: UserContext): number {
  return ctx.hasPromo ? 0 : fee;
}

export function computeFee(base: number, ctx: UserContext): number {
  const feePolicy = withCap(50)(withCondition((c) => c.hasPromo)(promoZeroFee))(
    withCondition((c) => c.tier === 'vip')(vipFeeHalver)(identity)
  );
  return feePolicy(base, ctx);
}
