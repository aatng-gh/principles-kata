# TypeScript Type System Lab (Mid-Level Refresh)

This lab refreshes **advanced-but-practical TypeScript type system features** that are essential for writing clean, safe code in both Object-Oriented and Functional styles.

**Target audience**: Mid-level software engineers who know the basics (interfaces, basic generics, `any` is bad) but want to level up their type-fu for real design work.

**Goal**: By the end you will be comfortable using the type system as a tool for:
- Expressing invariants that the compiler enforces (preventing bugs at compile time)
- Building reusable, ergonomic APIs that work great whether you prefer classes or pure functions
- Reducing `any` / `as` escapes and improving inference

Each concept is intended to have **two exercises** (01-core mechanics + 02-applied in a realistic mixed OOP/FP scenario). 

**Current status (final 2026-06-01)**: 
All 12 exercises have README+src+tests with runtime+expectTypeOf. All pass cleanly (12/12 files, 35/35 tests) under `npm run test:typescript` and global typecheck; generics is the strongest exemplar. Others were tightened for recursion/infer/brand/narrowing per reviews. Validate works (lint noise expected on deliberate starter loose code via biome-ignores; tsc global clean; no @ts-nocheck vestiges left in test harnesses).

The lab is now substantially complete and usable as a mid-level refresh. The 6 concepts directly unlock patterns in the OOP/FP design exercises (Result unions/guards, readonly data, generic services, exhaustive state, nominal IDs, safe narrowing). See individual exercise READMEs and AGENTS.md for per-concept details.

All exercises aim at mid-level practical application (not intro material).

## How to Practice

Same process as the rest of the repo (run commands from repo root):
1. Read the concept's README.md (in the relevant `01-core/` or `02-applied/` folder) — pay special attention to Criteria and Expectations.
2. Implement / fix in `src/` (the starter is intentionally loose to invite the bad patterns the rubrics penalize).
3. Run `npx vitest run exercises/typescript/<concept>/<NN-name>` to execute (includes runtime vitest + type `expectTypeOf` checks).
4. Use `npm run validate:exercise -- exercises/typescript/<concept>/<NN-name>` for the full gate (typecheck + lint + test).
5. Self-review against the Criteria in the README + the detailed rubrics/anti-patterns in AGENTS.md.
6. For external feedback, include your solution + reasoning when asking a reviewer to apply AGENTS.md (TypeScript Type System Basics section).

All exercises are designed so that a "working" runtime solution with poor types will either:
- Fail the type-level expectations in the test file, or
- Force ugly `any` / casts that the judge will penalize.

Starters use deliberate loose/any (and sometimes `object` etc) to tempt bad designs (covered by biome-ignores in src/). Tests use targeted `@ts-expect-error` (and expectTypeOf) to exercise bad paths + good narrowing/positive cases. All test files type-check cleanly under strict settings with zero @ts-nocheck; good solutions pass `tsc` (global clean) and the test's expectTypeOf without extra casts in test/impl. See AGENTS.md for details on what the judge looks for.

## Concepts

- [generics](./generics/)
- [conditional-types](./conditional-types/)
- [mapped-types](./mapped-types/)
- [discriminated-unions](./discriminated-unions/)
- [type-guards](./type-guards/)
- [branded-types](./branded-types/)

These are deliberately the features that unlock the *design patterns* practiced in the OOP and FP sections of this repo.

## References & Solutions

See `reference/solutions/exercises/typescript/...` (reveal only after review).

## Tips for Mid-Level Engineers

- Prefer inference over explicit annotations where possible.
- Use the type system to make *illegal states unrepresentable*.
- The same feature (e.g. generics + conditional) can make a class hierarchy or a pure function pipeline dramatically safer and more pleasant.
- Always ask: "If someone passes the wrong thing here, will the compiler catch it?"

Good luck — this is the type-level foundation that makes the higher-level design principles actually enforceable in TypeScript.
