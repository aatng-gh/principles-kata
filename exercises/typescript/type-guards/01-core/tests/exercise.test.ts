import { expectTypeOf } from 'expect-type';
import { describe, expect, it } from 'vitest';
import {
  type Admin,
  type Person,
  type User,
  assertIsAdmin,
  assertIsPositive,
  isAdmin,
  isPositive,
  isUser,
} from '../src/guards';

describe('Type Guards 01 (core)', () => {
  it('narrows correctly at runtime and type level', () => {
    const adminP: Person = { type: 'admin', name: 'root', permissions: ['*'] };

    if (isAdmin(adminP)) {
      // adminP should be narrowed to Admin (no cast needed; enforced by predicate)
      expectTypeOf(adminP).toEqualTypeOf<Admin>();
      expect(adminP.permissions.length).toBeGreaterThan(0);
    }

    const userP: Person = { type: 'user', name: 'bob' };
    if (isUser(userP)) {
      expectTypeOf(userP).toEqualTypeOf<User>();
    }
    expect(isUser(adminP)).toBe(false);
    expect(isUser(userP)).toBe(true);
  });

  it('assertion function throws on bad data', () => {
    const u: Person = { type: 'user', name: 'bob' };
    expect(() => assertIsAdmin(u)).toThrow();
  });

  it('isPositive and assertIsPositive work (unknown input, sound, narrow)', () => {
    const maybe: unknown = 5;
    if (isPositive(maybe)) {
      expectTypeOf(maybe).toEqualTypeOf<number>();
      expect(maybe).toBe(5);
    }
    expect(isPositive(-3)).toBe(false);
    expect(isPositive('7')).toBe(false);
    expect(() => assertIsPositive(0)).toThrow();
    expect(() => assertIsPositive('x')).toThrow();
    expect(() => assertIsPositive(Number.NaN)).toThrow();
  });
});
