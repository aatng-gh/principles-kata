import { describe, expect, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import { ExtractInner, Result, unwrapPromise, unwrapResult } from '../src/unwrap';

describe('Conditional Types 01 - ExtractInner + unwrap (core)', () => {
  it('ExtractInner correctly unwraps common containers (type level)', () => {
    type P = ExtractInner<Promise<{ user: string }>>;
    type R = ExtractInner<Result<number, string>>;
    type A = ExtractInner<string[]>;
    type Plain = ExtractInner<{ raw: true }>;

    expectTypeOf<P>().toEqualTypeOf<{ user: string }>();
    expectTypeOf<R>().toEqualTypeOf<number>();
    expectTypeOf<A>().toEqualTypeOf<string>();
    expectTypeOf<Plain>().toEqualTypeOf<{ raw: true }>();
  });

  it('unwrap helpers have precise signatures based on the conditional type', () => {
    // These calls must type-check with the extracted type
    const userPromise = Promise.resolve({ id: 1 });
    const unwrappedP = unwrapPromise(userPromise); // in real usage you'd await, here for type

    expectTypeOf(unwrappedP).toEqualTypeOf<{ id: number }>();

    const okResult: Result<string, Error> = { ok: true, value: 'success' };
    const val = unwrapResult(okResult);
    expectTypeOf(val).toEqualTypeOf<string>();
  });
});
