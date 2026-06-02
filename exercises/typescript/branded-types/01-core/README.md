# Branded Types (Core)

## Concept
Branded (phantom/opaque) types give you nominal typing on top of TS structural system. You intersect a base type with a unique "brand" (usually a unique symbol or string literal that never exists at runtime) so that `UserId` and `PostId` (both `string` at runtime) are distinct at compile time.

This is one of the best tools for "make illegal states unrepresentable" with zero runtime cost.

## Exercise 01
Implement `brand<T, B extends string>(value: T): Branded<T, B>` (or using unique symbol for stronger branding) and the `Branded` type.

Provide `asUserId` / `asPostId` trusted constructors.

The starter allows raw strings to be used as IDs (mixing risk).

## Criteria
- `UserId` cannot be assigned to `PostId` (and vice versa) even though both are string at runtime.
- Only the branded constructor can produce a value of the branded type (no direct `{...} as UserId` from raw data in good code).
- The brand has no observable runtime cost.

## Getting Started
```bash
npx vitest run exercises/typescript/branded-types/01-core
# or
npm run validate:exercise -- exercises/typescript/branded-types/01-core
```

After making the tests (including type assertions) pass, review your solution against the Criteria above and the AGENTS.md "TypeScript Type System Basics" section.
