import { describe, expect, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import { isNonEmptyString, isNumber, isPlainObject, isResultOk, isShape, isString, Result } from '../src/guards';

describe('Type Guards 01 - Core guards', () => {
  it('primitive guards narrow (type) and are correct (runtime)', () => {
    const val: unknown = 'hello';
    if (isString(val)) {
      expectTypeOf(val).toEqualTypeOf<string>();
      expect(val.toUpperCase()).toBe('HELLO');
    }

    const n: unknown = 42;
    if (isNumber(n)) {
      expectTypeOf(n).toEqualTypeOf<number>();
      expect(n.toFixed(2)).toBe('42.00');
    }

    expect(isString(123)).toBe(false);
    expect(isNumber('x')).toBe(false);
  });

  it('isNonEmptyString and isPlainObject narrow correctly', () => {
    const s: unknown = 'foo';
    if (isNonEmptyString(s)) {
      expectTypeOf(s).toEqualTypeOf<string>();
      expect(s.length).toBeGreaterThan(0);
    }

    const obj: unknown = { a: 1 };
    if (isPlainObject(obj)) {
      expectTypeOf(obj).toEqualTypeOf<Record<string, unknown>>();
      expect('a' in obj).toBe(true);
    }

    expect(isNonEmptyString('')).toBe(false);
    expect(isPlainObject([])).toBe(false);
  });

  it('isShape narrows a DU-like and isResultOk narrows Result', () => {
    const maybe: unknown = { kind: 'circle', radius: 3 };
    if (isShape(maybe)) {
      // after guard we know it's "shape-ish"
      expectTypeOf(maybe).toMatchTypeOf<{ kind: string }>();
      expect((maybe as any).kind).toBe('circle');
    }

    const r: Result<number, string> = { ok: true, value: 7 };
    if (isResultOk(r)) {
      expectTypeOf(r.value).toEqualTypeOf<number>(); // note: isResultOk on the union narrows to the ok variant in good impl
      expect(r.value).toBe(7);
    }
  });

  it('usable in FP filter (narrows the array element type)', () => {
    const mixed: unknown[] = ['a', 1, 'b', null, 'c'];
    const strings = mixed.filter(isString);
    expectTypeOf(strings).toEqualTypeOf<string[]>();
    expect(strings).toEqual(['a', 'b', 'c']);
  });
});
