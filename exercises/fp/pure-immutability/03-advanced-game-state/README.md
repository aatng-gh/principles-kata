# Pure Functions & Immutability — Advanced (Stretch): Game State

## Principle (recap)
All game state transitions are pure: given (state, action, rngSeed, now) produce new state + events. No mutation of previous state; time and randomness explicit. Enables perfect replay, undo, testing.

## Scenario (stretch)
A turn-based or simple physics game (e.g. inventory + combat + world events). Current code mutates a global game object, calls Date.now and Math.random inside update loops. Save/load, replays, and AI sims are unreliable.

## Functional Requirements
- State is immutable tree (player, world, items).
- `reduce(state, action, seed, now) => {state: newState, events, nextSeed}`
- Multiple action types; deterministic given seeds.
- Undo by keeping history of states (cheap with structural sharing or just snapshots).

## Criteria (principle-specific success bar — this is what the judge will score)
- Every public reducer returns a brand new state; never mutates input.
- Randomness and time are parameters (or produced as output for next).
- Same (state0, action, seed, now) => identical (state1, events).
- Deep readonly or frozen in types where helpful.

## Expectations
- Small pure reducers composed (move, attack, loot, tick).
- Event sourcing flavor optional: actions + pure fold.
- Tests for replay: apply sequence, get same final.
- Compare to the cart reducer; this is the "full game" version.

## Getting Started (stretch)
Design and implement per the Criteria. No provided starter or test for this stretch exercise (you may write your own tests in vitest to verify your contracts and implementation).

```bash
# Design and implement per the Criteria. You may write your own tests in vitest.
npx vitest run exercises/fp/pure-immutability/03-advanced-game-state --passWithNoTests
```

## How the judge will evaluate
See the (lighter) rubric for this exercise in `AGENTS.md` (general bar + "FP / Pure Immutability / 03-advanced-game-state" or the stretch note). The stretch has no provided test; you will design your own contracts + verification. The judge will check whether state updates are pure with explicit now/seed, and input state objects are never mutated even for complex nested game entities. Criteria in this README are authoritative for the stretch.

## After you are done
1. Design/implement (and any self-written tests) per the Criteria; run `npx vitest run exercises/fp/pure-immutability/03-advanced-game-state --passWithNoTests` until green.
2. Run the 4-point self-calibration checklist from the root README (adapt for no provided test / stretch scope).
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial"; note the lighter rubric for stretches).
4. Only after receiving the review, reveal `reference/solutions/exercises/fp/pure-immutability/03-advanced-game-state/` (if present; many 03s have none) and compare designs.
