// exercises/fp/declarative-transformation/02-intermediate-rule-engine/tests/exercise.test.ts
import { describe, expect, it } from 'vitest';
import { type Facts, evaluatePolicy } from '../src/ruleEngine';

describe('ruleEngine (declarative intermediate)', () => {
  it('approves premium with good discount', () => {
    const d = evaluatePolicy({ age: 30, hasLicense: true, isPremium: true, purchaseAmount: 50 });
    expect(d.approved).toBe(true);
    expect(d.discount).toBeCloseTo(0.2);
  });

  it('rejects underage immediately', () => {
    const d = evaluatePolicy({ age: 17, hasLicense: true, isPremium: false, purchaseAmount: 10 });
    expect(d.approved).toBe(false);
    expect(d.reason).toMatch(/underage/);
  });

  it('requires license for >100', () => {
    const d = evaluatePolicy({ age: 25, hasLicense: false, isPremium: false, purchaseAmount: 150 });
    expect(d.approved).toBe(false);
  });

  it('gives bulk discount for large non-premium', () => {
    const d = evaluatePolicy({ age: 40, hasLicense: true, isPremium: false, purchaseAmount: 300 });
    expect(d.discount).toBeCloseTo(0.1);
  });
});
