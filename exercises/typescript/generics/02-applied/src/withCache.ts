// exercises/typescript/generics/02-applied/src/withCache.ts
// High quality generic withCache supporting dual paradigms (OOP methods + FP pure fns).
// - Overloads preserve exact signatures including `this` param for methods (no caller .bind required for wrap; supply this at call if extracting unbound method ref).
// - Custom key generic over Args.
// - Async supported transparently (caches the Promise).
// - No `any` in public API; impl uses unknown + one biome-ignored impl sig for overload dispatch (standard, isolated, deliberate for starter; good prod version can use conditional types or ThisType helpers).
// See test for clean class usage demo without bind at wrap time.

function withCache<Args extends unknown[], Return, Key = string>(
  fn: (...args: Args) => Return,
  options?: {
    key?: (...args: Args) => Key;
    ttlMs?: number;
  }
): (...args: Args) => Return;

function withCache<This, Args extends unknown[], Return, Key = string>(
  fn: (this: This, ...args: Args) => Return,
  options?: {
    key?: (this: This, ...args: Args) => Key;
    ttlMs?: number;
  }
): (this: This, ...args: Args) => Return;

// biome-ignore lint/suspicious/noExplicitAny: overload implementation signature only; all public overloads + logic are precise with unknown. This is the isolated deliberate looseness for dual this/args inference.
function withCache(fn: any, options?: any): any {
  const cache = new Map<unknown, unknown>();

  return function (this: unknown, ...args: unknown[]): unknown {
    const keyFn = options?.key ?? ((...a: unknown[]) => JSON.stringify(a) as unknown);
    const key = options?.key
      ? (options.key.apply(this, args) as unknown)
      : (keyFn.apply(this, args) as unknown);

    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

export { withCache };
