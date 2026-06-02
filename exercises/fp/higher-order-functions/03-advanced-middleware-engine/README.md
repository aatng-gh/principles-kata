# Higher-Order Functions — Advanced (Stretch): Middleware Engine

## Principle (recap)
Request/response or event pipelines are built from composable HOF middleware (auth, logging, rate-limit, feature-flag, metrics). Order and selection are declarative; adding a concern never requires touching existing middleware.

## Scenario (stretch)
An HTTP or RPC handler pipeline for a service. Current impl has a big function with manual if (needsAuth) ... try/catch logging etc duplicated across routes. New requirements: per-route middleware stacks, conditional (feature flag) middleware, and a "timeout" wrapper.

## Functional Requirements
- Define a middleware type: (next) => (req) => res or similar.
- Engine composes stacks per route or globally.
- Support sync and async.

## Criteria (principle-specific success bar — this is what the judge will score)
- Middleware are HOFs or plain fns that wrap "next".
- Composition is `compose([withAuth, withLogging, withTimeout(1000), handler])`.
- New middleware (e.g. withFeatureFlag('beta', handler)) added without editing engine or other mw.
- Cross-cutting applied uniformly or selectively via the list.

## Expectations
- Tiny, focused middleware fns.
- Engine is a small compose utility (or use array reduce).
- Demonstrate stacking for 3 routes with different subsets.
- Error handling in mw (e.g. withErrorHandler) that doesn't leak into business handlers.

## Getting Started (stretch)
Design and implement per the Criteria. No provided starter or test for this stretch exercise (you may write your own tests in vitest to verify your contracts and implementation).

```bash
# Design and implement per the Criteria. You may write your own tests in vitest.
npx vitest run exercises/fp/higher-order-functions/03-advanced-middleware-engine --passWithNoTests
```

## How the judge will evaluate
See the (lighter) rubric for this exercise in `AGENTS.md` (general bar + "FP / Higher-Order Functions / 03-advanced-middleware-engine" or the stretch note). The stretch has no provided test; you will design your own contracts + verification. The judge will check whether middleware are true HOFs composed declaratively, and that adding a new mw or per-route stack requires no changes to the engine or other mw. Criteria in this README are authoritative for the stretch.

## After you are done
1. Design/implement (and any self-written tests) per the Criteria; run `npx vitest run exercises/fp/higher-order-functions/03-advanced-middleware-engine --passWithNoTests` until green.
2. Run the 4-point self-calibration checklist from the root README (adapt for no provided test / stretch scope).
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial"; note the lighter rubric for stretches).
4. Only after receiving the review, reveal `reference/solutions/exercises/fp/higher-order-functions/03-advanced-middleware-engine/` (if present; many 03s have none) and compare designs.
