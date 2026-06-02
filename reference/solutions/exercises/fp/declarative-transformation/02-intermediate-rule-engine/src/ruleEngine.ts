// Reference good implementation — rules as data (AST) + small pure recursive interpreter.
// Why this design: the policy is now *values* you can print, diff, A/B test, or load from JSON.
// The interpreter (evalCondition + decide) is tiny, pure, recursive on the union, and exhaustive.
// Adding a rule = add a data literal (or new union variant + 3 lines in eval). No mutation, no early
// returns in the "engine", no console in core. Matches the "model rules as data + pure interpreters" force.

export interface Facts {
  readonly age: number;
  readonly hasLicense: boolean;
  readonly isPremium: boolean;
  readonly purchaseAmount: number;
}

export interface Decision {
  readonly approved: boolean;
  readonly discount: number;
  readonly reason: string;
}

export type Condition =
  | { kind: 'ageLt'; n: number }
  | { kind: 'hasLicense' }
  | { kind: 'isPremium' }
  | { kind: 'amountGt'; n: number }
  | { kind: 'and'; left: Condition; right: Condition }
  | { kind: 'not'; inner: Condition };

export function evalCondition(c: Condition, f: Facts): boolean {
  switch (c.kind) {
    case 'ageLt':
      return f.age < c.n;
    case 'hasLicense':
      return f.hasLicense;
    case 'isPremium':
      return f.isPremium;
    case 'amountGt':
      return f.purchaseAmount > c.n;
    case 'and':
      return evalCondition(c.left, f) && evalCondition(c.right, f);
    case 'not':
      return !evalCondition(c.inner, f);
    default: {
      const _exhaustive: never = c;
      return false;
    }
  }
}

function fixNot(c: Condition): Condition {
  if (c.kind === 'not') return { kind: 'not', inner: c.inner };
  return c;
}

export function decide(f: Facts): Decision {
  // rules as data (first match wins)
  const rules: Array<{ when: Condition; then: Omit<Decision, 'approved'> }> = [
    { when: { kind: 'ageLt', n: 18 }, then: { discount: 0, reason: 'underage' } },
    {
      when: {
        kind: 'and',
        left: { kind: 'not', inner: { kind: 'hasLicense' } },
        right: { kind: 'amountGt', n: 100 },
      },
      then: { discount: 0, reason: 'needs license for large purchase' },
    },
    { when: { kind: 'isPremium' }, then: { discount: 0.2, reason: 'premium' } },
    { when: { kind: 'amountGt', n: 200 }, then: { discount: 0.1, reason: 'bulk' } },
    { when: { kind: 'ageLt', n: 999 }, then: { discount: 0.05, reason: 'standard' } }, // always-true fallback (age never 999+)
  ];

  for (const r of rules) {
    if (evalCondition(r.when, f)) {
      return {
        approved:
          r.then.reason !== 'underage' && r.then.reason !== 'needs license for large purchase',
        ...r.then,
      };
    }
  }
  return { approved: false, discount: 0, reason: 'no rule' };
}

export function evaluatePolicy(facts: Facts): Decision {
  // thin pure wrapper; console would be in shell
  return decide(facts);
}
