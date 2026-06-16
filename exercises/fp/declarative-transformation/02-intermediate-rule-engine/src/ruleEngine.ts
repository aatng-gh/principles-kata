// exercises/fp/declarative-transformation/02-intermediate-rule-engine/src/ruleEngine.ts
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

type NumberFact = 'age' | 'purchaseAmount';
type BooleanFact = 'hasLicense' | 'isPremium';

type Predicate =
  | { readonly kind: 'lessThan'; readonly fact: NumberFact; readonly value: number }
  | { readonly kind: 'greaterThan'; readonly fact: NumberFact; readonly value: number }
  | { readonly kind: 'isTrue'; readonly fact: BooleanFact }
  | { readonly kind: 'not'; readonly predicate: Predicate }
  | { readonly kind: 'and'; readonly predicates: readonly Predicate[] };

interface Rule {
  readonly when: Predicate;
  readonly decision: Decision;
}

const reject = (reason: string): Decision => ({ approved: false, discount: 0, reason });

const approve = (discount: number, reason: string): Decision => ({
  approved: true,
  discount,
  reason,
});

const evaluatePredicate = (predicate: Predicate, facts: Facts): boolean => {
  switch (predicate.kind) {
    case 'lessThan':
      return facts[predicate.fact] < predicate.value;
    case 'greaterThan':
      return facts[predicate.fact] > predicate.value;
    case 'isTrue':
      return facts[predicate.fact];
    case 'not':
      return !evaluatePredicate(predicate.predicate, facts);
    case 'and':
      return predicate.predicates.every((child) => evaluatePredicate(child, facts));
    default: {
      const exhaustive: never = predicate;
      return exhaustive;
    }
  }
};

const rules: readonly Rule[] = [
  {
    when: { kind: 'lessThan', fact: 'age', value: 18 },
    decision: reject('underage'),
  },
  {
    when: {
      kind: 'and',
      predicates: [
        { kind: 'not', predicate: { kind: 'isTrue', fact: 'hasLicense' } },
        { kind: 'greaterThan', fact: 'purchaseAmount', value: 100 },
      ],
    },
    decision: reject('needs license for large purchase'),
  },
  {
    when: { kind: 'isTrue', fact: 'isPremium' },
    decision: approve(0.2, 'premium'),
  },
  {
    when: { kind: 'greaterThan', fact: 'purchaseAmount', value: 200 },
    decision: approve(0.1, 'bulk'),
  },
];

const defaultDecision = approve(0.05, 'standard');

export const evaluatePolicy = (facts: Facts): Decision =>
  rules.find((rule) => evaluatePredicate(rule.when, facts))?.decision ?? defaultDecision;
