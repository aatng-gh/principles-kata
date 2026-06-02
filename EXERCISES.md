# Exercises Index

Catalog of exercises (20 core + 10 stretches + 12 TypeScript type refresh). See individual READMEs for details. (Originally derived from plan catalog.)
All 20 core have full README + starter src + validating test.
Stretches (03) have full scenario/criteria/expectations in README; no test/starter required.

## OOP (SOLID)

### single-responsibility
- 01-basic-user-profile (full exemplar)
- 02-intermediate-invoice-pipeline
- 03-advanced-reporting-pipeline (stretch)

### open-closed
- 01-basic-discount-engine
- 02-intermediate-export-pipeline
- 03-advanced-plugin-system (stretch)

### liskov-substitution
- 01-basic-employee-hierarchy
- 02-intermediate-asset-valuation
- 03-advanced-collection-hierarchy (stretch)

### interface-segregation
- 01-basic-multifunction-device
- 02-intermediate-ecommerce-admin
- 03-advanced-fine-grained-services (stretch)

### dependency-inversion
- 01-basic-notification-service
- 02-intermediate-order-fulfillment
- 03-advanced-hexagonal-feature (stretch)

## FP

### pure-immutability
- 01-basic-invoice-calculator (full exemplar)
- 02-intermediate-cart-reducer
- 03-advanced-game-state (stretch)

### function-composition
- 01-basic-data-pipeline
- 02-intermediate-validation-railway
- 03-advanced-etl-pipeline (stretch)

### higher-order-functions
- 01-basic-policy-applicator
- 02-intermediate-event-dispatcher
- 03-advanced-middleware-engine (stretch)

### declarative-transformation
- 01-basic-tree-processing
- 02-intermediate-rule-engine
- 03-advanced-ast-evaluator (stretch)

### pure-core-impure-shell
- 01-basic-pricing-rules
- 02-intermediate-order-workflow
- 03-advanced-async-orchestrator (stretch)

Run `npm test -- --passWithNoTests` (or specific path) to execute tests (stretches have none).
Use `npm run validate:exercise -- <path>` for targeted typecheck+lint+test.
See root README for full "How to practice".

## TypeScript Type System (Mid-Level Refresh for OOP + FP)

Concepts that power good design in both paradigms. Each has 01 (core mechanics) + 02 (applied in realistic mixed scenario).

### typescript (Mid-Level Refresh)
**Status note**: All 12 exercises have full content (README + src + tests exercising runtime + expectTypeOf). See `exercises/typescript/README.md` for status (final clean post-swarm: 12/12 files, 35/35 tests passing with no @ts-nocheck vestiges; generics strongest; mapped/conditional etc. tightened for recursion/infer/brand/narrowing per reviews). See AGENTS.md for detailed rubrics (TypeScript Type System Basics + per-concept 1-5 scores).

- [generics/01-core](./exercises/typescript/generics/01-core/) (full)
- [generics/02-applied](./exercises/typescript/generics/02-applied/) (full)
- [conditional-types/01-core](./exercises/typescript/conditional-types/01-core/)
- [conditional-types/02-applied](./exercises/typescript/conditional-types/02-applied/)
- [mapped-types/01-core](./exercises/typescript/mapped-types/01-core/)
- [mapped-types/02-applied](./exercises/typescript/mapped-types/02-applied/)
- [discriminated-unions/01-core](./exercises/typescript/discriminated-unions/01-core/)
- [discriminated-unions/02-applied](./exercises/typescript/discriminated-unions/02-applied/)
- [type-guards/01-core](./exercises/typescript/type-guards/01-core/)
- [type-guards/02-applied](./exercises/typescript/type-guards/02-applied/)
- [branded-types/01-core](./exercises/typescript/branded-types/01-core/)
- [branded-types/02-applied](./exercises/typescript/branded-types/02-applied/)

Use `npm run test:typescript` or the validate script.
These exercises include both runtime tests (vitest) **and** type-level tests (using `expect-type`).
