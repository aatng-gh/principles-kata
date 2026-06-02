# Liskov Substitution Principle — Advanced (Stretch): Collection Hierarchy

## Principle (recap)
Subtypes (including collection-like wrappers or custom containers) must be substitutable for their bases or declared interfaces without breaking client code that uses the base contract.

## Scenario (stretch)
A custom "smart collection" hierarchy (e.g. ObservableList, FilteredList, VersionedList) is used in UI and reporting code written against List-like. Some subtypes change iteration semantics or mutation behavior in ways that surprise callers (e.g. filter removes during iteration, versioned throws on old iterators).

## Functional Requirements
- Clients written against a Collection or List interface must work for any impl (read, iterate, size).
- Mutation (if supported) must preserve base contract.

## Criteria (principle-specific success bar — this is what the judge will score)
- All subtypes honor the base pre/post conditions (e.g. iterator remains valid for lifetime unless explicitly invalidated; no surprise exceptions on read ops).
- A reporting function that does `for (const x of collection) sum += x` works unchanged for filtered/observable/versioned variants.
- New "CappedCollection" subtype can be substituted without client changes.

## Expectations
- Prefer composition (wrappers that delegate) over deep inheritance for collection variants.
- Document or type the contracts clearly (e.g. "this view is live").
- If inheritance, ensure Liskov (no strengthened "only if not filtered").
- Test substitution explicitly with base-typed variables.

## Getting Started (stretch)
Design and implement per the Criteria. No provided starter or test for this stretch exercise (you may write your own tests in vitest to verify your contracts and implementation).

```bash
# Design and implement per the Criteria. You may write your own tests in vitest.
npx vitest run exercises/oop/liskov-substitution/03-advanced-collection-hierarchy --passWithNoTests
```

## How the judge will evaluate
See the (lighter) rubric for this exercise in `AGENTS.md` (general bar + "OOP / Liskov Substitution / 03-advanced-collection-hierarchy" or the stretch note). The stretch has no provided test; you will design your own contracts + verification. The judge will check that all subtypes (including wrappers like ObservableList, FilteredList) are substitutable for the base Collection/List without breaking client expectations (no new exceptions, preserved iteration semantics, etc.). Criteria in this README are authoritative for the stretch.

## After you are done
1. Design/implement (and any self-written tests) per the Criteria; run `npx vitest run exercises/oop/liskov-substitution/03-advanced-collection-hierarchy --passWithNoTests` until green.
2. Run the 4-point self-calibration checklist from the root README (adapt for no provided test / stretch scope).
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial"; note the lighter rubric for stretches).
4. Only after receiving the review, reveal `reference/solutions/exercises/oop/liskov-substitution/03-advanced-collection-hierarchy/` (if present; many 03s have none) and compare designs.
