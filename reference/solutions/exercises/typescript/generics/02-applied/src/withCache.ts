// Reference solution for generics/02-applied `withCache`
// Preserves exact signature (including `this` for methods and async) while adding caching.

export function withCache<
  Args extends unknown[],
  Return,
  Key = string
>(
  fn: (...args: Args) => Return,
  options?: {
    key?: (...args: Args) => Key;
    ttlMs?: number; // ignored in this simple impl for focus on generics
  }
): (...args: Args) => Return {
  const cache = new Map<Key, Return>();

  return function (this: any, ...args: Args): Return {
    const keyFn = options?.key ?? ((...a: Args) => JSON.stringify(a) as unknown as Key);
    const key = keyFn.apply(this, args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
