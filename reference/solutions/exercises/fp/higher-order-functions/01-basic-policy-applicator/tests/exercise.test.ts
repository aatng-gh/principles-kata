// Reference copy of the test (passes against the good HOF impl).
import { describe, expect, it } from 'vitest';
import { type UserContext, computeFee, computeFinalPrice } from '../src/policyApplicator';

describe('policyApplicator reference (HOFs)', () => {
  const vip: UserContext = { tier: 'vip', hasPromo: false };
  const premiumPromo: UserContext = { tier: 'premium', hasPromo: true };

  it('computes via composed policies', () => {
    expect(computeFinalPrice(200, premiumPromo)).toBeCloseTo(171);
    expect(computeFee(100, vip)).toBeCloseTo(50);
  });
});
