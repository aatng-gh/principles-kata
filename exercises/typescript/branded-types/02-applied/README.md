# Branded Types (Applied - Dual Paradigm)

## Concept
Branded (phantom/opaque) types give nominal typing on top of TS's structural system with zero runtime cost. The 01-core provides the `Branded<T, B>` type and `brand` helper + trusted `as*Id` constructors.

This exercise ensures the same mechanism works ergonomically and safely for both OOP (class methods) and FP (pure pipelines), and that brands are not lost on returns or storage.

## Scenario
You have a system with User and Order entities. IDs are strings at runtime, but you want the type system to prevent accidentally using a `UserId` where an `OrderId` is required (or passing raw strings from untrusted sources like forms/JSON).

The same branding utility (re-exported or re-applied from core) must work cleanly:
- Inside a class-based `UserService` (OOP style, with methods like register/getName).
- Inside pure functions that compose (e.g. `formatUserRef` used in mappers/reducers).

## Exercise 02
Extend/re-apply the 01 branding:

- Define `UserId` / `OrderId` using the core `Branded`.
- Provide `asUserId` / `asOrderId` (trusted ctors only way to produce branded from raw string).
- Implement `UserService` class that stores and looks up using branded IDs.
- Implement a pure `formatUserRef(id: UserId, name: string)` .

Starter allows raw/wrong-brand mixing and uses casts for Map keys + templates.

## Criteria
- `UserId` and `OrderId` are not assignable to each other (or to plain `string`).
- Raw strings or wrong-brand IDs cause compile errors when passed to `getName` / `formatUserRef` (in both class and pure contexts).
- Only trusted constructors (`asUserId` etc.) or the service's `register` boundary can produce branded values; direct casts from raw in domain code are prevented (or isolated+commented).
- The brand is phantom (no runtime observable property or cost in good usage).
- Brand is not lost on return from class method or pure fn.
- Storage (e.g. Map) and string coercion use isolated, documented escapes only; domain logic stays branded.
- The utility is ergonomic for class methods *and* pure function composition.

## Expectations
- Test uses `@ts-expect-error` for wrong-brand and raw-string cases (no casts to "cheat" the negative tests).
- `expectTypeOf` on returns from service and pure fn.
- The test file type-checks cleanly (no `@ts-nocheck`; only intentional @ts-expect-error for negative cases remain).
- Legacy starter files (e.g. product.ts) are not part of the exercised solution.

## Getting Started
```bash
npx vitest run exercises/typescript/branded-types/02-applied
npm run validate:exercise -- exercises/typescript/branded-types/02-applied
```

After making the tests (including type assertions) pass, review your solution against the Criteria above, the 01-core, and the AGENTS.md "Branded Types" and "TypeScript Type System Basics" sections.
