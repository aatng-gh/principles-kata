# Discriminated Unions (Core)

## Concept
Tagged unions (`{ kind: 'foo'; ... } | { kind: 'bar'; ... }`) + literal discriminants enable safe variants and exhaustive `switch` (using `never` for the default arm).

## Exercise 01
Model a small `Request` or `Shape` union and write an exhaustive handler.

Starter has non-exhaustive or `any` fallbacks.

## Criteria
- Adding a variant causes compile error in the handler until handled.
- `never` exhaustiveness is used (no `default: throw` that swallows new cases).
- Narrowing works per arm.

## Getting Started
```bash
npx vitest run exercises/typescript/discriminated-unions/01-core
# or
npm run validate:exercise -- exercises/typescript/discriminated-unions/01-core
```

After making the tests (including type assertions) pass, review your solution against the Criteria above and the AGENTS.md "TypeScript Type System Basics" section.
