# Mapped Types (Applied - Deep Readonly + Safe Updates + Derived Updaters, Dual Paradigm)

## Scenario
You have a config or state object that must remain deeply readonly when passed around (FP pipelines love this for safety and sharing), but you also need a way to produce updated versions (common in both class "withX" / wither methods and pure update/reducer fns). Additionally, derive "updaters" shape (setters) via mapped key remapping for ergonomic mutation APIs while keeping the core data deeply readonly.

The same DeepReadonly, deep update, and derived Public/Updaters must be usable inside a class *and* in standalone pure functions/pipelines without `any` or casts in caller code.

## Exercise 02
- Re-use / import `DeepReadonly` (and `Mutable` if helpful) from the 01-core sibling.
- Implement / improve `deepUpdate` (in `src/update.ts`) that performs a *deep* merge using the recursive `DeepPartial`, always returns a fresh `DeepReadonly<T>`, never mutates the `base`.
- Implement `Public<T>` and `Updaters<T>` (in `src/mappedStore.ts`) using mapped types + key remapping (`as`) + template literals (`set${Capitalize<...>}`) to strip private keys and derive optional setter methods.
- The `createUpdaters` (and a readonly-aware wrapper) wires them; demo may mutate for wiring simplicity but the deepUpdate path must be immutable.
- Update tests to exercise the combination: deepUpdate in reducer + class withX, plus mappedStore Public/Updaters, with strong expectTypeOf roundtrips.

## Starter
See `src/update.ts` and `src/mappedStore.ts` — deliberately loose with `any`, shallow update, identity Public/Updaters.

## Criteria
- `DeepReadonly<T>` (from 01) recurses objects + arrays (readonly elements); cuts off at primitives / functions / Date / RegExp / Map/Set etc. (documented).
- `deepUpdate(base: DeepReadonly<T>, patch: DeepPartial<T>): DeepReadonly<T>` builds new object(s) for changed paths; original `base` (and its nested) is untouched (deep equality + reference checks in spirit).
- No `any` in the update logic or public mapped types (biome-ignores + comments only for contained demo wiring in create*).
- `Public<T>` and `Updaters<T>` use mapped remapping; adding/removing keys on the source shape updates the derived types automatically.
- The utilities (deepUpdate + updaters) are used from a class method (e.g. `withCount`) *and* a pure reducer fn, with full type safety and no casts required from the caller in the test.
- Test file uses pure `expectTypeOf().toEqualTypeOf<DeepReadonly<...>>()` etc; no `toEqualTypeOf<any>()`.
- Roundtrip: DeepReadonly after update, and Public/Updaters derived precisely (e.g. no private keys leak).

## Expectations
- Deep partial updates work for nested (e.g. meta.version); arrays/objects handled per DeepPartial.
- Adding a new top-level key to AppState or Settings automatically requires no change to update/mapped impls (beyond perhaps wiring).
- Same `deepUpdate` call site works for frozen snapshot from pure code and from `this.current` inside a service class.
- `createReadonlyUpdaters` (or equivalent) accepts DeepReadonly<S> for the view.
- See AGENTS.md "TypeScript / Mapped Types / 01-core + 02-applied" and "TypeScript Type System Basics": recursive mapped precision, stop conditions, deep updates not mutate, dual use, expectTypeOf without extra casts, no any.
- README/Criteria in 02 should be as rich as 01-core.

## Getting Started
```bash
npx vitest run exercises/typescript/mapped-types/02-applied
# or
npm run validate:exercise -- exercises/typescript/mapped-types/02-applied
```

After green, self-review vs Criteria + AGENTS.md.
