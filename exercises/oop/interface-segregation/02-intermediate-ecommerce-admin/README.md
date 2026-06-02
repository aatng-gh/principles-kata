# Interface Segregation Principle — Intermediate: E-commerce Admin

## Principle (recap)
Clients should not be forced to depend on interfaces (or methods) they do not use. A broad "IAdminService" that aggregates orders, inventory, reporting, users, and promotions means that a reporting dashboard, an inventory clerk UI, and a finance module all compile against (and are coupled to) the entire surface. Changes to any one area (new promo field, different refund rules) ripple to unrelated modules. Segregate so each client depends on the minimal surface it actually needs.

## Scenario
The back-office admin layer started as one `IAdminService` with methods for everything an admin might do. Now three distinct UIs / modules consume it:
- ReportingDashboard — only reads sales/orders data and generates reports.
- InventoryClerk — only adjusts stock levels and queries low-stock.
- FinanceModule — only handles refunds, payouts, and some reports.
Every compile of the dashboard pulls in the full admin surface (including user suspension and promo creation that it must never call). Adding a field to promos forces a recompile (and potentially a new no-op) in the inventory clerk code.

## Functional Requirements
- A single "real" admin implementation exists that can perform all operations (orders, stock, reports, users, promos).
- ReportingDashboard must be able to obtain sales reports and order lookups without any compile-time or runtime dependency on inventory mutation, user suspension, or promo creation.
- InventoryClerk must be able to update stock and list low stock without seeing refund or promo APIs.
- FinanceModule must be able to refund and (re)generate financial reports without depending on stock or user APIs.
- All three modules must continue to work when backed by the real full admin (which implements the union of the small contracts).
- Adding a new admin area (e.g. "support tickets") or changing one area must not require edits or recompiles in the modules that do not use it.

## Starter (what you are given)
See `src/ecommerceAdmin.ts` — a broad `IAdminService` interface, a `GodAdminService` that implements everything (with in-memory state), and three "module" classes (ReportingDashboard, InventoryClerk, FinanceModule) that each take `IAdminService` in their constructor but only use a subset of methods. The test drives the used subsets through the modules and verifies observable effects (stock changed, reports produced, refunds recorded).

## Criteria (principle-specific success bar — this is what the judge will score)
- ReportingDashboard (etc.) is typed against a narrow interface containing only the methods it calls (e.g. `IReporting`, `IOrderReader`).
- InventoryClerk depends only on stock-related operations.
- FinanceModule depends only on refund + financial report operations.
- The real `GodAdminService` (or its replacement) implements all the small interfaces so it can still be passed where a full admin is needed.
- No module source file mentions (or is forced to compile against) methods it will never invoke.
- Adding support for a new concern (e.g. `ISupportTickets`) is a new small interface + implementation in the real admin + wiring only for the one new module that needs it; the other two modules and their interfaces are untouched.

## Expectations (code quality + demonstration)
- 4–6 focused interfaces (group related methods; avoid one-method-per-interface overkill for this scope).
- The three modules' constructors take only the slice they need.
- The god / real admin can be `class GodAdminService implements IReporting, IInventory, IFinance, ...`
- Or a composition root returns an object that satisfies multiple small interfaces.
- State (orders, stock levels, refunds) is still correctly mutated by the operations the modules exercise.
- The provided test (which only exercises the relevant subsets) passes with identical effects.
- Bonus: explicit "role interfaces" with names that scream the consumer (e.g. `IStockOps` for the clerk).

## Getting Started
```bash
# from repo root
npx vitest run exercises/oop/interface-segregation/02-intermediate-ecommerce-admin
```

## How the judge will evaluate
See the rubric for this exercise in `AGENTS.md` (section "OOP / Interface Segregation / 02-intermediate-ecommerce-admin").
Tests only invoke the methods each module legitimately needs and assert side effects (stock deltas, refund records, report content). The judge will flag any design where `ReportingDashboard` still has `IAdminService` in its type signature or where the god class is the only thing and small interfaces are not used by the clients. It will praise when the three modules' files have no knowledge of the concerns they do not own.

## After you are done
1. Make tests green.
2. Run the 4-point self-calibration checklist from the root README.
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial").
4. Only after receiving the review, reveal `reference/solutions/exercises/oop/interface-segregation/02-intermediate-ecommerce-admin/` and compare designs.
