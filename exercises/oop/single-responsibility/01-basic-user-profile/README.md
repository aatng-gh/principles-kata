# Single Responsibility Principle — Basic: User Profile Service

## Principle (recap)
Every module or class should have **one, and only one, reason to change**. A reason to change is a single user or stakeholder need (e.g. "change how we store users" vs "change the welcome email copy" vs "change validation rules").

## Scenario
You are building the profile registration flow for a small SaaS. The initial `UserProfileService` was written in one afternoon and now does four distinct things inside a single class (or file). New requirements keep coming from four different teams (auth, data, marketing, compliance), and every change risks breaking unrelated behavior.

## Functional Requirements
- `register(input)` creates a user record, sends a welcome email, writes an audit log entry, and returns the created profile (or throws/returns error).
- Input has `email`, `displayName`, optional `marketingOptIn`.
- Must enforce basic validation (email format, displayName length).
- "Persistence" is an in-memory map for this exercise (in real life it would be a DB).
- "Email" and "audit" are simulated via injected or provided ports that just record calls.

## Starter (what you are given)
See `src/userProfileService.ts` — a single service that mixes validation, persistence, email, and logging. The test file is already written against the public API.

## Criteria (principle-specific success bar — this is what the judge will score)
- After your changes, **no module has more than one reason to change**.
- Validation logic, persistence (repository), email notification, and audit logging are each in their own module with a single, clear responsibility.
- Adding a new validation rule touches *only* the validation module (and its tests).
- Swapping the in-memory persistence for a "real" one (or a test fake) touches *only* the repository module + the composition root (the service that wires things).
- The public `register` API (or a thin application service) remains the only thing most callers depend on.
- No god class or file that "knows about" all four concerns.

## Expectations (code quality + demonstration)
- Use interfaces or abstract types for the collaborators (e.g. `UserRepository`, `EmailNotifier`, `AuditLogger`).
- Constructor or function injection (or a small composition root) — no `new EmailSender()` inside the high-level logic.
- Clear naming: the module/file name should scream its single responsibility.
- Types are precise; no `any`.
- The test must still pass (behavior unchanged).
- Bonus (will be praised in review): a short `reasoning.md` or comments that explicitly call out the four stakeholders/reasons and which module owns each.

## Getting Started
```bash
# from repo root
npx vitest run exercises/oop/single-responsibility/01-basic-user-profile
```

## How the judge will evaluate
See the rubric for this exercise in `AGENTS.md` (section "OOP / Single Responsibility / 01-basic-user-profile").
The tests only verify that registration still works and produces the right observable effects. The judge will look for whether you actually separated the concerns or just moved code around inside one file / added private helpers that are still one reason to change.

## After you are done
1. Make tests green.
2. Run the 4-point self-calibration checklist from the root README.
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial").
4. Only after receiving the review, reveal `reference/solutions/exercises/oop/single-responsibility/01-basic-user-profile/` and compare designs.
