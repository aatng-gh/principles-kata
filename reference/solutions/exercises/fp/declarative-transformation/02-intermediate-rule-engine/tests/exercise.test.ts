// Reference copy of the test (passes against the good AST interpreter).
import { describe, expect, it } from 'vitest';
import { type Facts, evaluatePolicy } from '../src/ruleEngine';

describe('ruleEngine reference (data + interpreter)', () => {
  it('decides via rules data', () => {
    const d = evaluatePolicy({ age: 30, hasLicense: true, isPremium: true, purchaseAmount: 50 });
    expect(d.approved).toBe(true);
    expect(d.discount).toBeCloseTo(0.2);
  });
});
