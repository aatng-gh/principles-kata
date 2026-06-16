// exercises/typescript/generics/02-applied/src/withCache.ts
// High quality generic withCache supporting dual paradigms (OOP methods + FP pure fns).
// - Overloads preserve exact signatures including `this` param for methods (no caller .bind required for wrap; supply this at call if extracting unbound method ref).
// - Custom key generic over Args.
// - Async supported transparently (caches the Promise).
// - No `any` in public API or implementation.
// See test for clean class usage demo without bind at wrap time.

type CacheableFunction = (this: unknown, ...args: never[]) => unknown;
type RuntimeFunction = (this: unknown, ...args: unknown[]) => unknown;

type CacheOptions<F extends CacheableFunction, Key> = {
  key?: (this: ThisParameterType<F>, ...args: Parameters<OmitThisParameter<F>>) => Key;
  ttlMs?: number;
};

type MockLikeFunction<Args extends unknown[], Return> = ((...args: Args) => Return) & {
  readonly mock: unknown;
};

function withCache<Args extends unknown[], Return, Key = string>(
  fn: MockLikeFunction<Args, Return>,
  options?: {
    key?: (...args: Args) => Key;
    ttlMs?: number;
  }
): (...args: Args) => Return;

function withCache<F extends CacheableFunction, Key = string>(
  fn: F,
  options?: CacheOptions<F, Key>
): F;

function withCache<Key = string>(
  fn: RuntimeFunction,
  options?: {
    key?: (this: unknown, ...args: unknown[]) => Key;
    ttlMs?: number;
  }
): RuntimeFunction {
  const cache = new Map<unknown, { readonly value: unknown; readonly expiresAt?: number }>();

  return function (this: unknown, ...args: unknown[]): unknown {
    const key = options?.key?.call(this, ...args) ?? JSON.stringify(args);
    const hit = cache.get(key);
    const now = Date.now();

    if (hit && (hit.expiresAt === undefined || hit.expiresAt > now)) {
      return hit.value;
    }

    const result = fn.apply(this, args);
    const expiresAt = options?.ttlMs === undefined ? undefined : now + options.ttlMs;
    cache.set(key, expiresAt === undefined ? { value: result } : { value: result, expiresAt });
    return result;
  };
}

export { withCache };
