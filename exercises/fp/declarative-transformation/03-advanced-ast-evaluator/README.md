# Declarative Transformation & Recursion — Advanced (Stretch): AST Evaluator

## Principle (recap)
Complex expressions or rules are modeled as an AST (discriminated union). Evaluation, optimization, and pretty-print are pure recursive (or fold) functions over the tree. Adding a new node kind requires handling it in each interpreter but never mutates or uses loops on the structure.

## Scenario (stretch)
A mini expression language for pricing formulas or filters: literals, vars, add/mul, if, and user functions. Current evaluator is a big recursive switch with side effects (logging during eval) and mutation of an env. Need to support new nodes (e.g. "sum over list") and separate concerns: eval, typecheck, optimize (constant fold), toString.

## Functional Requirements
- Parse tiny DSL to AST (or provide AST directly).
- eval(ast, env) => value (pure).
- Support at least add, mul, var, const, if.
- Handle errors explicitly (Result or Option).

## Criteria (principle-specific success bar — this is what the judge will score)
- AST is a discriminated union (tag: 'Add' | 'Var' | ...).
- eval is exhaustive recursive match (or visitor) returning new values.
- New node (e.g. 'Sum') is added to the union; each pure transform (eval, optimize) gets one new case; no other code touched for the shape.
- No mutation of env or AST during transforms.
- Separate interpreters for different concerns.

## Expectations
- Use pattern matching style (switch with exhaustiveness or helper match fn).
- Pure transforms: e.g. `optimize(ast): AST`, `freeVars(ast): Set`.
- Env is passed explicitly (no globals).
- Tests for eval + optimize on complex expressions.
- Reference the rule-engine 02 for data modeling.

## Getting Started (stretch)
Design and implement per the Criteria. No provided starter or test for this stretch exercise (you may write your own tests in vitest to verify your contracts and implementation).

```bash
# Design and implement per the Criteria. You may write your own tests in vitest.
npx vitest run exercises/fp/declarative-transformation/03-advanced-ast-evaluator --passWithNoTests
```

## How the judge will evaluate
See the (lighter) rubric for this exercise in `AGENTS.md` (general bar + "FP / Declarative Transformation & Recursion / 03-advanced-ast-evaluator" or the stretch note). The stretch has no provided test; you will design your own contracts + verification. The judge will check for union AST + pure recursive/fold interpreters for multiple concerns (eval, optimize), with no mutation and exhaustive handling. Criteria in this README are authoritative for the stretch.

## After you are done
1. Design/implement (and any self-written tests) per the Criteria; run `npx vitest run exercises/fp/declarative-transformation/03-advanced-ast-evaluator --passWithNoTests` until green.
2. Run the 4-point self-calibration checklist from the root README (adapt for no provided test / stretch scope).
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial"; note the lighter rubric for stretches).
4. Only after receiving the review, reveal `reference/solutions/exercises/fp/declarative-transformation/03-advanced-ast-evaluator/` (if present; many 03s have none) and compare designs.
