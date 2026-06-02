# Conditional Types (Applied - Dual Paradigm Result/Promise Flattening)

## Scenario
You are implementing a small data access layer that must feel natural from both:
- Class-based services (OOP style: `UserService` methods that return wrapped async results)
- Pure function pipelines (FP style: `map` / `chain` over collections of responses, extracting inners without losing type info)

A very common pattern is "I got a `Promise<Result<User, ApiError>>` or a plain `Result` from somewhere — give me the `User` type safely".

You will use conditional types + `infer` to build a `Loaded<T>` extractor and corresponding runtime helpers. The same utilities must be usable inside a class method *and* in a standalone pure mapper without casts or `any`.

## Exercise
Implement in `src/loaded.ts`:

- `type Result<T, E = unknown> = ...` (or reuse a simple one)
- `type Loaded<T> = ...` — a conditional type using `infer` that "flattens" one layer:
  - `Loaded<Promise<U>>` → `U`
  - `Loaded<Result<U, E>>` → `U`
  - `Loaded<Promise<Result<U, E>>>` → `U`  (one level of each)
  - `Loaded<U>` → `U` (fallback)
- Small runtime helpers:
  - `unwrapLoaded<T>(value: T): Loaded<T>` (typed using the conditional; runtime can be a demo stub or real for sync cases)
  - Perhaps `mapLoaded` or just the unwrap for demo.

The helpers and type must be precise enough that:
- A class method declared to return `Promise<Result<Something>>` can have its result unwrapped in typed way.
- A pure `function process(responses: Result<User>[]): User[]` uses the type.

## Starter
See `src/loaded.ts` — deliberately loose `any`/identity types and unsafe unwraps.

## Criteria
- `Loaded<T>` is built with conditional types and `infer` (no hand-written conditional for each case that duplicates).
- Distributive behavior where sensible.
- The type is used to drive signatures of helpers that work for both the class and the pure fn examples.
- No `any` in the final public types or in the solution implementation (stubs in starter are allowed with biome ignore).
- Invalid "unwrap a non-wrapper as if it were" is prevented by the fallback (caller still gets original type).

## Expectations
- Clean names: `Loaded`, `unwrapLoaded`, `Result`.
- The same `Loaded<UserResponse>` works whether `UserResponse` came from `await service.load()` or from a mapped array in a pipeline.
- Test file (with its `expectTypeOf`) must pass with zero extra casts or `as` inside the test code.
- Inference is leveraged: callers rarely annotate.

## Getting Started
```bash
npx vitest run exercises/typescript/conditional-types/02-applied
npm run validate:exercise -- exercises/typescript/conditional-types/02-applied
```

After making tests (runtime + type) green, self-review vs Criteria + AGENTS.md "TypeScript Type System Basics".
