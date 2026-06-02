# principles-kata

A collection of katas for **Object-Oriented Design Principles** (SOLID) and **Functional Programming Design Principles** in TypeScript.

- 5 OOP principles × 2 core exercises (+ 1 stretch documented) = 10 OOP
- 5 FP principles × 2 core exercises (+ 1 stretch documented) = 10 FP
- **20 core exercises total**, each with:
  - Brief explanation + realistic scenario
  - Criteria (principle adherence)
  - Expectations (quality + demonstration)
  - Vitest that validates *functionality only*
- `AGENTS.md` is the judge: rubrics that catch "green tests but violates the principle", anti-patterns, positive indicators, scoring. Tests check behavior; AGENTS.md checks comprehension and design quality.

## Quick Start

```bash
npm install
npm test                 # run everything (most will fail until you implement)
npm run test:oop
npm run test:fp
npx vitest run exercises/oop/single-responsibility/01-basic-user-profile
# targeted: npm run validate:exercise -- exercises/oop/single-responsibility/01-basic-user-profile
```

See the full "How to practice" section below.

## Language Notes

TypeScript + strict discipline is excellent for learning the *shape and benefits* of these principles in a familiar syntax.

For compile-time enforcement of purity, ADTs, effects, and higher-kinded types, the FP exercises will feel limited. After (or alongside) doing them in TS, explore the same ideas in:

- **PureScript** (great TS interop, row types, good for learning FP)
- **Haskell** (the reference for reasoning about purity and composition)
- **F#** or **Scala 3** (union types + pattern matching + for comprehensions)
- **Elm** or **Clojure** (for simplicity and REPL-driven discovery)

The stretch (03-*) exercises often include notes on "what a real FP language would buy you here."

## Principles Covered

### OOP (SOLID)
- Single Responsibility
- Open/Closed
- Liskov Substitution
- Interface Segregation
- Dependency Inversion

### FP
- Pure Functions & Immutability
- Function Composition
- Higher-Order Functions
- Declarative Transformation & Recursion
- Pure Core, Impure Shell (Referential Transparency & Effect Management)

## TypeScript Type System Refresh

There is also a dedicated **TypeScript basics lab** focused on the type system features that enable clean OOP *and* FP design at a mid-to-senior level:

`exercises/typescript/`

See `exercises/typescript/README.md` for the list of concepts (Generics, Conditional Types, Mapped Types, Discriminated Unions, Type Guards, Branded Types) and the "How to practice" notes. These are practical refresh exercises (not beginner "what is an interface" material) with both runtime and type-level validation.

Strongly recommended before or alongside the design principle exercises.

## Directory Layout

See EXERCISES.md or just `ls exercises/oop` / `ls exercises/fp`. Every principle has `01-basic-...`, `02-intermediate-...`, `03-advanced-...` (stretch).

## How to Practice (mandatory)

**Beginner track suggestion**: `single-responsibility/01-basic-user-profile` (OOP) + `pure-immutability/01-basic-invoice-calculator` (FP). Then alternate one OOP + one FP per focused session.

### Master Exercise Index (core 20)

See EXERCISES.md for the full catalog (and individual exercise READMEs for scenarios + criteria/"force" descriptions). Quick list:

**OOP**
- single-responsibility/01-basic-user-profile
- single-responsibility/02-intermediate-invoice-pipeline
- open-closed/01-basic-discount-engine
- open-closed/02-intermediate-export-pipeline
- liskov-substitution/01-basic-employee-hierarchy
- liskov-substitution/02-intermediate-asset-valuation
- interface-segregation/01-basic-multifunction-device
- interface-segregation/02-intermediate-ecommerce-admin
- dependency-inversion/01-basic-notification-service
- dependency-inversion/02-intermediate-order-fulfillment

