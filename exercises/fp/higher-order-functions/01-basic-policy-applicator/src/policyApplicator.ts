// exercises/fp/higher-order-functions/01-basic-policy-applicator/src/policyApplicator.ts
// STARTER — duplicated if/else and loops for conditional policies.

export interface PolicyInput {
  amount: number;
  userType: 'guest' | 'member';
  region: string;
}

export function applyPolicies(input: PolicyInput): number {
  let result = input.amount;

  // discount if member
  if (input.userType === 'member') {
    result = result * 0.9;
  }

  // cap for certain region
  if (input.region === 'EU') {
    result = Math.min(result, 100);
  }

  // log sometimes
  if (input.userType === 'guest' && input.amount > 50) {
    console.log('high value guest', input.amount);
  }

  return result;
}
