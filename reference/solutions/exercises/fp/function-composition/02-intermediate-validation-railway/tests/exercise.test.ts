// Reference copy of the test (passes against the good railway impl).
import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../lib/result';
import { type FormInput, processRegistration } from '../src/validationRailway';

describe('processRegistration reference (railway)', () => {
  it('accepts valid and normalizes', () => {
    const res = processRegistration({ name: ' Alice ', email: 'ALICE@EX.COM', age: 30 });
    expect(isOk(res)).toBe(true);
    if (isOk(res)) expect(res.value.normalizedEmail).toBe('alice@ex.com');
  });

  it('short circuits on first error', () => {
    const res = processRegistration({ name: '', email: 'bad', age: 5 });
    expect(isErr(res)).toBe(true);
    if (isErr(res)) expect(res.error).toMatch(/name/);
  });
});
