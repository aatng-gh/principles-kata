# Dependency Inversion Principle — Basic: Notification Service

## Principle (recap)
High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details; details should depend on abstractions. Concretions (EmailSender, SmsSender, FileLogger) should be injected, not `new`ed inside the high-level policy (OrderProcessor).

## Scenario
An `OrderProcessor` is the high-level orchestrator for order confirmation. It currently `new`s concrete `EmailSender`, `SmsSender`, and `FileLogger` inside its `process(order)` method. This makes the processor hard to test (real sends, real files), hard to swap channels ("we now send push instead of SMS"), and couples the high-level flow to low-level implementation details (SMTP creds, file paths, message formatting).

## Functional Requirements
- `process(order)` for a valid order sends a confirmation email, optionally an SMS, and writes an audit log entry.
- "Send" and "log" are simulated (console or in-memory recording is fine for the exercise).
- The processor must still produce the same observable notifications and logs when using the default implementations.
- It must be possible to run the processor with test doubles (fakes/spies) that record calls without any real I/O or network.
- Swapping the email implementation (e.g. from console to a real mailer, or adding a second channel) must not require changes to `OrderProcessor`.

## Starter (what you are given)
See `src/notificationService.ts` — `OrderProcessor` that directly constructs `EmailSender`, `SmsSender`, and `FileLogger` (simple classes that log to console or accumulate). The test exercises `process` and observes the side effects via spies or inspection helpers.

## Criteria (principle-specific success bar — this is what the judge will score)
- `OrderProcessor` depends only on abstractions (`INotifier`, `ILogger` or similar) — it never imports or `new`s a concrete sender or logger.
- The concrete `EmailSender`, `SmsSender`, `FileLogger` (or their replacements) implement the abstractions.
- Construction / wiring of the concretions happens outside the processor (ctor injection, factory, or a tiny composition root).
- The processor is fully testable with fakes that implement the abstractions (no console, no files touched during unit tests of the flow).
- Adding a new channel (e.g. `PushNotifier implements INotifier`) or a different logger requires only a new impl + change at the wiring site; `OrderProcessor` source is untouched.

## Expectations (code quality + demonstration)
- Clear interfaces for the dependencies the high level needs (e.g. `interface INotifier { send(to: string, message: string): Promise<void>; }`, `interface ILogger { log(message: string): void; }`).
- `OrderProcessor` receives its dependencies via constructor (or a `configure` that is only called from the composition root).
- Default wiring can be provided for convenience (so `new OrderProcessor()` still works for the original test contract), but the injected path is the primary one.
- Concretes are in their own modules/files and only know the abstractions.
- Types strict; no `any`; async where appropriate for the "send" ports.
- The test (and any added tests using fakes) must pass with the same observable behavior for the happy path.
- Bonus: a small `createOrderProcessor()` factory or composition root in an `index.ts` or `wiring.ts` that shows the production wiring.

## Getting Started
```bash
# from repo root
npx vitest run exercises/oop/dependency-inversion/01-basic-notification-service
```

## How the judge will evaluate
See the rubric for this exercise in `AGENTS.md` (section "OOP / Dependency Inversion / 01-basic-notification-service").
Tests verify that processing an order produces the expected notifications and logs. The judge will be strict on any `new EmailSender()` (or equivalent) remaining inside `OrderProcessor` or its private helpers, even if a "for test" overload exists. It will praise when the processor source has no knowledge of which concrete channels are used and when fakes can be dropped in with zero changes to the flow logic.

## After you are done
1. Make tests green.
2. Run the 4-point self-calibration checklist from the root README.
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial").
4. Only after receiving the review, reveal `reference/solutions/exercises/oop/dependency-inversion/01-basic-notification-service/` and compare designs.
