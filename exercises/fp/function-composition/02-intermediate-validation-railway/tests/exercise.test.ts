// exercises/fp/function-composition/02-intermediate-validation-railway/tests/exercise.test.ts
import { describe, expect, it } from 'vitest';
import { isErr, isOk, unsafeUnwrap } from '../../../lib/result';
import { type FormInput, processForm } from '../src/validationRailway';

describe('validationRailway (composition intermediate)', () => {
  it('happy path enriches tier and normalizes', () => {
    const input: FormInput = {
      name: ' Alice ',
      email: 'ALICE@EX.COM',
      age: 30,
      promoCode: 'LOYAL',
    };
    const res = processForm(input);
    expect(isOk(res)).toBe(true);
    const v = unsafeUnwrap(res);
    expect(v.name).toBe('Alice');
    expect(v.email).toBe('alice@ex.com');
    expect(v.tier).toBe('loyal');
  });

  it('collects multiple errors (but in starter may stop early)', () => {
    const input: FormInput = { name: 'A', email: 'no-at', age: 5 };
    const res = processForm(input);
    expect(isErr(res)).toBe(true);
    if (isErr(res)) {
      expect(res.error.length).toBeGreaterThan(0);
    }
  });

  it('fails on bad email alone', () => {
    const res = processForm({ name: 'Bob', email: 'bob', age: 25 });
    expect(isErr(res)).toBe(true);
  });
});
