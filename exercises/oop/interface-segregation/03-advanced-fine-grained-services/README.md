# Interface Segregation Principle — Advanced (Stretch): Fine-Grained Services

## Principle (recap)
Clients depend only on the operations they use. In a service-oriented or micro boundary, this means many narrow service interfaces instead of one broad "Admin" or "OrderService" that everything injects.

## Scenario (stretch)
An e-commerce backend has a god "ShopService" used by web UI, mobile, admin dashboard, analytics batch, and partner API. Each caller only needs 10-20% of the methods. New endpoint or field added to the god interface forces rebuilds and potential coupling across all callers.

## Functional Requirements
- Decompose into e.g. CatalogService, OrderService, UserService, AnalyticsService, etc.
- Each consumer (UI page, batch job) depends on only its needed interfaces.
- The impls can still share code behind the scenes.

## Criteria (principle-specific success bar — this is what the judge will score)
- No consumer module imports or types against the broad service.
- Adding a "partner sync" operation only affects the partner facade and its narrow interface.
- Segregated interfaces are role-oriented (e.g. IReadCatalog, IPlaceOrder, IAdminUsers).

## Expectations
- Use multiple small interfaces; concrete classes implement several.
- Consumer code takes the minimal interfaces (ctor injection of several).
- Show the before/after surface for one consumer (e.g. the checkout flow only sees order + catalog read).

## Getting Started (stretch)
Design and implement per the Criteria. No provided starter or test for this stretch exercise (you may write your own tests in vitest to verify your contracts and implementation).

```bash
# Design and implement per the Criteria. You may write your own tests in vitest.
npx vitest run exercises/oop/interface-segregation/03-advanced-fine-grained-services --passWithNoTests
```

## How the judge will evaluate
See the (lighter) rubric for this exercise in `AGENTS.md` (general bar + "OOP / Interface Segregation / 03-advanced-fine-grained-services" or the stretch note). The stretch has no provided test; you will design your own contracts + verification. The judge will check that consumers depend only on the narrow role interfaces they actually use (no god service in any client signature), and that adding a new operation affects only the relevant narrow interface + its consumers. Criteria in this README are authoritative for the stretch.

## After you are done
1. Design/implement (and any self-written tests) per the Criteria; run `npx vitest run exercises/oop/interface-segregation/03-advanced-fine-grained-services --passWithNoTests` until green.
2. Run the 4-point self-calibration checklist from the root README (adapt for no provided test / stretch scope).
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial"; note the lighter rubric for stretches).
4. Only after receiving the review, reveal `reference/solutions/exercises/oop/interface-segregation/03-advanced-fine-grained-services/` (if present; many 03s have none) and compare designs.
