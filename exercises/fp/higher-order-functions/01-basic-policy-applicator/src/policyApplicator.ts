// exercises/fp/higher-order-functions/01-basic-policy-applicator/src/policyApplicator.ts
export interface PolicyInput {
  readonly amount: number;
  readonly userType: 'guest' | 'member';
  readonly region: string;
}

type AmountCalculator = (input: PolicyInput) => number;
type Policy = (calculator: AmountCalculator) => AmountCalculator;

const composePolicies =
  (policies: readonly Policy[]) =>
  (base: AmountCalculator): AmountCalculator =>
    policies.reduce((calculator, policy) => policy(calculator), base);

const baseAmount: AmountCalculator = (input) => input.amount;

const when =
  (predicate: (input: PolicyInput) => boolean, transform: (amount: number) => number): Policy =>
  (calculator) =>
  (input) => {
    const amount = calculator(input);
    return predicate(input) ? transform(amount) : amount;
  };

const withGuestLogging =
  (threshold: number): Policy =>
  (calculator) =>
  (input) => {
    if (input.userType === 'guest' && input.amount > threshold) {
      console.log('high value guest', input.amount);
    }
    return calculator(input);
  };

const policies: readonly Policy[] = [
  when(
    (input) => input.userType === 'member',
    (amount) => amount * 0.9
  ),
  when(
    (input) => input.region === 'EU',
    (amount) => Math.min(amount, 100)
  ),
  withGuestLogging(50),
];

const configuredCalculator = composePolicies(policies)(baseAmount);

export const applyPolicies = (input: PolicyInput): number => configuredCalculator(input);
