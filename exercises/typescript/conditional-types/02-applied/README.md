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
- Recursion for one level of Promise (to support `Loaded<Promise<Result<U,E>>> → U`); uses `Loaded<U>` in the Promise arm.
- Distributive behavior where sensible (naked type param).
- Array case is deliberately omitted: `Loaded<number[]>` must resolve to `number[]` (not `number`), unlike `ExtractInner` which does unwrap arrays. Plain data arrays and other non-wrapper values fall through.
- The type is used to drive signatures of helpers (`unwrapLoaded`) that work for both the class and the pure fn examples with no casts at call sites.
- No `any` in the final public types (including no `any` in infer positions like `Result<infer U, any>` — use `unknown` + structural narrowing or equivalent). Runtime demo stubs may use biome-ignore + comment for the contained `as any` / `as unknown as`.
- Invalid "unwrap a non-wrapper as if it were" is prevented by the fallback (caller still gets original type).
- Same generic utility is ergonomic and type-safe when used from a class method *and* inside a pure function composition/pipeline.

## Expectations
- Clean names: `Loaded`, `unwrapLoaded`, `Result`.
- The same `Loaded<UserResponse>` works whether `UserResponse` came from `await service.load()` (OOP) or from a mapped array in a pipeline (FP) — callers get exact inner without manual casts in good code.
- Test file (with its `expectTypeOf`) must pass with zero extra casts or `as any` inside the test code itself (pure `expectTypeOf<...>().toEqualTypeOf<...>()`).
- Inference is leveraged: callers rarely annotate.
- Adding fields or changing the Result shape causes appropriate compile errors at use sites.
- See AGENTS.md "TypeScript / Conditional Types + infer / 01-core + 02-applied" and "TypeScript Type System Basics" for full rubric (precise infer, no any escape, dual-paradigm, expectTypeOf pass without casts from caller).

## Getting Started
```bash
npx vitest run exercises/typescript/conditional-types/02-applied
# or
npm run validate:exercise -- exercises/typescript/conditional-types/02-applied
```

After making tests (runtime + type) green, self-review vs Criteria + AGENTS.md "TypeScript Type System Basics".
