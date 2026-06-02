# Type Guards (Core)

## Concept
User-defined type guards (`function isX(v: unknown): v is X`) are how you teach the TS checker your own runtime checks. After a successful guard the variable is narrowed in the `true` branch (including inside `if` and `Array.filter` etc).

Mid-level: write correct (non-lying) guards for primitives, objects, branded, and your own DUs. Understand `is` vs just `boolean` return.

## Why for OOP+FP
- **OOP**: validating inputs to constructors/services, `instanceof` alternatives for your own types, guard methods on value objects.
- **FP**: predicates for `filter`, `partition`, `find` in pipelines that also narrow the element type for the rest of the expression.
- Both: one guard defined once is usable in a class `if (isUser(raw)) this.user = raw` and in `const users = unknowns.filter(isUser)`.

## Exercise
Implement a family of guards:
- `isString(x: unknown): x is string`
- `isNumber(x: unknown): x is number`
- `isNonEmptyString(x: unknown): x is string` (and non-empty)
- `isPlainObject(x: unknown): x is Record<string, unknown>`
- `isShape(x: unknown): x is Shape` (reusing or defining a small DU from shapes or inline)

Also `isResultOk` for the Result type.

## Starter
`src/guards.ts` — probably all return `boolean` or use `any`.

## Criteria
- Every guard uses the `param is Type` return annotation.
- Guards must be correct at runtime (the predicate implies the type).
- Usable in both filter (FP narrowing) and if (OOP narrowing).
- No lying guards (e.g. isString that returns true for numbers).
- No `any` in the finished guards.

## Expectations
- Tests include runtime truthy cases + the narrowing in subsequent code (expectTypeOf inside the if).
- @ts-expect-error after a guard for properties that shouldn't exist on the narrowed.

## Getting Started
```bash
npx vitest run exercises/typescript/type-guards/01-core
npm run validate:exercise -- exercises/typescript/type-guards/01-core
```
