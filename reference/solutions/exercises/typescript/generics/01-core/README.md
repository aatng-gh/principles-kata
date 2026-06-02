# Generics (Core Mechanics)

## Concept (mid-level refresh)
Generics let you write code that works with *many* types while still providing full type safety and excellent inference. At a mid level you should be comfortable with:
- Type parameters with constraints (`<T extends Something>`)
- Default type parameters
- Multiple type parameters and their relationships
- How generics interact with inference (when TS can figure them out vs when you must help it)
- Using generics to create reusable "type transformers" that are useful in both class hierarchies and pure function pipelines.

Generics are the foundation for almost every advanced TS feature (conditional types, mapped types, branded types, etc.).

## Why this matters for OOP + FP
- **OOP**: Generic base classes, generic services/repositories, typed dependency injection containers, generic mappers.
- **FP**: Generic `map`/`flatMap`/`pipe` combinators, higher-order functions that preserve input/output types, generic result/error containers.
- Both: Being able to write one piece of logic that is consumed cleanly from a class method *and* from a composition of pure functions without losing type information or resorting to `any`.

## Exercise
Implement a generic `createBuilder<Shape extends object>()` utility.

The builder should support:
- Chained `.set<K extends keyof Shape>(key: K, value: Shape[K])` calls that accumulate the shape.
- A final `.build()` that is only well-typed (returning `Shape`) after *all* keys have been `.set()`. Incomplete builders make `.build()` usage a compile error (using conditional/never tracking). This makes invalid states (missing required fields) unrepresentable.

The goal is excellent inference and type safety:
- You should not be able to set a key that doesn't exist on `Shape`.
- The final built object should have the exact type `Shape` (or `Partial<Shape>` if you choose a partial builder — document your decision in a comment).
- It must be usable both as a fluent OOP-style builder *and* inside pure functions (no mutation of external state in the "core" logic).

## Starter
See `src/builder.ts`. The skeleton has loose types (`any` or `object`) on purpose.

## Criteria
- The public API of the builder must be fully generic and infer `Shape` from usage (or from an initial call).
- No `any` leaks in the implementation or public surface (the test file must type-check cleanly).
- The same builder factory can be used to produce strongly typed objects for both a class-based service and a pure function pipeline without extra casts.
- Adding a new required field to `Shape` should cause a compile error at the `.build()` call site (or on use of the result) if the field was never `.set()`. The type system tracks set keys via an accumulating type parameter.

## Expectations
- Prefer inference. The caller of `createBuilder<User>()` or even better `createBuilder()` with usage-driven inference should get perfect types.
- The implementation should feel like a small, reusable utility you would actually keep in a `utils/` folder on a real mid-level codebase.
- The implementation should use a private accumulating type parameter (e.g. `Builder<Shape, SetKeys>`) so that the API is safe by construction. Document the design briefly in a comment.

## Getting Started
```bash
npx vitest run exercises/typescript/generics/01-core
# or
npm run validate:exercise -- exercises/typescript/generics/01-core
```

After making the tests (including type assertions) pass, review your solution against the Criteria above and the AGENTS.md "TypeScript Type System Basics" section.
