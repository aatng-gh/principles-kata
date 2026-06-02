# Why this design (LSP intermediate asset valuation)

The special "haircut" for RE and "count more" for options lived in the service via instanceof — classic LSP smell (clients of Asset had to know concrete kinds to get correct aggregates).

Now each asset owns its complete valuation model:
- RealEstate.getValue applies the 0.95 internally.
- Option is pure (no lastValued mutation) and reports its risk contribution.

ValuationService is now two trivial, uniform reduces that only talk to the Asset contract. The numeric contribution of any existing asset in a batch is produced by that asset's own methods.

A new Derivative can implement Asset { getValue, getRisk }, be pushed into any portfolio array, and both the old assets' values and the aggregate formulas remain completely untouched and correct. No edit to service, no risk of invalidating prior calculations.

This satisfies the force: "new derivative subtype must not invalidate existing total or risk calculations."
