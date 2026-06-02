# Mapped Types (Core)

## Concept
Mapped types let you create new types by *transforming* the properties of an existing type: `{ [K in keyof T]: ... }`, with modifiers like `readonly`, `?`, and key remapping (`as`).

Mid-level: you should be able to write custom mapped types (not just `Partial<T>`) and understand how they compose with other type features.

## Exercise (01)
Implement a `DeepReadonly<T>` and a `Mutable<T>` (the reverse) that work recursively on objects and arrays.

Also provide a small runtime `deepFreeze` (typed with your `DeepReadonly`) that actually freezes the value.

## Starter
`src/deep.ts`

## Criteria
- `DeepReadonly<T>` must recurse into nested objects and arrays (but not into primitives, functions, Dates, etc. — decide and document the cutoff).
- The mapped type must use `readonly` modifier on properties and produce `readonly` arrays.
- The runtime `deepFreeze` must actually deeply freeze and return the `DeepReadonly<T>` in the type system.
- No `any` (use biome-ignore only in deliberate starter parts).
- The same DeepReadonly type is useful for freezing data in a class property *and* for a pure fn that returns frozen snapshots.

See the test for exact expectations on what should and should not become readonly.

## Getting Started
```bash
npx vitest run exercises/typescript/mapped-types/01-core
# or
npm run validate:exercise -- exercises/typescript/mapped-types/01-core
```

See AGENTS.md TypeScript section for judging (recursive mapped precision, stop conditions for non-plain objects, no any, dual use of DeepReadonly).
