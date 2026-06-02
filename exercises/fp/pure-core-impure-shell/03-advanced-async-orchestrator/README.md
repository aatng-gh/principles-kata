# Pure Core, Impure Shell — Advanced (Stretch): Async Orchestrator

## Principle (recap)
Even complex async workflows (sagas, approval flows, retries) have a pure decision core that, given current state + facts, returns the next commands or decision. The shell performs the async steps, awaits, and feeds results back into the pure decider. Effects are never hidden inside decisions.

## Scenario (stretch)
A multi-step order approval + payment + fulfillment + notification saga with retries, timeouts, and compensation. Current code is a tangle of async/await, try/catch, and state mutations inside the steps. Hard to test "what happens if payment fails after inventory reserved?" without full env.

## Functional Requirements
- Pure decider: given saga state + incoming event/fact + now => next action or completed.
- Shell: drives the steps (reserve, charge, ship, notify, compensate), using real or stub async.
- Use Result or explicit command types from the core.

## Criteria (principle-specific success bar — this is what the judge will score)
- All decisions ("can we charge now?", "should we compensate?", "final status?") in pure fns taking explicit state + facts.
- Shell only: load state, call pure, execute the returned command (which may be async), feed result back.
- Timeouts/retries modeled as facts passed to pure (or produced as commands).
- Same facts + state always produce same decision (replayable).

## Expectations
- State machine or saga data as input to pure step.
- Commands as data (e.g. {kind: 'Charge', amount}).
- Shell interprets commands with real adapters.
- Pure core can be tested with plain objects for every branch including compensation.
- Note how a real FP language (with effects in types) would make the shell boundary even stricter.

## Getting Started (stretch)
Design and implement per the Criteria. No provided starter or test for this stretch exercise (you may write your own tests in vitest to verify your contracts and implementation).

```bash
# Design and implement per the Criteria. You may write your own tests in vitest.
npx vitest run exercises/fp/pure-core-impure-shell/03-advanced-async-orchestrator --passWithNoTests
```

## How the judge will evaluate
See the (lighter) rubric for this exercise in `AGENTS.md` (general bar + "FP / Pure Core, Impure Shell / 03-advanced-async-orchestrator" or the stretch note). The stretch has no provided test; you will design your own contracts + verification. The judge will check that all branching decisions live in pure Result/command-returning fns; the async orchestrator shell only drives and interprets commands, feeding results back. Replayability from pure core. Criteria in this README are authoritative for the stretch.

## After you are done
1. Design/implement (and any self-written tests) per the Criteria; run `npx vitest run exercises/fp/pure-core-impure-shell/03-advanced-async-orchestrator --passWithNoTests` until green.
2. Run the 4-point self-calibration checklist from the root README (adapt for no provided test / stretch scope).
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial"; note the lighter rubric for stretches).
4. Only after receiving the review, reveal `reference/solutions/exercises/fp/pure-core-impure-shell/03-advanced-async-orchestrator/` (if present; many 03s have none) and compare designs.
