# Higher-Order Functions — Intermediate: Event Dispatcher

## Principle (recap)
Event handling and cross-cutting concerns (authz, metrics, replay logging) are composed using HOFs rather than duplicated inside every handler or a giant switch. Registration becomes "wrap base handler with middleware".

## Scenario
An event bus uses a switch/if on event.type inside dispatch, and every branch manually does metrics + replay logging. Adding a new event type duplicates the cross-cuts; adding a new cross-cut (e.g. "rate limit") requires editing every existing handler branch.

## Functional Requirements
- dispatch(event) routes to the registered handler for the type and runs the cross-cutting logs.
- registerHandler lets code add handlers for the three event types.
- Metrics and replay logs must fire for every dispatch (observable in tests).
- Existing registrations in starter must continue to work.

## Starter (what you are given)
See `src/eventDispatcher.ts` — switchless but still has the registration of raw handlers + cross cuts conceptually duplicated at call sites or inside dispatch.

## Criteria (principle-specific)
- Handlers are plain fns; cross-cuts are HOFs: `withMetrics(handler)`, `withReplay(handler)`.
- Registration uses the wrapped versions: `registerHandler('order', withMetrics(withReplay(baseHandler)))` or a `composeMiddleware` .
- Adding "authz" is a new `withAuthz` HOF + one change at registration sites (or central middleware list) — no touch to base handlers.
- No type switch or if-ladder on event.type in the core dispatch (use a map of wrapped handlers).

## Expectations
- Small HOFs that take a handler and return a handler (same signature).
- Dispatch is a simple lookup + call of the (already-wrapped) fn.
- Middleware can be stacked declaratively.
- New event type = register one (wrapped) handler; no core changes.
- Tests continue to see the logs and handler effects.

## Getting Started
```bash
npx vitest run exercises/fp/higher-order-functions/02-intermediate-event-dispatcher
```

## How the judge will evaluate
See AGENTS.md. Tests verify routing + that cross-cut logs appear. The judge will call out any remaining if/switch on .type inside dispatch or duplicated console.log('[METRICS]') inside the three handler bodies.

## After you are done
1. Make tests green.
2. Run the 4-point self-calibration checklist from the root README.
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial").
4. Only after receiving the review, reveal `reference/solutions/exercises/fp/higher-order-functions/02-intermediate-event-dispatcher/` and compare designs.
