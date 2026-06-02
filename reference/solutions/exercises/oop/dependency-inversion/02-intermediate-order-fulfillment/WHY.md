# Why this design (DIP intermediate order fulfillment)

The high-level fulfillment rules live in `FulfillmentService` and only talk to four ports:
- OrderRepository
- PaymentGateway
- Inventory
- Clock

All four concrete adapters (`InMemory*`, `Fake*`, `SystemClock`/`TestClock`) implement the ports and contain the details (in-memory maps, the console "stripe", the real Date).

The ctor accepts the ports (with in-memory defaults only to keep the exercise test's `new FulfillmentService()` and `seedOrder`/`getOrder` helpers working unchanged).

A `TestClock` lets tests control time if rules ever become time-sensitive. A new payment provider is a new class implementing `PaymentGateway` + one line at the composition root. The policy and the other three ports never change.

This is a minimal ports-and-adapters (hexagonal) slice for the "full" high-level policy described in the catalog.
