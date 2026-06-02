# Why this design (ISP basic multifunction device)

The original fat `IMachine` forced every implementer and every client to acknowledge print+scan+fax+copy.

Now we have four tiny interfaces (`IPrinter`, `IScanner`, `IFax`, `ICopier`).

- `BasicPrinter` implements only `IPrinter` — it literally cannot see or be asked to implement the others.
- `FaxGateway` implements only `IFax`.
- `MultiFunctionMachine` implements all four (the "real" device still does everything).
- `AdminConsole` is typed to the intersection `IMachine` (or could take the concrete) for the cases that genuinely need the union.

Adding a stapler capability means one new `IStapler` interface, update only `MultiFunctionMachine` (and any new stapler-aware client), and zero changes to `BasicPrinter.ts` or `FaxGateway.ts` source or their dependencies.

This is the textbook ISP outcome for the "basic printer, admin, fax gateway" clients described in the README.
