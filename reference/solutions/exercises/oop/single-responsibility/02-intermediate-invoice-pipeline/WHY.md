# Why this design (SRP intermediate invoice pipeline)

The four stakeholder concerns (finance/tax calc, data/persistence, legal/docs PDF, success/notification) each have their own module and interface:
- `DefaultInvoiceCalculator` owns only the arithmetic and tax rules.
- `InMemoryInvoiceRepository` owns only storage.
- `ConsolePdfRenderer` owns only the render stub contract.
- `ConsoleInvoiceNotifier` owns only delivery of the "ready" message.

The `InvoiceCreationService` is a thin orchestrator (one reason to change: the flow of invoice creation). Adding e.g. a discount rule only changes the calculator + its tests + the one call site that wires it. Swapping storage, renderer, or notifier is a one-line wiring change + new impl. The facade `InvoiceService` exists only to satisfy the exercise test contract without leaking the internal names.

This separation survives the "four teams request independent changes" scenario described in the README.
