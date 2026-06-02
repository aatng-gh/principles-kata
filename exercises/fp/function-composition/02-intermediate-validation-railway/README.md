# Function Composition — Intermediate: Validation Railway

## Principle (recap)
Multi-stage processing (especially with possible failure) is expressed as a pipeline of small pure stages. Failures short-circuit cleanly (railway-oriented: success track vs failure track) without mutable accumulators. A new rule is added by inserting one stage.

## Scenario
A user registration form validator is a single function with early returns and a mutable `errors: string[]` bag. It does name/email/age checks then loyalty enrichment. Adding "must have valid promo if over 65" or a new "canonicalize phone" step requires hunting through the ifs and the bag logic, and error paths are easy to get wrong.

## Functional Requirements
- `processForm(input)` returns Result<ValidatedForm, string[]> .
- On success: name trimmed, email lower, tier enriched from promo.
- On failure: at least the validation errors for the bad fields.
- Happy and error cases both exercised by tests.

## Starter (what you are given)
See `src/validationRailway.ts` — the mixed validation + enrichment in one fn using mutable errors array.

## Criteria (principle-specific)
- Each validation/enrichment is a separate 3-8 line pure fn: e.g. `validateName`, `validateEmail`, `validateAge`, `enrichLoyaltyTier`.
- The flow is expressed with railway composition (using Result's flatMap or a `pipe` that understands Result short-circuit).
- Adding the 5th rule (e.g. `validatePromoForAge`) is "add one fn + one line in the top-level pipeline" — no edits to other stages or the error bag.
- No mutable error list anywhere in the pure stages; errors are carried in the Err track.

## Expectations
- Import and use the shared `Result` from `../../lib/result`.
- Stages are referentially transparent; side effects (if any stubs) only at the very edges.
- The compose site is obvious (a chain of flatMap or a `flow`/`pipe` helper).
- Individual stages are trivial to test in isolation.
- Error path stops at first (or collects if designed that way, but short-circuits the happy stages).

## Getting Started
```bash
npx vitest run exercises/fp/function-composition/02-intermediate-validation-railway
```

## How the judge will evaluate
See AGENTS.md rubric for "FP / Function Composition / 02-intermediate-validation-railway".
Tests check happy output and that errors are returned. The judge will flag any solution that still has a `const errors = []` + push + early return, or one 70-line function with stage comments.

## After you are done
1. Make tests green.
2. Run the 4-point self-calibration checklist from the root README.
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial").
4. Only after receiving the review, reveal `reference/solutions/exercises/fp/function-composition/02-intermediate-validation-railway/` and compare designs.
