# Why this design (ISP intermediate ecommerce admin)

The three consumers have completely different reasons to change:
- Reporting cares about read models for sales/orders.
- Inventory cares about stock mutations and queries.
- Finance cares about monetary mutations (refunds) and financial reports.

In the starter they were all coupled to one `IAdminService` (plus the god had to expose user/promo even for a dashboard).

Now:
- `ReportingDashboard` only takes `IReporting`.
- `InventoryClerk` only takes `IInventoryOps`.
- `FinanceModule` only takes `IFinanceOps`.

`GodAdminService` implements the small contracts (and the old broad `IAdminService` for any legacy full-admin code). Adding a "support" area only affects a new `ISupport` interface, the god, and whichever one module needs it.

The test continues to pass because a `GodAdminService` instance is structurally compatible with each narrow interface, and only the legitimately used methods are invoked by each module.
