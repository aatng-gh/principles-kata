# Why this design (generics/02-applied)

- The generic signature `<Args extends unknown[], Return, Key = string>(fn: (...args: Args) => Return, ...)` + returning the same `(...args: Args) => Return` is what allows `expectTypeOf(cached).toEqualTypeOf<typeof expensive>()` to pass with zero casts for the caller.
- Using `this: any` internally (in the reference implementation) + proper application with `.apply(this, args)` is the minimal way to support both bound methods (OOP) and pure functions (FP) without forcing the caller to always `.bind`.
- The custom `key` function is itself generic over `Args`, so inference flows through nicely (see the test with `(id, region) => ...`).
- Deliberately simple cache (no real TTL eviction in the reference) to keep focus on the generic/type preservation aspects that are the point of the exercise.

This is the kind of utility that appears in real mid-level codebases (memoized API clients, cached calculators used from both services and pure mappers, etc.).
