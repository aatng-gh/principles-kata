# Type Guards (Applied - Runtime Validation for Service + Pipeline)

## Scenario
You receive untrusted data (from network, localStorage, user input). You want to validate it once into a known domain type, then use it safely in:

- An `ApiClient` or `EventHandler` class (OOP)
- A pure processing pipeline that `filter`s / `map`s the validated items (FP)

Type guards are the bridge from `unknown` (or `any` from JSON) to your precise types.

Implement guards for a small `AppEvent` union (or specific DTOs) and a "parse" helper that returns the narrowed or throws/Result, but the guard itself does the narrowing.

## Exercise
Define e.g. `type AppEvent = MouseEvent | KeyEvent | ...` (or simple literals + data).

Implement `isAppEvent(x: unknown): x is AppEvent`

Also perhaps `isUser(x: unknown): x is User` for a class entity.

Then:

- `class EventProcessor { handle(raw: unknown) { if (isAppEvent(raw)) { ... use narrowed } } }`
- `function collectValidEvents(raws: unknown[]): AppEvent[] { return raws.filter(isAppEvent); }`

The guard must be defined in one place.

## Starter
Loose `isXXX` that don't narrow.

## Criteria
- Guard returns `x is TheType` (not just boolean).
- After guard in the class method and in the filter callback, the var has the full narrowed type (no further casts in the test or impl).
- Guard is correct (matches runtime reality).
- Works for both the class (imperative if) and the array filter (declarative).

## Expectations
- Precise: the event variants themselves may be a small DU (cross link to that concept).
- Test has expectTypeOf inside the narrowed scopes in both styles.
- Bonus: a "parseEvent(raw): AppEvent" that uses the guard internally and throws on bad (shell).

## Getting Started
```bash
npx vitest run exercises/typescript/type-guards/02-applied
# or
npm run validate:exercise -- exercises/typescript/type-guards/02-applied
```
