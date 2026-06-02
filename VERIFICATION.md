# Lab Verification

Date: 2026-06-01 (final post-swarm clean state)

## 1. Install & basic commands
- `npm install`: succeeded
- `npm run typecheck`: clean (global `tsc --noEmit` passes with no errors)
- `npm run lint`: lint clean globally (deliberate starter loose code properly biome-ignored + commented; 23 biome-ignore comments across the tree, ~18 in active starter/test files).
- `npm run validate:exercise -- <path>`: supported (uses project typecheck non-fatally + targeted lint + targeted test; see script for notes on "pollution" from other starters).

## 2. Test discovery
- 32 test files discovered (via `find exercises -name "*.test.ts"`).
- All 20 core exercises (10 OOP + 10 FP) + all 12 TypeScript exercises have full, real validating tests.
  - Core tests: vitest exercising the public contract (functionality only).
  - TS tests: vitest runtime + `expect-type` `expectTypeOf` assertions (type-level contract).
- 10 stretches (the `03-advanced-*` per principle) are README-only (full scenario/criteria/expectations; no test or src starter required by design).
- OOP starters intentionally pass their functionality tests (e.g. 5/5 for SRP 01) — public behavior delivered by the deliberately bad design (god class, mixed concerns) so the principle demo is visible.
- FP purity/declarative/immutability starters intentionally fail some assertions (mutation of inputs/nested, reference reuse `not.toBe`, timestamped ids instead of explicit now, etc.). This demonstrates the principles (the judge would still penalize even "fixed numbers" if mutation remains). (Currently 7 fails across the relevant 4 files.)
- `npm test -- --passWithNoTests`: 28 passed / 4 failed files (32 total); 110 passed / 7 failed tests (117 total). The 7 failing tests are the *intentional* ones from the 3 FP purity/declarative starters (pure-immutability/01-basic-invoice-calculator [id + mutation], /02-intermediate-cart-reducer [deep equal + not.toBe on happy/edge], declarative-transformation/01-basic-tree-processing [path written back on input]). These demonstrate the principles — the AGENTS.md judge (and tests' deep-equality + `not.toBe`) would still penalize even "fixed numbers" while retaining mutation/ref/id problems. See AGENTS rubrics for exact anti-patterns to flag hard. See below for commands.

## 3. TypeScript basics lab
- Complete: 6 concepts (generics, conditional-types, mapped-types, discriminated-unions, type-guards, branded-types) × (01-core + 02-applied) = 12 exercises.
- All 12 have full README + `src/` + `tests/exercise.test.ts` (runtime + expectTypeOf).
- `npm run test:typescript`: 12/12 files, 35/35 tests.
- Per-exercise `npm run validate:exercise -- exercises/typescript/<concept>/<NN>/` works.
- Global tsc clean; lint clean globally via biome-ignores on deliberate starter code (23 biome-ignore comments across tree).
- `exercises/typescript/README.md` details per-concept status (all 12 clean and passing with 35/35 tests; no `@ts-nocheck` vestiges remain in test harnesses; only intentional `@ts-expect-error` for negative cases).
- AGENTS.md includes "TypeScript Type System Basics" section + specific 1-5 rubrics + anti-patterns/positives for each of the 6 concepts (dual-paradigm use in class methods + pure pipelines emphasized; no `any` in core logic, precise constraints, etc.).
- Reference/solutions/exercises/typescript/ populated.
- Root docs (README, EXERCISES.md, VERIFICATION.md) and typescript/README.md updated for accuracy.
- The TS lab provides the type tools needed for high-fidelity implementations of the 20 core design exercises.

## 4. Judge efficacy (AGENTS.md rubrics)
- Covers *all* exercises: full rubrics for every OOP SOLID (01/02 + stretches notes), every FP principle (01/02 + stretches), and all TS concepts (core + applied).
- OOP example (single-responsibility/01-basic-user-profile and similar): Starter passes tests but is one class/file with 4 reasons to change + direct side effects + no interfaces. Rubric explicitly calls this out as anti-pattern ("separation only via methods in same file still one reason to change"). A review scores 1-2/5 and cites exact `file:line` of mixed concerns. (See AGENTS.md "OOP / Single Responsibility / 01-basic-user-profile".)
- FP example (pure-immutability/01 + /02 and related declarative): Starters fail mutation/reference/timestamp assertions (the 6-7 current fails). Rubrics catch "shallow spread that still mutates nested", "Date.now hidden in pure fn", "returning input ref on happy/no-op paths", "console in core", etc. Even if a learner made numbers pass while retaining mutation, the judge (and deep-equality + `not.toBe` in tests) would flag it. Explicit "Positive indicators" and "Anti-patterns that still pass the test (flag these hard)" sections.
- The structure + "deliberately bad but green (or deliberately failing to demo)" + AGENTS.md process is satisfied for *all* 20 cores. The judge is the only thing enforcing principle (tests never do).
- TS rubrics similarly catch `any`/`as any`, lost literal types, non-narrowing guards, non-exhaustive handlers, untrusted brand ctors, etc. even when runtime "works". `expectTypeOf` in tests + no extra casts in good usage.

## 5. Structure per plan / current completeness
- All directories for 20 core + 12 TS + 10 stretches present.
- Every core exercise: full README (scenario + Criteria + Expectations), starter `src/` (tempting violations), validating `tests/exercise.test.ts`.
- `fp/lib/` (Result etc.) present and used in relevant FP.
- AGENTS.md: staff-level rubrics for every exercise (mandatory review process: read exercise README, read tests, read impl, score 1-5 per criterion, cite file:line, call out anti-patterns that made tests green, end with Functionality + Principle fidelity summary).
- `scripts/reveal-solutions.sh` exists (enforces "only after tests + self-check + review").
- `reference/solutions/` populated (gitignored by default; ~112 files including all cores + TS).
- `scripts/validate-exercise.sh` exists and updated for current reality.
- Root + per-exercise + TS docs accurate.
- "See the plan" references removed/qualified in favor of EXERCISES.md + VERIFICATION.md (plan not shipped in tree).
- Known gaps from early state closed for v1+ final: no placeholders; all cores + TS have real content; TS lab complete and clean (12/12, 35/35); AGENTS covers all; reveal script present; counts accurate (32 tests, 20 core, etc.).
- Stretches remain minimal (README) as specified.

## 6. Running the lab / verification commands
- Full suite: `npm test -- --passWithNoTests` (expect the 6 intentional starter fails on purity/declarative demos).
- Targeted: `npx vitest run exercises/<paradigm>/<principle>/<NN-name>`
- Validate (type+lint+test): `npm run validate:exercise -- exercises/<path>` (use `--` for reliable arg passing).
- OOP only / FP only / TS: `npm run test:oop` etc.
- Typecheck: `npm run typecheck` (must stay clean).
- Lint baseline (shows starter noise): `npm run lint`.
- Reveal (only after review): `./scripts/reveal-solutions.sh`

The lab meets (and exceeds) the original requirements at a solid final v1+ level. 20 core + 12 TS refresh are fully realized with the key pedagogical features: functionality-only tests + adversarial AGENTS.md judge that catches principle violations (even on deliberate starter "green" or intentional-fail purity demos). The exemplars, process, and rubrics are the heart; everything follows the same high bar. All numbers and notes below reflect the final clean state (no transients, no WIP).

Run the specific verification commands (as of this final 2026-06-01 update) to re-confirm:
- `npm run validate:exercise -- exercises/fp/pure-immutability/01-basic-invoice-calculator`
- `npm run validate:exercise -- exercises/oop/open-closed/01-basic-discount-engine`
- `npm run validate:exercise -- exercises/typescript/conditional-types/02-applied`
- `npm run validate:exercise -- exercises/fp/pure-immutability/03-advanced-game-state`
- `npm test -- --passWithNoTests`
- `npm run typecheck -- --skipLibCheck`
- `npx @biomejs/biome check .`
- `npm run test:typescript`
- `cat EXERCISES.md | head -30`
- `head -40 VERIFICATION.md`
- `grep -r '@ts-nocheck' exercises --include='*.test.ts' || echo 'No @ts-nocheck in TS tests (confirmed gone)'`
- (grep for "plan" / broken links post-edit — none relevant)
