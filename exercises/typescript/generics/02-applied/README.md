# Generics (Applied - Dual Paradigm)

## Scenario
You need a reusable `memoize` / `withCache` utility that can be applied to:
- Methods on classes (OOP services, repositories, clients)
- Standalone pure functions (FP pipelines, reducers, calculators)

The utility must preserve the original function's parameter and return types perfectly (including generics on the function itself), support custom key generation, and be safe to use in both styles without `any` or losing type information.

This is a very common mid-level need: you want one caching primitive that doesn't force you into a particular paradigm.

## Exercise
Implement `withCache` (or `memoize`) with the following signature goal (you can adjust slightly for ergonomics, but document the tradeoffs):

```ts
function withCache<
  Args extends unknown[],
  Return,
  Key = string
>(
  fn: (...args: Args) => Return,
  options?: {
    key?: (...args: Args) => Key;
    ttlMs?: number;
  }
): (...args: Args) => Return;
```

Requirements / acceptance:
- Calling the wrapped function with the same arguments (per key) returns the cached result.
- The returned function has *exactly* the same type as the original `fn` (parameter types + return type).
- It works when the original `fn` is a method (you may need to handle `this` correctly or provide a bound version).
- It works when the original is a pure function.
- Custom key function is optional and itself generic over the args.
- No `any` in the public API or core implementation.

## Starter
See `src/withCache.ts`.

## Criteria
- A class method wrapped with `withCache` remains usable as a method (correct `this` or documented workaround) and callers get the original method signature.
- A pure function wrapped with `withCache` can be used in a pipeline / composition with full type inference on the result.
- Adding a new overload or generic parameter to the original function still works on the cached version without casts.
- The implementation itself demonstrates good generic hygiene (constraints, inference points, etc.).

## Expectations
- The solution is something you would be happy to put in a real `utils/cache.ts` or `lib/memoize.ts`.
- Both the OOP usage example and the FP usage example in the test file type-check and run without extra type assertions from the *caller*.
- Consider edge cases like async functions (returning `Promise`), functions with no args, functions that return `void` or `never`.

## Getting Started
```bash
npx vitest run exercises/typescript/generics/02-applied
# or
npm run validate:exercise -- exercises/typescript/generics/02-applied
```

After success, compare your generic design decisions with the reference (only after review).
