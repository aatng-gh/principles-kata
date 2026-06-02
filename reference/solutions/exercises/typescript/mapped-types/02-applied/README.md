# Mapped Types (Applied - Dual Paradigm: Derived Updaters & Public Views)

## Scenario
Many real systems have a "domain model" (often a class or rich interface) and also need derived "updater" or "patch" types and "public projection" types for APIs or pure transforms.

You will use mapped types (with key remapping `as`, template literal types, and modifiers) to derive:

- A `Public<T>` that strips "private" keys (those starting with `_`)
- An `Updaters<T>` mapped type that for each public field `K` produces a `set${Capitalize<K>}` method signature.

These derived types are then used both:
- Inside a class (the `Store` "entity" or service can be typed against the derived updaters)
- In pure functions (a `applyPatches` or factory that builds an updater object from a state shape)

This is extremely common for reducing boilerplate while keeping types precise and paradigm-agnostic.

## Exercise
In `src/mappedStore.ts`:

- Given a state shape e.g. `interface AppState { user: User; count: number; ... }`
- Define `type Public<T> = ...` using mapped + `as` remapping to drop keys matching `_${string}`
- Define `type Updaters<T> = { [K in keyof T as `set${Capitalize<string & K>}` ]?: (value: T[K]) => void  ... }` (or required)
- Provide a small runtime `createUpdaters<T>(target: T): Updaters<T>` that returns an object with the setter fns (they mutate or return new depending on style; here we can do in-place for the class demo).
- The class can use `keyof` etc, but the point is the mapped types give the shape.

Make sure a pure function can also consume an `Updaters<SomeState>` without seeing the private fields.

## Starter
`src/mappedStore.ts` has very loose `Record<string, any>` etc.

## Criteria
- Uses key remapping (`as`) and template literals in the mapped type.
- `Public<T>` correctly excludes underscore keys at type level (and test proves it).
- The derived `Updaters` is used as the type for both a method collection in a class *and* as param/return in a pure function.
- No `any` in the produced types.
- Adding a new public field to the base shape automatically gives a new `setX` in the derived type (no manual maintenance).

## Expectations
- Prefer `as const` / satisfies where helpful for literal keys.
- The implementation feels like a real "type factory" you would use to avoid hand-writing setters for every model.
- Test uses `expectTypeOf` to prove e.g. that `setUser` exists but `_internal` does not appear in the updaters type.

## Getting Started
```bash
npx vitest run exercises/typescript/mapped-types/02-applied
npm run validate:exercise -- exercises/typescript/mapped-types/02-applied
```
