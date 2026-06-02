# Liskov Substitution Principle — Basic: Employee Hierarchy

## Principle (recap)
If S is a subtype of T, then objects of type T may be replaced with objects of type S without altering any of the desirable properties of the program (correctness, task performed, etc.). Subtypes must honor the contracts (preconditions, postconditions, invariants) of the base type. They must not strengthen preconditions, weaken postconditions, introduce new exceptions for operations the base promises will succeed, or break invariants that clients of the base rely on.

## Scenario
The HR/payroll system has an `Employee` base with `calculatePay(): number` and `approveExpense(amount: number): boolean`. Subtypes Manager, Contractor, and Intern were added for special rules. Unfortunately, some overrides make the subtypes unsafe to use where an `Employee` is expected: an intern will throw on any expense approval (while base says any employee can approve small expenses), a contractor always rejects even trivial expenses, and pay calculations can produce surprising results (or negative) when code is written against the base type. Budget and payroll code that tries to treat them uniformly now requires `instanceof` checks and special cases.

## Functional Requirements
- `calculatePay()` returns a non-negative number for every employee kind.
- `approveExpense(amount)` for amounts <= 1000 must succeed (return true) for regular employees; larger amounts depend on role limits.
- The system must support creating and using Manager (higher approval limit + bonus), Contractor (hourly or project pay, limited approval), Intern (stipend pay).
- Client code written against `Employee` (e.g. a `processPayroll(emps: Employee[])` or budget approver) must work correctly when any mix of the subtypes is passed — without the client knowing the concrete types.
- "Current" special rules (intern stipend = 0 or low, contractor always low approval) must still be representable, but without breaking the base contract.

## Starter (what you are given)
See `src/employeeHierarchy.ts` — base `Employee` plus `Manager`, `Contractor`, `Intern` subclasses. Some overrides intentionally violate substitutability (throwing, always-false for small expenses, pay that can surprise callers using base refs). The tests exercise both direct calls and some polymorphic use.

## Criteria (principle-specific success bar — this is what the judge will score)
- Any subtype can be used via an `Employee` reference (or in an `Employee[]`) and will satisfy the base contract: `calculatePay() >= 0`, `approveExpense(n)` for small n returns true (or the documented behavior), no unexpected exceptions.
- Adding a new subtype (e.g. `Executive` or `Freelancer`) requires only the new class; it does not force changes to existing payroll/budget functions or the other subtypes.
- No `instanceof` or down-casts in client code that processes employees (the test will include a small polymorphic processor; your design must make it work for all).
- The special rules for each role are still honored, but expressed in a way that does not violate LSP (e.g. via different limit values, composition of a PayPolicy, or a role object rather than overriding in ways that break promises).

## Expectations (code quality + demonstration)
- Keep a clean `Employee` base (or interface + impl) whose documented contract is narrow and enforceable.
- Subtypes override only to specialize within the contract (e.g. higher limit value, different pay computation that still returns >=0 and is deterministic).
- If a role truly cannot approve expenses, model it so that it is not an `Employee` in the "approvable" sense, or return false consistently, or use a separate `Approver` capability (but keep is-a for the pay part if using inheritance).
- Precise types; no `any`; avoid protected state mutation surprises.
- The test's polymorphic payroll and approval scenarios pass for mixes that include all current subtypes.
- Bonus: a short comment or `reasoning.md` explaining which original override violated which part of the contract (pre/post/exceptions) and how the fix restores substitutability.

## Getting Started
```bash
# from repo root
npx vitest run exercises/oop/liskov-substitution/01-basic-employee-hierarchy
```

## How the judge will evaluate
See the rubric for this exercise in `AGENTS.md` (section "OOP / Liskov Substitution / 01-basic-employee-hierarchy").
Tests verify pay and approval numbers for direct use plus a simple polymorphic processor. The judge will flag designs that still require clients to special-case subtypes or that "fix" by weakening the base contract. It will praise designs where you can drop any subtype into an `Employee[]` processor and get correct, unsurprising results.

## After you are done
1. Make tests green.
2. Run the 4-point self-calibration checklist from the root README.
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial").
4. Only after receiving the review, reveal `reference/solutions/exercises/oop/liskov-substitution/01-basic-employee-hierarchy/` and compare designs.
