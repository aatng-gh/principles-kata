# Discriminated Unions (Core)

## Concept (mid-level refresh)
Discriminated (or "tagged") unions are the TS way to model "this value is exactly one of several variants". A common discriminant property (usually a literal `kind` or `type`) lets the type checker narrow via `switch` or `if`.

Mid-level skills:
- Designing the union so that variants are mutually exclusive and exhaustive checking is possible (`never` case).
- Using the discriminant for control flow that gives you the right properties in each arm.
- `satisfies` for ensuring a value conforms without widening.
- Making sure adding a new variant forces updates (or is handled) everywhere a switch exists.

## Why for OOP + FP
- **OOP**: event hierarchies, command objects, strategy selection, error types (instead of throwing everything as Error).
- **FP**: modeling data as ADT (Result, Option, Expr, Command), pattern matching via switch, exhaustive reducers.
- Both: the same union can be produced by a class factory method and consumed in a pure `match` function with full narrowing in each.

## Exercise
Model a simple `Shape` union:
- Circle { kind: 'circle'; radius: number }
- Square { kind: 'square'; side: number }
- Rectangle { kind: 'rectangle'; w: number; h: number }

Implement:
- `getArea(shape: Shape): number`
- `describe(shape: Shape): string`
- A small `assertNever(x: never): never` helper to get exhaustiveness errors at compile time.

The starter will use a loose `{ kind: string; ... }` or `type Shape = any` or if/else without proper narrowing.

## Starter
`src/shapes.ts`

## Criteria
- The union is properly discriminated (literal on a field that differs per variant).
- `getArea` and `describe` use `switch (s.kind)` (or equivalent) and narrow correctly; no `as` or property access outside guard.
- Exhaustiveness: adding a new variant (e.g. Triangle) causes a compile error in the functions *unless* you add the case (using the never helper).
- No `any`.

## Expectations
- Use `as const` on the kind literals in the object literals inside tests/impl if helpful.
- The functions are small and total (no runtime "unknown kind").
- Test file has @ts-expect-error cases for non-exhaustive and for bad variant shapes.

## Getting Started
```bash
npx vitest run exercises/typescript/discriminated-unions/01-core
npm run validate:exercise -- exercises/typescript/discriminated-unions/01-core
```

Reference AGENTS.md "TypeScript Type System Basics" (exhaustive never, precise literals, usable from OOP and FP sites).
