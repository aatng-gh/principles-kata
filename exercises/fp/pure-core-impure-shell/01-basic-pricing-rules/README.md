# Pure Core, Impure Shell — Basic: Pricing Rules

## Principle (recap)
Keep the *core* business logic (pricing calculations, discounts, loyalty math, tax) 100% pure and referentially transparent: same inputs (cart + explicit now + explicit tier + rules) always produce identical output, no I/O, no hidden time/random, no mutation. All effects (reading clock, loading user tier from DB, logging, random for promos) live only in the thin *shell* that gathers the inputs and invokes the pure core. This makes the core easy to test exhaustively, replay, and reason about.

## Scenario
The pricing module for checkout was written as one function that reads `Date.now()`, calls a "loyalty DB", flips a `Math.random()` for surprise discounts, and logs. Tests are flaky, prices differ between dev and prod for the same cart, and you can't easily simulate "what would this cart cost on Wednesday with gold tier".

## Functional Requirements
- Given cart (items with prices), produce subtotal, discount, total, list of applied rules.
- Discounts: loyalty gold 10%, wednesday special 5% (based on explicit now), occasional surprise.
- Tax added after discounts.
- The pure calculation must be deterministic when given explicit now + tier.

## Starter
See `src/pricingRules.ts` — `calculatePrice` reads time, calls lookupLoyaltyTier (which does console + fake), uses Math.random inside.

## Criteria (principle-specific)
- Extract a pure core: `calculatePricePure(cart: Cart, now: Date, tier: 'gold'|'standard', taxRate?: number): PriceResult`
- The pure core never calls Date, Math.random, console, or any lookup.
- A shell (even if in same file for basic) does the effects: `const now = new Date(); const tier = await loadTier(userId); return calculatePricePure(cart, now, tier);`
- Same (cart, now, tier) always yields same PriceResult (including which rules applied, when deterministic rules).

## Expectations
- Use `readonly` for inputs in pure fn.
- No side effects in the pure module/path.
- The test (which passes fixed now + tier) must pass; determinism checked.
- Bonus (for ref): separate files `pure.ts` and `shell.ts` (or index that wires).

## Getting Started
```bash
npx vitest run exercises/fp/pure-core-impure-shell/01-basic-pricing-rules
```

## How the judge will evaluate
See AGENTS.md rubric for pure-core-impure-shell. Tests pass fixed data for determinism and "wed special only on wed". The judge will catch any Date/Math/console/DB call that remains inside the "pure" calculate function, or returning non-deterministic results.

## After you are done
Follow the exact order in the root README: tests green → self-checklist → judge via AGENTS.md (adversarial) → *only then* reveal reference/solutions.
