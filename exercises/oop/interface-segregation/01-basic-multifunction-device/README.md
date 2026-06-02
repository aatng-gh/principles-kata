# Interface Segregation Principle — Basic: Multifunction Device

## Principle (recap)
Clients should not be forced to depend on methods they do not use. A fat interface that combines many capabilities forces implementers (and callers) to know about and provide stubs for features they will never call. Segregate into small, role-specific interfaces so that a client depends only on the capabilities it actually needs.

## Scenario
You have a multifunction printer/scanner/fax/copier. The initial design defined a single `IMachine` with all four operations. Now there are three different clients:
- A "basic printer" appliance that only ever prints.
- An admin console that wants to drive the full machine.
- A fax gateway that only sends/receives faxes.
Every time a new "basic" client appears, its implementer must provide no-op or throwing versions of scan/fax/copy, and the interface change for one capability risks the unrelated clients.

## Functional Requirements
- There is a real multifunction implementation that can print, scan, fax, and copy.
- A `BasicPrinter` (or equivalent client) only needs to print; it must not be required to implement or even know about scan/fax/copy.
- A `FaxGateway` only needs fax; it must not be coupled to print/scan/copy.
- An admin or "full" client can use all capabilities (the real machine satisfies the union).
- Calling an unsupported operation on a limited client should not be possible at the type level (no "not supported" methods visible to that client).

## Starter (what you are given)
See `src/multifunctionDevice.ts` — a single `IMachine` interface with all four methods, plus a `MultiFunctionMachine` that implements them all, and "client" classes (`BasicPrinter`, `FaxGateway`, etc.) that are also forced to implement the full `IMachine` (with dummies or throws for the parts they don't use). The test exercises the used methods on each client.

## Criteria (principle-specific success bar — this is what the judge will score)
- After refactoring, `BasicPrinter` (or its analog) depends only on a `IPrinter` (or `Printable`) interface containing `print`.
- `FaxGateway` depends only on a `IFax` (or `Faxable`) containing the fax operations.
- The real multifunction device implements all the small interfaces (or a composite that aggregates them).
- No client class is forced to implement (or even mention) methods it never calls.
- Adding a fifth capability (e.g. `IStaple`) requires a new small interface + updates only to the clients and impls that actually care; the `BasicPrinter` and `FaxGateway` source are untouched.

## Expectations (code quality + demonstration)
- Small, focused interfaces: one (or very few) methods each, named for the role (`IPrinter`, `IScanner`, `IFaxMachine`, `ICopier`).
- The full machine can be `MultiFunctionMachine implements IPrinter, IScanner, IFaxMachine, ICopier`.
- Client code is typed to the small interface it needs (e.g. `class BasicPrinterClient { constructor(private p: IPrinter) {} ... }`).
- No `throw new Error('not supported')` or empty bodies for unused methods in the segregated clients.
- The test (which only calls the relevant methods) continues to pass.
- Bonus: the admin console can be shown taking the full machine (or a union type) while the limited clients take only their slice.

## Getting Started
```bash
# from repo root
npx vitest run exercises/oop/interface-segregation/01-basic-multifunction-device
```

## How the judge will evaluate
See the rubric for this exercise in `AGENTS.md` (section "OOP / Interface Segregation / 01-basic-multifunction-device").
Tests only call the methods each client actually needs and verify they work on the real machine. The judge will penalize any design where a "BasicPrinter" class still declares `scan()` or `fax()` (even as no-ops), or where the only segregation is renaming the fat interface. It will praise clean role interfaces and clients that literally cannot see the capabilities they don't use.

## After you are done
1. Make tests green.
2. Run the 4-point self-calibration checklist from the root README.
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial").
4. Only after receiving the review, reveal `reference/solutions/exercises/oop/interface-segregation/01-basic-multifunction-device/` and compare designs.
