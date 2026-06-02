import { expectTypeOf } from 'expect-type';
import { describe, expect, it } from 'vitest';
import { type Loaded, type Result, unwrapLoaded } from '../src/loaded';

describe('Conditional Types 02 - Loaded<T> (applied, dual paradigm)', () => {
  it('Loaded<T> extracts inner from Promise, Result, Promise<Result>, and plain (type level)', () => {
    type FromPromise = Loaded<Promise<{ id: number }>>;
    type FromResult = Loaded<Result<string, Error>>;
    type FromPromiseResult = Loaded<Promise<Result<{ name: string }, 'fail'>>>;
    type Plain = Loaded<number[]>;

    expectTypeOf<FromPromise>().toEqualTypeOf<{ id: number }>();
    expectTypeOf<FromResult>().toEqualTypeOf<string>();
    expectTypeOf<FromPromiseResult>().toEqualTypeOf<{ name: string }>();
    expectTypeOf<Plain>().toEqualTypeOf<number[]>();
  });

  it('unwrapLoaded has precise signature driven by Loaded<T> (no casts needed at call sites)', () => {
    const plain = { foo: 1 };
    const u1 = unwrapLoaded(plain);
    expectTypeOf(u1).toEqualTypeOf<{ foo: number }>();

    const res: Result<{ user: string }, string> = { ok: true, value: { user: 'ada' } };
    const u2 = unwrapLoaded(res);
    expectTypeOf(u2).toEqualTypeOf<{ user: string }>();

    const promRes = Promise.resolve({ ok: true, value: 42 } as const) as Promise<
      Result<number, 'e'>
    >;
    const u3 = unwrapLoaded(promRes);
    expectTypeOf(u3).toEqualTypeOf<number>();
  });

  it('supports mixed usage: class service method + pure pipeline (types + runtime)', () => {
    // OOP-style class
    class UserService {
      async load(id: number): Promise<Result<{ id: number; name: string }, 'notfound'>> {
        return { ok: true, value: { id, name: `User${id}` } };
      }
    }

    // Pure FP style transformer
    function extractNames(responses: Result<{ name: string }, unknown>[]): string[] {
      return responses.map((r) => {
        const loaded = unwrapLoaded(r);
        // Here loaded is narrowed by the conditional type
        return loaded.name;
      });
    }

    // runtime exercise
    const svc = new UserService();
    // We don't actually await in this test (demo), but we can call the pure
    const fakeResults: Result<{ name: string }, unknown>[] = [
      { ok: true, value: { name: 'Ada' } },
      { ok: true, value: { name: 'Grace' } },
    ];
    const names = extractNames(fakeResults);
    expect(names).toEqual(['Ada', 'Grace']);

    // Type level proof that the class return can be unwrapped to the inner
    type ServiceInner = Loaded<ReturnType<UserService['load']>>;
    expectTypeOf<ServiceInner>().toEqualTypeOf<{ id: number; name: string }>();
  });
});
