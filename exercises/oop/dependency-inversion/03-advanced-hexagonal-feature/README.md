# Dependency Inversion Principle — Advanced (Stretch): Hexagonal Feature

## Principle (recap)
Core business logic depends on ports (abstractions). Adapters for DB, HTTP, queues, clocks are plugged at the composition root. The feature (use case) is a hexagon: inside pure decisions + entities, outside all I/O.

## Scenario (stretch)
Implement a "place recurring order" feature as a hexagonal slice: the use case orchestrates domain logic (validate subscription, compute next shipment, decide charge), but never talks directly to Postgres, Stripe, or the scheduler. Real adapters + test fakes + a fake "time" adapter must be swappable without touching the use case.

## Functional Requirements
- Use case: scheduleNext, chargeIfDue, etc.
- Ports for: SubscriptionRepository, PaymentGateway, Clock, Notification.
- At least one prod-like adapter stub and one test fake each.

## Criteria (principle-specific success bar — this is what the judge will score)
- The use case class/function depends *only* on the port interfaces.
- All wiring in a composition root (or module).
- The use case can be tested 100% with fakes; no real I/O leaks into it.
- Adding e.g. a "loyalty points on recurring" rule stays inside the hexagon.

## Expectations
- Classic ports-and-adapters: entities + use cases inside; adapters out.
- Explicit clock port for determinism.
- Result types for the decision outcomes.
- A small main or test that assembles real vs test graph.

## Getting Started (stretch)
Design and implement per the Criteria. No provided starter or test for this stretch exercise (you may write your own tests in vitest to verify your contracts and implementation).

```bash
# Design and implement per the Criteria. You may write your own tests in vitest.
npx vitest run exercises/oop/dependency-inversion/03-advanced-hexagonal-feature --passWithNoTests
```

## How the judge will evaluate
See the (lighter) rubric for this exercise in `AGENTS.md` (general bar + "OOP / Dependency Inversion / 03-advanced-hexagonal-feature" or the stretch note). The stretch has no provided test; you will design your own contracts + verification. The judge will check whether the use case depends only on port abstractions (no direct new of adapters or I/O inside), all wiring external in composition root, and fakes fully exercise the feature. Criteria in this README are authoritative for the stretch.

## After you are done
1. Design/implement (and any self-written tests) per the Criteria; run `npx vitest run exercises/oop/dependency-inversion/03-advanced-hexagonal-feature --passWithNoTests` until green.
2. Run the 4-point self-calibration checklist from the root README (adapt for no provided test / stretch scope).
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial"; note the lighter rubric for stretches).
4. Only after receiving the review, reveal `reference/solutions/exercises/oop/dependency-inversion/03-advanced-hexagonal-feature/` (if present; many 03s have none) and compare designs.
