# Single Responsibility Principle — Intermediate: Invoice Pipeline

## Principle (recap)
Every module or class should have **one, and only one, reason to change**. A reason to change is a single user or stakeholder need (e.g. "change how we store users" vs "change the welcome email copy" vs "change validation rules").

## Scenario
You are extending the billing system for an e-commerce platform. The initial `InvoiceService` was a quick win that now mixes four concerns: calculating line totals and taxes, persisting the invoice record, rendering a PDF document stub, and sending notifications to the customer and accounting. Changes from finance (tax rules), ops (storage), legal (PDF format), and marketing (notification copy) all collide in one place, causing merge conflicts and brittle tests.

## Functional Requirements
- `createInvoice(input)` computes totals (10% tax), persists the record, "renders" a PDF stub, sends notifications, and returns the invoice.
- Input specifies `customerId` and list of `items` (description + amount).
- "Persistence" simulated with in-memory store.
- PDF and notifications simulated via console (or injectable ports in good design).
- Must reject invalid inputs (empty customer or items).

## Starter (what you are given)
See `src/invoiceService.ts` — a single service that mixes calculation, persistence, PDF rendering, and notifications. The test file is written against the public API (create + get for verification).

## Criteria (principle-specific success bar — this is what the judge will score)
- After your changes, **no module has more than one reason to change**.
- Invoice calculation, repository/persistence, PDF rendering, and notification are each in their own module with a single, clear responsibility.
- Adding a new tax rule or line item discount touches *only* the calculator module.
- Swapping the persistence (in-mem to DB) or the PDF engine touches *only* the corresponding module + wiring.
- The public creation API remains stable for callers.
- No god class/file that owns calc + storage + render + notify.

## Expectations (code quality + demonstration)
- Use interfaces or abstract types for the collaborators (e.g. `InvoiceCalculator`, `InvoiceRepository`, `PdfRenderer`, `NotificationService`).
- Constructor or function injection (or a small composition root) — no direct `new` of low-level inside the high-level flow.
- Clear naming: file/module names make the single responsibility obvious.
- Types are precise; no `any`.
- The test must still pass (observable behavior unchanged).
- Bonus: comments or `reasoning.md` that map the 4 stakeholder concerns to the modules that own them.

## Getting Started
```bash
# from repo root
npx vitest run exercises/oop/single-responsibility/02-intermediate-invoice-pipeline
```

## How the judge will evaluate
See the rubric for this exercise in `AGENTS.md` (section "OOP / Single Responsibility / 02-intermediate-invoice-pipeline").
The tests only verify that invoice creation produces correct numbers and side effects are triggered. The judge will look for whether concerns are truly separated or just "refactored" inside one file / via private methods.

## After you are done
1. Make tests green.
2. Run the 4-point self-calibration checklist from the root README.
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial").
4. Only after receiving the review, reveal `reference/solutions/exercises/oop/single-responsibility/02-intermediate-invoice-pipeline/` and compare designs.
