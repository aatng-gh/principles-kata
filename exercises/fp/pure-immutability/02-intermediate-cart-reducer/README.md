# Pure Functions & Immutability — Intermediate: Cart Reducer

## Principle (recap)
A pure function returns the same output for the same inputs and produces no observable side effects. Immutability means inputs (and their nested structures) are never modified; every update produces a brand new value.

## Scenario
Shopping cart updates (add item, apply coupon, change quantity) are implemented as mutating functions that also perform implicit price lookups and write to console or mutate caller data. The same sequence of updates on identical starting carts can produce different totals because of mutation and hidden time/price side effects. This breaks time-travel debugging, undo, and testing.

## Functional Requirements
- `addItem(cart, item)`, `applyCoupon(cart, code)`, `changeQty(cart, sku, qty)` each produce an updated cart.
- Totals recomputed correctly (with SAVE10 = 10% off).
- Input cart and its items must remain unchanged (deep equality).
- Same starting cart + same sequence must always yield identical result object (value equality).

## Starter (what you are given)
See `src/cartReducer.ts` — three mutating functions that return the input ref and perform in-place changes + total recalc.

## Criteria (principle-specific)
- All three public functions are pure: they never mutate their `cart` argument or any nested item, and never read global time/price/DB.
- Every call returns a new cart object (and new arrays/items where needed); input reference is never returned on happy path.
- Determinism: identical input value + same operations → identical output value.
- No console, Date, or other effects inside the reducers.

## Expectations
- Use `readonly` in interfaces and `...` / `map` / `filter` for updates.
- Small named helpers for "withItemAdded", "withDiscountApplied" etc if helpful.
- Explicit coupon application as pure transform.
- Deep immutability: even the items in the new cart's array are new objects when changed.
- Tests (including the provided one) pass; learner-added tests may assert `not.toBe` and `toEqual`.

## Getting Started
```bash
npx vitest run exercises/fp/pure-immutability/02-intermediate-cart-reducer
```

## How the judge will evaluate
See AGENTS.md rubric for this exercise. Tests do deep-equality before/after and determinism checks. The judge will catch shallow spreads that still share nested item objects, or any hidden mutation via `push` on a copy of the array ref, or console inside.

## After you are done
1. Make tests green.
2. Run the 4-point self-calibration checklist from the root README.
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial").
4. Only after receiving the review, reveal `reference/solutions/exercises/fp/pure-immutability/02-intermediate-cart-reducer/` and compare designs.
