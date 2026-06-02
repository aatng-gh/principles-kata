# Pure Core, Impure Shell — Intermediate: Order Workflow

## Principle (recap)
Complex workflows (approval, payment, fulfillment) contain decision logic ("can we approve this? what discount? ship now or later?") that should be pure and total (explicit Result for errors) so it is testable without any I/O. The shell performs the reads (load order, load inventory, get clock), calls the pure decider(s) which return Result<Decision, Err> or a list of Commands, then the shell executes the commands/effects using the real ports (DB, email, payment gateway). This separation gives testability of decisions + clear effect boundaries.

## Scenario
The order approval workflow was written as one async function that loads from DB, decides, updates DB, sends email, calls payment in try/catch all interleaved. You cannot test "would this $12000 order from a new user be auto-rejected?" without a real DB and payment stub that throws; every change risks side effects; replaying a failed order requires mocking the entire world.

## Functional Requirements
- processOrder(orderId) loads, decides approval/reject/payment, performs updates, emails, payment.
- For this exercise the "DB" and "payment" and "email" are fakes that log (observable in tests).
- Decisions must be expressible without performing the effects (so a pure decider can be unit tested with plain data).

## Starter
See `src/orderWorkflow.ts` — single async processOrder with DB calls, decision ifs, more DB, email, try payment all mixed. Uses the Result type in import but doesn't really use it for core.

## Criteria (principle-specific)
- Pure decision function(s) e.g. `decideOrder(order: OrderData, now: Date): Result<Decision, string>` that return ok({status, commands: [...]}) or err.
- Commands are data (e.g. {kind: 'Charge', amount}, {kind: 'SendEmail', to, body}).
- Shell loads data, calls pure decider, then pattern-matches on the returned commands and executes them (using the provided fakes or real adapters).
- No decision if/else lives in the same function that does await db or await pay.

## Expectations
- Use shared Result from `../../../lib/result` (ok/err/flatMap/isOk).
- Pure decider is deterministic and has no side effects or async.
- Shell is the only place with the fakes / awaits / try.
- The test (which observes the log effects for allowed flows) still passes.
- Bonus: the returned commands from pure can be asserted in additional tests the learner writes.

## Getting Started
```bash
npx vitest run exercises/fp/pure-core-impure-shell/02-intermediate-order-workflow
```

## How the judge will evaluate
See AGENTS.md rubric. Tests check high-level success and that effects happened (via spies on console). The judge will look for whether the *decision* ("approve or not") was pulled into pure Result-returning code or whether the whole workflow is still one big effectful async function with the "if pending" logic buried inside the awaits.

## After you are done
Follow the exact order in the root README: tests green → self-checklist → judge via AGENTS.md (adversarial) → *only then* reveal reference/solutions.
