# Declarative Transformation & Recursion — Intermediate: Rule Engine

## Principle (recap)
Instead of encoding business logic as long imperative procedures with flags, mutation and early returns, model the *rules themselves as data* (or as an expression AST using discriminated unions). Then write a small pure interpreter (often recursive) that evaluates the data against facts. Adding a rule is adding data, not editing the interpreter. TS unions give exhaustiveness.

## Scenario
A checkout approval + discount engine has grown into one 50-line function with nested ifs, early returns, and mutation of "decision" variables. New promotions ("double discount on birthday if premium") require invasive edits and are easy to get wrong in combination with existing rules.

## Functional Requirements
- Given Facts {age, hasLicense, isPremium, purchaseAmount}, return Decision {approved, discount, reason}.
- Rules (hard-coded for this exercise):
  - age < 18 → reject (underage)
  - !hasLicense && purchaseAmount > 100 → reject
  - premium → 20% discount
  - else if amount > 200 → 10%
  - else 5%
- The decision must be deterministic and pure (no hidden time/random in core).

## Starter
See `src/ruleEngine.ts` — one big `evaluatePolicy` with mutable locals, early returns, and console inside the "engine".

## Criteria (principle-specific)
- Rules are modeled as data (e.g. an array of rule objects, or a single Expr AST with unions for And/Or/Gt/Const/Premium etc.).
- Evaluation is a pure recursive (or fold) interpreter over that data: `evalRule(ruleData, facts): Decision`.
- Adding a new rule (e.g. "birthday bonus") is inserting a data node or new case in the union + handling in the interpreter only; the facts and top level call site are untouched.
- No mutation or early returns in the interpreter; short-circuiting is expressed declaratively (e.g. via the AST structure or Option/Result).

## Expectations
- Use a discriminated union for the rule/expression model.
- The interpreter is small, named, pure, and exhaustive over the union cases.
- Tests pass with identical decisions for the given fact sets.
- Bonus: the rules data can be serialized or inspected (e.g. "show me all premium rules").

## Getting Started
```bash
npx vitest run exercises/fp/declarative-transformation/02-intermediate-rule-engine
```

## How the judge will evaluate
See AGENTS.md rubric. Tests only check the final Decision shape for various fact combinations. The judge will look for whether rules are data + interpreter or whether the big imperative fn was just cleaned up with comments while still being "the one place all rules live in code".

## After you are done
Follow the exact order in the root README: tests green → self-checklist → judge via AGENTS.md (adversarial) → *only then* reveal reference/solutions.