**FP**
- pure-immutability/01-basic-invoice-calculator
- pure-immutability/02-intermediate-cart-reducer
- function-composition/01-basic-data-pipeline
- function-composition/02-intermediate-validation-railway
- higher-order-functions/01-basic-policy-applicator
- higher-order-functions/02-intermediate-event-dispatcher
- declarative-transformation/01-basic-tree-processing
- declarative-transformation/02-intermediate-rule-engine
- pure-core-impure-shell/01-basic-pricing-rules
- pure-core-impure-shell/02-intermediate-order-workflow

(03- stretches have full scenario/criteria in their READMEs but are optional for v1.)

### Step-by-step

1. Pick an exercise. Read its full `README.md` (Criteria and Expectations are the contract with the judge).
2. Implement in `src/` (or add modules) until this command is green:

   ```bash
   npx vitest run exercises/oop/single-responsibility/01-basic-user-profile
   # or the fp equivalent
   # or use helper: npm run validate:exercise -- exercises/...
   ```

3. **Self-calibration checklist** (complete *before* review request):
   1. Did every public behavior described in the exercise README pass the provided test?
   2. Did I introduce any of the anti-patterns listed in this exercise's AGENTS.md rubric section?
   3. Can I articulate (in comments or a short `reasoning.md`) the *one* (or few) reason(s) a module would change under this principle?
   4. Did I add extensibility or a new policy/rule by *only adding* (never modifying core) where the criteria demand it?

4. **STOP.** Green tests are necessary but **not sufficient**. The entire point of this lab is principle comprehension and the adversarial design review.

5. Invoke the judge (copy-paste template — include your self-check answers):

   ```
   I just completed exercises/oop/single-responsibility/01-basic-user-profile.
   Tests are green.
   Self-check:
   1. ...
   2. ...
   3. ...
   4. ...
   Please review using the exact rubrics and anti-patterns in this repo's AGENTS.md (be adversarial; cite file:line).
   Here is my implementation (diff or full files):
   ```

   (Paste into chat with Grok/Claude/Cursor or hand to a peer. The AGENTS.md is designed to be loaded automatically or via `--rules` / copy.)

6. Only *after* you have the review in hand, reveal the reference solution for comparison:

   - `./scripts/reveal-solutions.sh` (or `git checkout -- reference/solutions`; or follow the exact instructions in the exercise README)
   - Compare your design to the reference. Note where the judge feedback aligned or diverged.

Repeat across paradigms for contrast.

## Reference Solutions Policy

`reference/solutions/` exists in the repo but is **ignored by default in .gitignore** (fresh clones do not receive spoilers).

Reveal policy (enforced in every exercise README and the root process above): reveal **only after** tests pass + self-checklist + receiving a review that used the AGENTS.md rubrics.

This protects the struggle-and-internalize loop.

## Reference Solutions

Shipped under `reference/solutions/` but **gitignored by default** (see `.gitignore`).

Fresh clones will *not* have them. This is intentional pedagogy.

Reveal only after you have:
- Made tests pass
- Self-checked the 4-point list
- Received an AGENTS.md-guided review (human or AI)

Use `./scripts/reveal-solutions.sh` (or `git checkout -- reference/solutions`).

## Contributing / Adding Exercises

See AGENTS.md for the judge standards. New exercises should follow the exact template from the existing 01/02 exemplars (README structure, tempting-but-wrong starter, functionality-focused test that doesn't assert structure, rubric entry in AGENTS.md).

## Verification of This Lab Itself

VERIFICATION.md (and EXERCISES.md) document the final clean state (32 tests, 28/4 pass/fail files with only intentional FP purity fails, typecheck 0, lint 0, 24 biome-ignores), verification steps, and how the AGENTS.md judge catches principle violations (even when functionality tests pass on deliberately imperfect starters, or "green" numbers with bad design). Cross-reference AGENTS.md for the full rubrics.

## License

MIT (or whatever you prefer for a practice repo).

---

**Start here**: `exercises/oop/single-responsibility/01-basic-user-profile/README.md` and its FP counterpart.
