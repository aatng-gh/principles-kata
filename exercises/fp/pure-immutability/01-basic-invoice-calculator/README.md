# Pure Functions & Immutability — Basic: Invoice Calculator

## Principle (recap)
A pure function always returns the same output for the same inputs and produces **no observable side effects** (no mutation of its inputs or any external state, no I/O, no randomness, no time reads hidden inside). Immutability means we never modify data in place; we produce new values.

## Scenario
You inherited a `calculateInvoice` function used by the checkout flow. It was written imperatively and now mutates the caller's invoice object, line items, uses `Date.now()` for timestamps, logs to console, and produces different results on every run even with identical carts. This makes pricing non-deterministic, hard to test, and dangerous (callers' data gets corrupted).

## Functional Requirements
- Given a cart (items with price, qty, optional discount) + an explicit "now", produce an invoice snapshot with subtotal, tax, total, and line breakdowns.
- Tax rate is fixed at 10% for this exercise (or passed in).
- Must handle empty cart (totals 0).
- Output must be a new object; input cart/items must be untouched.

## Starter
See `src/invoiceCalculator.ts` — the functions mutate inputs and hide side effects.

## Criteria (principle-specific)
- `calculateInvoice` (and all helpers it calls) are **pure**: same (cart, now, taxRate) → same output, every time.
- No mutation of any input parameter or its nested objects/arrays.
- Time (now) and any other potential side-effect sources are **explicit parameters**, never read inside the pure functions.
- All intermediate steps (line totals, discounts, rounding) are also pure and can be tested in isolation.

## Expectations
- Use `readonly` in types for inputs.
- Return brand-new objects/arrays (spread, map, etc.).
- Explicit `now: Date` (or number) parameter on the entry point.
- No `console`, `Date.now`, `Math.random`, or mutation operators (`push`, `sort`, `splice`, `=`) on input data inside the calculation path.
- The provided test (which does before/after deep equality + determinism checks) must pass.

## Getting Started
```bash
npx vitest run exercises/fp/pure-immutability/01-basic-invoice-calculator
```

## How the judge will evaluate
See AGENTS.md rubric for this exercise. Tests only check that the numbers are correct and (in some cases) that the input wasn't obviously mangled. The judge will catch subtle mutations, hidden side effects, and non-determinism that the test didn't observe.

## After you are done
1. Make tests green.
2. Run the 4-point self-calibration checklist from the root README.
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial").
4. Only after receiving the review, reveal `reference/solutions/exercises/fp/pure-immutability/01-basic-invoice-calculator/` and compare designs.
