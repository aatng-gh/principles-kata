# Dependency Inversion Principle — Intermediate: Order Fulfillment

## Principle (recap)
High-level policy (the rules that decide whether and how to fulfill an order) must not depend on low-level details (which DB, which payment provider, which warehouse system, what the real clock says). Define ports (interfaces) for the capabilities the policy needs; the policy depends on the ports. Adapters (real or fake implementations) depend on the ports. The policy becomes a pure(ish) decision engine that is easy to test and the adapters can be swapped without touching the policy.

## Scenario
The order fulfillment workflow must: load the order, check inventory, charge the customer, reserve stock, mark the order shipped, and record an audit timestamp. The initial `FulfillmentService` directly `new`s a concrete `SqlOrderRepository`, `StripePaymentGateway`, `InMemoryWarehouse`, and reads `new Date()` inside the method. This couples the business rules to specific vendors, makes the flow impossible to test without hitting real (or at least the starter's) externals, and makes it risky to introduce a new payment provider or a "test clock" for time-sensitive rules.

## Functional Requirements
- Given an order id, the fulfillment flow attempts to: load order, verify sufficient inventory for its items, charge via payment gateway, reserve the stock, update order status to "fulfilled", and record a timestamped audit.
- On any failure (missing order, insufficient stock, payment declined) the flow must not partially mutate state (or must compensate — for the exercise a clear failure result or exception is acceptable if consistent).
- All I/O and time must be mediated by abstractions so that the core policy can be exercised with fakes.
- The same policy code must be usable in production with real adapters (the exercise only ships in-memory/fake ones + the ports).

## Starter (what you are given)
See `src/orderFulfillment.ts` — `FulfillmentService` (or `OrderFulfillment`) that `new`s the four low-level concretions (repo, payment, inventory, and uses Date directly) inside `fulfill(orderId)`. The concrete adapters are simple in-memory or stub implementations. The test drives happy-path and a couple failure cases and observes the side effects (stock levels, order status, "charges" recorded, audit entries).

## Criteria (principle-specific success bar — this is what the judge will score)
- The fulfillment policy / use case depends only on the four ports (e.g. `OrderRepository`, `PaymentGateway`, `Inventory`, `Clock`).
- No `new` of any concrete adapter, and no `new Date()` or `Date.now()`, inside the policy.
- Adapters (in-memory for test, and stubs for the exercise) implement the ports.
- The policy is exercised in tests exclusively via fakes; no real side effects or non-determinism from the clock.
- Production wiring (a composition root or factory) is the only place that knows the concrete adapter classes.
- Adding a new payment provider (or a "test clock" that advances on demand) is a new adapter + one wiring change; the fulfillment policy and the other three ports are untouched.

## Expectations (code quality + demonstration)
- Four small, focused port interfaces (methods the policy actually needs — e.g. `OrderRepository.findById(id)`, `PaymentGateway.charge(order, amount)`, `Inventory.reserve(sku, qty)`, `Clock.now(): Date`).
- The policy class takes the four ports in its constructor (or a config object of ports).
- Optional "default" wiring in the policy ctor or a `createFulfillmentService()` helper only for the original test contract; the injected path is primary.
- In-memory or fake adapters that are trivial and fully deterministic.
- Clear separation: policy file(s) import only the port interfaces; adapter files import the ports and provide impls.
- The test (which can stay using the no-arg creation for the starter contract) must produce identical observable outcomes on the happy and failure paths.
- Bonus: a `wiring.ts` or the index that shows how a prod slice would be assembled (even if the prod adapters are just more in-memory for this lab).

## Getting Started
```bash
# from repo root
npx vitest run exercises/oop/dependency-inversion/02-intermediate-order-fulfillment
```

## How the judge will evaluate
See the rubric for this exercise in `AGENTS.md` (section "OOP / Dependency Inversion / 02-intermediate-order-fulfillment").
Tests check end-to-end observable effects of fulfillment using the starter's default concretions. The judge will look for whether the policy source is free of all four details (repo impl, payment impl, inventory impl, time source). It will be adversarial on "we inject for the new payment but the repo and clock are still newed inside."

## After you are done
1. Make tests green.
2. Run the 4-point self-calibration checklist from the root README.
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial").
4. Only after receiving the review, reveal `reference/solutions/exercises/oop/dependency-inversion/02-intermediate-order-fulfillment/` and compare designs.
