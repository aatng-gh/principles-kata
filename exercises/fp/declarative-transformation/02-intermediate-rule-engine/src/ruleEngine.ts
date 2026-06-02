// exercises/fp/declarative-transformation/02-intermediate-rule-engine/src/ruleEngine.ts
// STARTER — long imperative function with mutation of context/flags and early exits.
// Rules are "code" not data; adding rule means editing the big fn.

export interface Facts {
  age: number;
  hasLicense: boolean;
  isPremium: boolean;
  purchaseAmount: number;
}

export interface Decision {
  approved: boolean;
  discount: number;
  reason: string;
}

export function evaluatePolicy(facts: Facts): Decision {
  let approved = false;
  let discount = 0;
  let reason = 'default';

  // imperative + mutation + early-ish
  if (facts.age < 18) {
    approved = false;
    reason = 'underage';
    return { approved, discount, reason };
  }

  if (!facts.hasLicense && facts.purchaseAmount > 100) {
    approved = false;
    reason = 'needs license for large purchase';
    return { approved, discount, reason };
  }

  approved = true;
  if (facts.isPremium) {
    discount = 0.2;
    reason = 'premium';
  } else if (facts.purchaseAmount > 200) {
    discount = 0.1;
    reason = 'bulk';
  } else {
    discount = 0.05;
    reason = 'standard';
  }

  // side effecty in "engine"
  console.log('[RULES] decided', reason, discount);

  return { approved, discount, reason };
}
