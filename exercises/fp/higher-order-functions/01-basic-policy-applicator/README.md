# Higher-Order Functions — Basic: Policy Applicator

## Principle (recap)
Functions are values. Higher-order functions take or return other functions, enabling reusable, configurable policies (with logging, predicates, caps, retries) without duplicating the application logic or the if-guards.

## Scenario
Pricing or eligibility logic repeats the same pattern: "if user is member apply discount, if region EU cap, if high-value guest log". These guards and transforms are copy-pasted or if-laddered in multiple places. Adding "if vip then double cap" means touching every site.

## Functional Requirements
- `applyPolicies(input)` applies the current set of rules (member 10% off, EU cap 100, guest>50 log) and returns final amount.
- Logs are side effects for observability in tests.
- Behavior for the 4 test cases must hold.

## Starter (what you are given)
See `src/policyApplicator.ts` — single function with the three ifs mixed together.

## Criteria (principle-specific)
- Policies are expressed as HOFs: e.g. `withMemberDiscount(baseFn)`, `withEUCAP(baseFn)`, `withGuestLogging(baseFn, threshold)`.
- Or `applyWithPolicies(baseCalc, [withDiscount('member', 0.1), withCap('EU', 100), ...])`.
- The core amount logic is a small fn; policies wrap it.
- New policy (e.g. "senior extra 5%") is a new HOF or config entry; no change to existing applicator or base calc.

## Expectations
- HOFs are small, named, return a new function of the same shape.
- Composition is visible and declarative (the list of policies or nested with* calls).
- Logging HOF is a classic cross-cut example.
- Predicate-based policies (only apply if region==) use another HOF or param.
- Tests pass; the policy application order is explicit.

## Getting Started
```bash
npx vitest run exercises/fp/higher-order-functions/01-basic-policy-applicator
```

## How the judge will evaluate
See AGENTS.md. Tests check outputs + log side effects. The judge will deduct for any solution that still has the three ifs inside applyPolicies (or duplicated in helpers) instead of HOF wrappers.

## After you are done
1. Make tests green.
2. Run the 4-point self-calibration checklist from the root README.
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial").
4. Only after receiving the review, reveal `reference/solutions/exercises/fp/higher-order-functions/01-basic-policy-applicator/` and compare designs.
