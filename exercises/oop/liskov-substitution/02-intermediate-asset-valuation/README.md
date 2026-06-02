# Liskov Substitution Principle — Intermediate: Asset Valuation

## Principle (recap)
Subtypes must be substitutable for their base types. Clients that program to the base `Asset` (or `Asset[]`) must continue to work correctly, with the same or stronger guarantees, when any subtype (including future derivatives) is introduced. No hidden requirements, no new exceptions in common paths, no mutation of inputs, and the "value" and "risk" concepts must mean the same thing across the hierarchy so that batch totals and risk aggregates remain valid.

## Scenario
A portfolio valuation engine holds Stocks, Bonds, Options, and RealEstate. The `ValuationService` currently contains type checks and special-case logic for "complex" assets (options need volatility adjustment, real-estate uses appraisal that can be stale). A new exotic derivative is coming; adding it will require touching the batch total and risk functions again, and the current special cases already make it unsafe to treat an `Option` as a plain `Asset` in some client code (different meaning of "value", possible mutation during valuation).

## Functional Requirements
- Each asset kind has a `getValue(): number` (current market or model value of the position) and `getRisk(): number` (0-10 scale).
- `ValuationService` provides `totalValue(assets: Asset[]): number` and `aggregateRisk(assets: Asset[]): number` (e.g. weighted or max).
- The numbers must be deterministic for a given asset state (no Date.now / random inside value()).
- "Complex" rules (option pricing model, real-estate appraisal factor) must be honored.
- Adding a new `Derivative` (or any future subtype) must not require editing `ValuationService`, the existing asset classes, or the aggregate formulas; the new subtype just implements the base contract correctly and the batch numbers stay valid for old assets.

## Starter (what you are given)
See `src/assetValuation.ts` — base `Asset`, four subtypes, and a `ValuationService` that mixes simple reduce with `instanceof` special cases for Option/RealEstate (plus mutation of an internal "lastValued" on some assets). The provided tests exercise individual values and the current batch outputs (which the specials produce).

## Criteria (principle-specific success bar — this is what the judge will score)
- After the changes, `totalValue(assets)` and `aggregateRisk` are simple, uniform operations over `Asset` (no `instanceof`, no casts, no per-type branches in the service).
- Every subtype (including ones added later) produces a `getValue()` and `getRisk()` that can be summed/aggregated directly; the numeric contribution of Stock/Bond/Option/RealEstate in a mixed batch is identical before and after the refactoring.
- No asset mutates itself or caller data during `getValue`/`getRisk`.
- A brand-new `Derivative` subtype can be dropped into any existing `Asset[]` passed to the service and the old assets' contributions to total/risk are completely unaffected (and correct).
- The special pricing/appraisal logic lives inside the relevant subtype (or a strategy it owns), not in the batch service.

## Expectations (code quality + demonstration)
- Narrow `Asset` base or interface with `getValue(): number` and `getRisk(): number` (and perhaps `readonly` data).
- Subtypes implement the methods; any "model" complexity (Black-Scholes stub for option, cap-rate for RE) stays in the subtype.
- `ValuationService` becomes a few lines of reduce / math using only the base methods.
- If a true modeling difference exists (e.g. option value is really "exposure" vs "premium"), the subtype returns the number that makes uniform aggregation correct; clients never branch.
- Precise types, no `any`, prefer readonly, no side effects in getters.
- The test's batch assertions continue to produce the exact same numbers for the same input mix (proving old behavior preserved while enabling safe extension).
- Bonus: include a tiny example `NewDerivative` (even if not registered in the main test) showing it works in the service with zero changes elsewhere.

## Getting Started
```bash
# from repo root
npx vitest run exercises/oop/liskov-substitution/02-intermediate-asset-valuation
```

## How the judge will evaluate
See the rubric for this exercise in `AGENTS.md` (section "OOP / Liskov Substitution / 02-intermediate-asset-valuation").
Tests check individual asset numbers plus batch totals/risk for a representative mix. The judge will be harsh on any remaining `instanceof` or "if complex asset" logic in the service (even if it makes the current numbers match). It will look for whether a new derivative could be added by only writing the new class.

## After you are done
1. Make tests green.
2. Run the 4-point self-calibration checklist from the root README.
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial").
4. Only after receiving the review, reveal `reference/solutions/exercises/oop/liskov-substitution/02-intermediate-asset-valuation/` and compare designs.
