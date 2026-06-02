import { expectTypeOf } from 'expect-type';
import { describe, expect, it, vi } from 'vitest';
import { withCache } from '../src/withCache';

describe('Generics 02 - withCache (applied dual paradigm)', () => {
  it('caches a pure function and preserves its exact type (runtime + types)', () => {
    const base = (a: number, b: string): { sum: number; label: string } => ({
      sum: a + b.length,
      label: b.toUpperCase(),
    });
    const expensive = vi.fn(base);

    const cached = withCache(expensive);

    // Type of cached must be identical to the base fn (not the mock wrapper)
    expectTypeOf(cached).toEqualTypeOf<typeof base>();

    const r1 = cached(10, 'hello');
    const r2 = cached(10, 'hello');

    expect(r1).toEqual({ sum: 15, label: 'HELLO' });
    expect(expensive).toHaveBeenCalledTimes(1); // second call was cached
    expect(r2).toBe(r1); // same reference for cache hit
  });

  it('works on class methods while preserving method signature and this', () => {
    class Calculator {
      private calls = 0;

      compute(x: number, y: number): number {
        this.calls++;
        return x * y + this.calls;
      }

      getCallCount() {
        return this.calls;
      }
    }

    const calc = new Calculator();
    // Clean usage: wrap the method ref directly (no .bind hack at call site).
    // The overload preserves `this: Calculator`. To invoke (when not calling as method on instance),
    // supply this via .call (or .apply); demonstrates the this param in dual-paradigm API.
    const cachedCompute = withCache(calc.compute);

    expectTypeOf(cachedCompute).toEqualTypeOf<(this: Calculator, x: number, y: number) => number>();

    const a = cachedCompute.call(calc, 3, 4);
    const b = cachedCompute.call(calc, 3, 4);

    expect(a).toBe(b);
    expect(calc.getCallCount()).toBe(1);
  });

  it('supports custom key function with good inference', () => {
    const baseFetch = (id: number, region: string) => ({ id, region, name: `User${id}` });
    const fetchUser = vi.fn(baseFetch);

    const cached = withCache(fetchUser, {
      key: (id, region) => `${region}:${id}`,
    });

    expectTypeOf(cached).toEqualTypeOf<typeof baseFetch>();

    cached(1, 'eu');
    cached(1, 'eu');
    expect(fetchUser).toHaveBeenCalledTimes(1);
  });

  it('handles async functions correctly (type + behavior)', async () => {
    const load = vi.fn(async (url: string): Promise<{ data: string }> => ({ data: url }));

    const cached = withCache(load);

    expectTypeOf(cached).toEqualTypeOf<(url: string) => Promise<{ data: string }>>();

    const p1 = cached('/api/1');
    const p2 = cached('/api/1');

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toBe(r2);
    expect(load).toHaveBeenCalledTimes(1);
  });
});
