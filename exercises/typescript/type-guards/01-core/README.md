# Type Guards (Core)

## Concept
User-defined type guards (`function isX(x: unknown): x is X`) teach the control-flow analyzer facts at runtime that let you narrow types safely. Combined with assertion functions and `never`, they prevent "lying" predicates and enable exhaustive handling.

## Exercise 01
Implement `isUser`, `isAdmin`, `isPositive` guards + `assertIsPositive`.

Starter has loose or incorrect narrowing.

## Criteria
- Guards must actually narrow (provable in `if (isX(x)) { x.prop }`).
- Must be sound at runtime (no guards that accept bad data but claim the type).
- Use `unknown` input where appropriate.

## Getting Started
```bash
npx vitest run exercises/typescript/type-guards/01-core
# or
npm run validate:exercise -- exercises/typescript/type-guards/01-core
```

After making the tests (including type assertions) pass, review your solution against the Criteria above and the AGENTS.md "TypeScript Type System Basics" section.
