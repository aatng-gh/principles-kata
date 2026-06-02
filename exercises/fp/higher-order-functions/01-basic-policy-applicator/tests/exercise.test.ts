// exercises/fp/higher-order-functions/01-basic-policy-applicator/tests/exercise.test.ts
import { describe, expect, it, vi } from 'vitest';
import { PolicyInput, applyPolicies } from '../src/policyApplicator';

describe('policyApplicator (HOF basic)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('applies member discount', () => {
    const res = applyPolicies({ amount: 100, userType: 'member', region: 'US' });
    expect(res).toBeCloseTo(90);
  });

  it('caps EU', () => {
    const res = applyPolicies({ amount: 200, userType: 'guest', region: 'EU' });
    expect(res).toBe(100);
  });

  it('logs for high guest', () => {
    applyPolicies({ amount: 60, userType: 'guest', region: 'US' });
    expect(console.log).toHaveBeenCalled();
  });

  it('no log for low guest', () => {
    applyPolicies({ amount: 10, userType: 'guest', region: 'US' });
    expect(console.log).not.toHaveBeenCalled();
  });
});
