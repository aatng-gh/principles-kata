# Open/Closed Principle — Basic: Discount Engine

## Principle (recap)
Software entities (classes, modules, functions) should be **open for extension** but **closed for modification**. New behavior is added by writing new code, not by editing existing code.

## Scenario
A discount engine for checkout started simple but grew if/else chains for customer tiers (regular/vip/premium) and promo codes. Every time marketing wants a new tier ("senior", "student") or a seasonal promo, developers must edit the core calculate method, risking bugs in existing discounts and requiring full re-test of all paths.

## Functional Requirements
- `calculateDiscountedPrice(basePrice, tier, promoCode?)` returns the price after applicable discounts.
- Built-in: VIP 15%, Premium 10%, regular 0%; SUMMER20 adds 20%, LOYAL10 adds 10%; total discount capped at 50%.
- Rejects negative prices.
- The public API must stay stable.

## Starter (what you are given)
See `src/discountEngine.ts` — a single class with if/else for every tier and promo. Test exercises the current behaviors.

## Criteria (principle-specific success bar — this is what the judge will score)
- Adding a new customer tier (e.g. "senior" at 12%) or new promo requires **only adding code** (new class/rule, registration), **never editing** the existing discount logic or the engine's if/else.
- Existing tier/promo calculations remain untouched in source.
- The engine is "closed" to changes in the rules it already knows.

## Expectations (code quality + demonstration)
- Define an interface `DiscountRule` (or strategy) with `applies(...)` and `discountAmount(...)` (or percent).
- The engine holds a collection of rules (open); new rules are added to the collection without touching engine source.
- Or use a registry/map of strategies keyed by tier/promo but extensible via registration function.
- Precise types; the engine does not "know" the concrete rules beyond the interface.
- Tests pass; a new rule can be introduced in a separate file.

## Getting Started
```bash
# from repo root
npx vitest run exercises/oop/open-closed/01-basic-discount-engine
```

## How the judge will evaluate
See the rubric for this exercise in `AGENTS.md` (section "OOP / Open/Closed / 01-basic-discount-engine").
Tests verify current discount numbers only. The judge will flag any solution where introducing "senior" tier still requires editing the original calculate method or the same file's conditionals.

## After you are done
1. Make tests green.
2. Run the 4-point self-calibration checklist from the root README.
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial").
4. Only after receiving the review, reveal `reference/solutions/exercises/oop/open-closed/01-basic-discount-engine/` and compare designs.
