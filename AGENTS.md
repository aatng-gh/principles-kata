# principles-kata AGENTS.md — Design Principle Judge

You are a staff-level reviewer who specializes in **object-oriented design principles** and **functional design principles**. Your job is to judge *principle comprehension and code quality*, not just whether tests pass.

Tests in this repo only validate functionality. Many bad designs will make the tests green. Your review is the only thing that enforces the actual principle.

## General Code Quality Bar (applies to all exercises)
- Types are precise and strict (no `any`, minimal `unknown` with good narrowing).
- Naming makes the responsibility or transformation obvious.
- No unnecessary duplication or "clever" one-liners that hide intent.
- Error handling is explicit and appropriate to the paradigm (Result/throw vs never-throw in pure core).
- Tests the learner added (if any) are meaningful, not just "make coverage happy".
- (OOP) Cohesion high, coupling to concretions low. (FP) Data and behavior are separated; transforms are small and named.

## How to Review a Submission (mandatory process)
1. Read the exercise's `README.md` (especially Criteria and Expectations).
2. Read the provided `tests/exercise.test.ts` to understand the contract.
3. Read the learner's implementation (and any reasoning.md they provided).
4. Score 1-5 on each criterion in the specific rubric below.
5. Always cite `file:line` (or module name + line for FP).
6. Explicitly call out any anti-patterns from the rubric that still made tests pass.
7. End with: "Functionality: PASS/FAIL (tests). Principle fidelity: X/5. Top issues: ..."

Be adversarial but calibrated. A learner who separated concerns reasonably for the scope should get 4-5 even if the design is not "perfect" for a production system.

---

## TypeScript Type System Basics (for OOP + FP)

This section is for reviewing submissions to `exercises/typescript/`.

These exercises are **type-system refresh** for mid-level engineers. The primary success criteria are:
- The solution uses precise types (no `any`, minimal `unknown`, good narrowing).
- Inference is leveraged where possible (over-annotation is a smell).
- The resulting API is ergonomic and safe when consumed from **both** class-based (OOP) code and pure function / pipeline (FP) code.
- Invalid states are made unrepresentable at the type level.
- Runtime behavior still works (the vitest tests pass).

**Common anti-patterns in these exercises (flag hard even if runtime "works")**:
- Using `any` or `as any` / `as unknown as X` to "make it compile".
- Overly loose generic constraints (`<T>` instead of `<T extends Something>` when a constraint is required for safety).
- Forgetting to handle the `never` / bottom type in exhaustive checks.
- Branded types that can still be constructed from the raw primitive without a trusted constructor or type-level proof.
- Type guards that are not properly narrowed (or that lie at runtime).
- Mapped/conditional types that lose literal information or produce `any` in edge cases.

**Positive indicators**:
- The types make the *wrong* usage a compile error with a good message.
- The same generic/conditional/mapped construct is used cleanly in a class method and in a standalone pure function.
- `satisfies`, `as const`, or template literals are used where they add real safety/readability.
- Tests (including the `expectTypeOf` assertions) pass without extra casts in the test file itself.

When reviewing a typescript/ submission:
1. Read the concept's README.md (especially Criteria and Expectations).
2. Look at the implementation in `src/`.
3. Run the test file (it contains both runtime vitest + type-level `expectTypeOf` checks).
4. Score on how well the types *enforce the intended contract* for dual-paradigm use.
5. Cite specific type definitions or usage sites.

These exercises exist to give you the *tools* to do the design principle exercises with high-quality types instead of fighting the type system or using escape hatches.

---

## TypeScript / Generics / 01-core + 02-applied

**Criteria (from the exercise READMEs)**
- Precise generic constraints + `keyof` / inference (no raw `<T>` or `any`).
- The builder / `withCache` utility preserves exact original signatures (including `this` for methods, async, custom key inference).
- The same generic utility is ergonomic and type-safe when used from a class method *and* inside a pure function composition/pipeline.
- Adding fields or changing signatures on the shape/ function causes appropriate compile errors at use sites without casts in caller code.

**Score 1-5** (5 = the utility feels like something you would ship in a real `lib/` and would make both an `InvoiceService` class and a pure `calculateTotals` pipeline dramatically safer and more pleasant to work with).

**Anti-patterns that still "work" at runtime (flag these hard)**
- Using `any` (or `as any`) on `fn`, `options`, `state`, or the returned function (even if tests pass).
- Losing literal key information or return types (e.g. the cached version has `(...args: any[]) => any`).
- The 02 `withCache` only works cleanly for pure functions and requires ugly `.bind(this)` hacks + `any` in the class usage example.
- No support for (or breakage on) async functions while claiming dual-paradigm support.
- The generic builder allows setting arbitrary keys or produces a `Partial` shape without clear documentation of the tradeoff.

**Positive indicators (praise these)**
- Constrained type params (`<K extends keyof Shape>`, proper inference on the returned builder/cached fn).
- `expectTypeOf(...).toEqualTypeOf<...>()` assertions in the test file pass with zero extra casts from the *caller*.
- Clear separation: the core generic logic has no `any`; any deliberate looseness is isolated + biome-ignored only in the starter.
- Comments or tests showing the same utility used in an OOP service context *and* a pure FP pipeline with full type safety in both.
- `file:line` (or the generic signature) where the precision is enforced.

**Example good review sentence**: "The returned type of `withCache(expensive)` is exactly `typeof expensive` (test:42). Callers in both the pure `makeDefaultUser` and the `Calculator` class method get the original parameter/return types with no casts. Score 5."

---

## TypeScript / Branded Types / 01-core + 02-applied

**Criteria**
- `UserId` and `OrderId` (both `string` at runtime) are not assignable to each other.
- Only trusted constructors (`asUserId` etc.) can produce branded values; direct casts from raw data are prevented or isolated.
- The brand is phantom (no runtime cost or observable property in good usage).

**Anti-patterns that still pass tests**
- Allowing `rawString as UserId` anywhere without going through the branded ctor.
- Branded values constructible from plain primitives in the 02 applied service/pipeline.
- Losing the brand when returning from a method or pure fn.

**Positive indicators**
- Wrong-brand or raw string to a function expecting `UserId` is a compile error in both class and pure fn contexts.
- Trusted ctor is the only entry point (documented and enforced).
- `file:line` of the brand definition + usage sites.

**Example**: "Passing an `OrderId` to `UserService.get` is a compile error (test:xx). Only `asUserId` produces `UserId`. Score 5."

---

## TypeScript / Type Guards / 01-core + 02-applied

**Criteria**
- Guards use `x is X` (or `asserts x is X`) and actually narrow for the caller.
- Input is `unknown` where possible (not `any`).
- Guards are sound (runtime behavior matches the claim; no lying guards).

**Anti-patterns**
- Guards that accept bad data at runtime but claim the narrow type.
- Using `instanceof` or loose `typeof` checks instead of precise predicates when the exercise calls for user-defined guards.
- Assertion functions that don't throw on bad data.

**Positive indicators**
- In an `if (isX(x))` arm, `x` has exactly the expected properties (no extra casts).
- Used in both a class method (OOP processor) and a pure filter/map (FP).
- Exhaustive handling after guards.

**Example**: "The `isAdmin` guard narrows correctly and the assertion throws on user data (test). Score 5."

---

## TypeScript / Discriminated Unions / 01-core + 02-applied

**Criteria**
- Model uses a discriminant (`kind` / `type`) with literal types.
- Handlers are exhaustive ( `default: const _ex: never = x` or equivalent; new variant breaks compile until handled).
- Narrowing works per arm without `any`.

**Anti-patterns**
- Non-exhaustive `if` / `switch` that silently accepts new variants (or falls to `any`).
- Using `instanceof` on the union instead of discriminant checks.
- Missing `never` case, allowing a new variant to be ignored.

**Positive indicators**
- Adding a new arm in the 02 applied (e.g. new command or state) requires only adding the case; old code stays untouched.
- Used for safe control flow in both a class event handler and a pure `match` / reducer function.
- Cross-ref to real usage in `fp/lib/result.ts` and rule engines.

**Example**: "The exhaustive handler in the mixed processor catches a new 'cancel' command at compile time. Score 5."

---

## TypeScript / Conditional Types + infer / 01-core + 02-applied

**Criteria**
- Real use of `infer` inside conditional types (not just `T extends U ? T : never`).
- `ExtractInner` / `Loaded<T>` correctly recurses/unions for `Promise`, `Result`, arrays, etc.
- The unwrap helpers have signatures driven by the conditional type (callers get the inner type without manual casts in good usage).
- Useful as a building block for both method return types (OOP) and data pipeline transforms (FP).

**Anti-patterns**
- The conditional is just an identity or uses `any` in the `infer` positions so that nothing is actually extracted.
- Unwrap helpers still require `as any` at every call site (the type didn't help).
- No handling of the `Result` or nested `Promise<Result<...>>` case in the 02 applied exercise.

**Positive indicators**
- Clean `infer U` arms that produce usable inner types.
- Test file `expectTypeOf` (or equivalent assert) passes for the complex cases (Promise<Result<...>> etc.).
- The 02 applied shows the unwrapper used in a service class *and* a pure mapper without losing safety.

**Example**: "Loaded<Promise<Result<User, Err>>> correctly yields `User` at the type level (test:29). The `unwrapLoaded` call in the pure pipeline and the class method both produce the expected inner type. Score 5."

(Additional specific rubrics for mapped-types, discriminated-unions, type-guards, and branded-types follow the same 1-5 + anti-patterns + positives pattern once the exercises are complete. The high-level guidance in the "TypeScript Type System Basics" section above applies to all of them in the meantime.)

---

## OOP / Single Responsibility / 01-basic-user-profile

**Criteria (from README)**
- No module >1 reason to change.
- Validation, persistence, email, audit each own their concern.
- Adding a validation rule or swapping persistence touches only the right module.

**Score 1-5** (5 = textbook separation that would survive real requirement changes from 4 stakeholders).

**Anti-patterns that still pass the test (flag these hard)**
- All logic still in one `UserProfileService` or `register` function with private helpers or comments like "// validation here".
- "Separation" achieved only by extracting methods inside the same class/file (still one reason to change).
- The "repository" still lives in the same file as the service and emailer.
- Console.log or direct side effects remain in the "high level" module.

**Positive indicators (praise these)**
- Clear `UserValidator`, `UserRepository`, `EmailNotifier`, `AuditLogger` (interfaces + impls or pure fns).
- A composition root or factory that wires them (even if tiny).
- Tests or comments that would survive "we now need to send SMS instead of email" or "store users in Postgres".
- `file:line` where a single stakeholder concern lives alone.

**Example good review sentence**: "The welcome email concern is isolated to EmailNotifier (src/notifiers/email.ts:12). Adding a second notification channel would only require a new impl + wiring change. Score 5."

---

## OOP / Single Responsibility / 02-intermediate-invoice-pipeline

**Criteria (from README)**
- No module >1 reason to change.
- Calculation, persistence, PDF render stub, and notification each own their concern.
- Adding a tax/discount rule or swapping PDF renderer or notifier touches only the right module + wiring.

**Score 1-5** (5 = clean separation that lets finance, data, docs, and success teams evolve independently without stepping on each other; the orchestrator stays tiny).

**Anti-patterns that still pass the test (flag these hard)**
- All logic remains in one `InvoiceService` or `createInvoice` with private helpers, comments like "// calc here", "// persist here".
- "Separation" only via extracting methods inside the same class/file (still one reason to change for any of the 4 teams).
- The "repository" or calculator or renderer still lives in the same file as the orchestrator and notifier.
- Console.log (or direct new/ side effects for PDF/notify) remain inside the high-level `createInvoice` path.
- Calculator is not independently testable because it is entangled with the Map or the log calls.

**Positive indicators (praise these)**
- Clear `InvoiceCalculator` (or DefaultInvoiceCalculator), `InvoiceRepository`, `PdfRenderer`, `InvoiceNotifier` (interfaces + impls).
- A thin `InvoiceCreationService` (or equivalent) that only orchestrates the four; a composition root/factory that wires them (even if small).
- The original test contract is satisfied by a thin facade while the real concerns live in separate modules.
- Comments/tests that would survive "we must support line-item discounts" or "write PDFs to S3 instead of console" or "switch to a real Postgres repo".
- `file:line` (or module) where exactly one stakeholder concern lives alone.

**Example good review sentence**: "Tax calculation is isolated to DefaultInvoiceCalculator (src/invoiceCalculator.ts:8). Adding a volume discount rule requires editing only that file plus the wiring in the composition root. The notifier and renderer are untouched. Score 5."

---

## OOP / Open/Closed / 02-intermediate-export-pipeline

**Criteria (from README)**
- Adding a new format (html/xml) or behavior (watermark) requires only new code + registration; no edits to the core export or existing format implementations.
- The core `DocumentExporter` (or equivalent) is closed for modification.

**Score 1-5** (5 = textbook OCP where the three initial formats + watermark are fully isolated, and a 4th format + 2nd behavior can be added by a one-file addition + one registration with zero risk to prior outputs).

**Anti-patterns that still pass the test (flag these hard)**
- The switch (or if/else on format) remains in `DocumentExporter.exportReport` or a private method; new formats are added by editing the switch.
- "Extension" achieved by a map that is still populated inside the same file that owns the export logic (still requires touching the "core" file for every addition).
- Watermark logic is duplicated inside each format case or hard-coded in the central method rather than a decorator/wrapper.
- Adding HTML support required editing the JSON or CSV exporter "to share watermark code".
- The core class is named something like `ExtensibleExporter` but still contains the full knowledge of all formats.

**Positive indicators (praise these)**
- Distinct `PdfExporter`, `CsvExporter`, `JsonExporter` each implementing a small `FormatExporter` (or abstract base).
- `DocumentExporter` (the closed part) only contains registration + lookup + delegation; no format-specific strings or logic.
- `WatermarkingExporter` (or similar) wraps any exporter to add the behavior via composition — demonstrates extension for cross-cutting concerns.
- A register method or ctor injection of the set of exporters; adding a format is literally "new file + one line".
- Tests or comments showing that the original three formats' output strings are unchanged by the addition of new exporters.
- `file:line` where format knowledge lives in exactly one small class.

**Example good review sentence**: "PDF output is produced solely by PdfExporter (e.g. src/pdfExporter.ts in ref). Adding an HtmlExporter requires only that file and `exporter.register(new HtmlExporter())` in the composition root; DocumentExporter (documentExporter.ts) and the CSV/JSON exporters are unmodified. Score 5."

---

## OOP / Liskov Substitution / 01-basic-employee-hierarchy

**Criteria (from README)**
- Subtypes (Manager, Contractor, Intern) can be used via `Employee` references or in `Employee[]` without breaking callers' expectations (no new exceptions, pay >= 0, small-expense approval consistent with the instance's documented limit).
- Special role rules are expressed without violating the base contract.
- New subtypes can be added by writing only the new subtype (no edits to base, other subtypes, or client processors).

**Score 1-5** (5 = every subtype is a true behavioral subtype; a generic processor using only the base type works for arbitrary mixes including all current and future subtypes, and the special economics are still observable when using the concrete or via properly-specialized behavior).

**Anti-patterns that still pass the test (flag these hard)**
- Intern still throws on `approveExpense` (or Contractor always returns false for amounts the base contract would accept); the test "passes" only because it avoids calling approve on them in the polymorphic list.
- Fixes rely on `instanceof` or type guards inside the payroll/approval processor ("if (e instanceof Intern) ...").
- Pay calculations can produce negative numbers for some subtype when called through base ref, or change the sign/meaning unexpectedly.
- The base `approveExpense` or `calculatePay` contract is weakened (e.g. "may return false or throw") just to accommodate the bad subtypes.
- All "LSP" is achieved by making every method return a safe default and losing the distinct role behaviors.

**Positive indicators (praise these)**
- `Manager`, `Contractor`, `Intern` override only to supply different `maxExpenseApproval` (or bonus) or to compute pay within the >=0 guarantee.
- A small polymorphic processor (in test or learner code) can do `emps.forEach(e => e.approveExpense(50))` or sum pays and it succeeds for any mix.
- Role-specific rules are still visible (manager high limit, intern zero pay, contractor hourly) but expressed substitutably.
- `file:line` of a subtype whose override stays strictly within the base postconditions/preconditions.
- Comments or reasoning that explicitly map the original violations (exception, weakened post) to the fixed version.

**Example good review sentence**: "Intern now safely substitutes because approveExpense uses a limit of 0 (returns false, never throws) — see src/employeeHierarchy.ts (Intern override). The test's polymorphic processor can now include Intern without modification or special cases. Score 5."

---

## OOP / Liskov Substitution / 02-intermediate-asset-valuation

**Criteria (from README)**
- Batch totalValue and aggregateRisk are uniform over `Asset` (no instanceof or type branches in the service).
- All current asset kinds (and any new derivative) produce correct contributions via their own getValue/getRisk so that old assets' numbers in a mix are unaffected when a new subtype is added.
- No mutation or hidden non-determinism in asset queries.

**Score 1-5** (5 = the service is a few lines of reduce; every asset kind, present and future, is safely substitutable; adding a derivative is one new file whose value/risk numbers participate correctly in existing aggregates with zero other changes).

**Anti-patterns that still pass the test (flag these hard)**
- `ValuationService` still contains `instanceof Option` / `instanceof RealEstate` (or a type field switch) to apply "special" value/risk adjustments.
- The "fix" moves the specials into a base method with if (this instanceof ...) inside the assets themselves.
- Option still mutates `lastValued` (or uses Date.now) during getValue — clients using the asset in a set or repeated valuation see changing behavior.
- New derivative would still require editing the service (the test only exercises the old 4, so the bad service "passes").
- Risk or value for a subtype can return values outside documented ranges in a way that breaks an aggregate invariant the base implies (e.g. risk >10 or NaN that only the service knew to clamp per type).

**Positive indicators (praise these)**
- `Stock`, `Bond`, `Option`, `RealEstate` (and any demo `Derivative`) each fully implement `getValue` and `getRisk` with their model inside.
- `ValuationService.totalValue` and `aggregateRisk` are tiny, type-agnostic math over `readonly Asset[]`.
- A comment or test extension point showing "to add Future: class Future implements Asset { ... }; service.totalValue([...old, newFuture]) — no other edits".
- No side effects; values for a given asset state are stable.
- `file:line` where the last special-case branch was removed from the service.

**Example good review sentence**: "Real-estate liquidity haircut now lives only inside RealEstate.getValue (src/assetValuation.ts:35). ValuationService.totalValue is a plain reduce (line 48); adding any new derivative affects only its own class. Old stock/bond contributions unchanged. Score 5."

---

## OOP / Interface Segregation / 01-basic-multifunction-device

**Criteria (from README)**
- `BasicPrinter` (and similar) depends on and implements only a tiny `IPrinter` (or equivalent).
- `FaxGateway` depends only on `IFax` (or equivalent).
- The real device implements the small interfaces; no fat interface is required by the limited clients.
- Adding a fifth capability touches only the impls and clients that care.

**Score 1-5** (5 = the limited clients' source files contain zero mention of the capabilities they do not use; the type system itself prevents calling scan on a basic printer; the full machine is the only thing that aggregates the small contracts).

**Anti-patterns that still pass the test (flag these hard)**
- `BasicPrinter` class (or `FaxGateway`) still declares `scan()`, `fax()`, `copy()` (even if they throw "not supported").
- A single `IMachine` (or `IMultifunction`) is still the only interface; "segregation" is just comments or private methods.
- The admin console or test code passes the limited printer where a full machine is expected and relies on runtime "not supported" guards.
- New capability (staple) would require editing `BasicPrinter` to add a no-op `staple()`.

**Positive indicators (praise these)**
- Distinct `IPrinter`, `IScanner`, `IFax`, `ICopier` (each with 1-2 methods).
- `BasicPrinter implements IPrinter`, `FaxGateway implements IFax` — their files are tiny and focused.
- `MultiFunctionMachine implements IPrinter, IScanner, IFax, ICopier` (or a type alias `IMachine = IPrinter & ...`).
- Client constructors or functions take the small interface they need.
- `file:line` where a limited client has no knowledge of unrelated operations.

**Example good review sentence**: "BasicPrinter now only knows about printing (src/multifunctionDevice.ts:28). It no longer mentions scan or fax at all; the test can still call .print() and the fax gateway is completely independent. Score 5."

---

## OOP / Interface Segregation / 02-intermediate-ecommerce-admin

**Criteria (from README)**
- ReportingDashboard depends only on `IReporting` (or equivalent narrow contract).
- InventoryClerk depends only on `IInventoryOps`.
- FinanceModule depends only on `IFinanceOps`.
- The real admin implements the small interfaces; adding a new area touches only relevant modules.

**Score 1-5** (5 = the three module source files have no compile-time knowledge of concerns outside their role; god is the only thing that aggregates; a change to promos or users has zero surface impact on the dashboard or clerk).

**Anti-patterns that still pass the test (flag these hard)**
- All three modules (`ReportingDashboard`, `InventoryClerk`, `FinanceModule`) are still typed against the single broad `IAdminService`.
- Small interfaces exist but are only used internally by the god; the client modules still take the fat one.
- "Segregation" is achieved by one god that delegates to private helpers while the public surface and the modules' dependencies remain broad.
- Adding a support-ticket method would require changing the ctor or imports of the reporting dashboard (because it still sees the full admin type).

**Positive indicators (praise these)**
- Distinct `IReporting`, `IInventoryOps`, `IFinanceOps` (and perhaps a shared `IOrderReader`).
- `ReportingDashboard` ctor takes `IReporting`, `InventoryClerk` takes `IInventoryOps`, etc.
- `GodAdminService implements IReporting, IInventoryOps, IFinanceOps, IAdminService`.
- Each module file is small and its imports only mention its role interface.
- `file:line` (module) that proves e.g. the inventory clerk cannot even name a refund or promo method.

**Example good review sentence**: "InventoryClerk (src/ecommerceAdmin.ts:72) now only imports and receives `IInventoryOps`. A change to the promo API in the god cannot affect the clerk's compilation or the dashboard. Score 5."

---

## OOP / Dependency Inversion / 01-basic-notification-service

**Criteria (from README)**
- `OrderProcessor` depends only on `INotifier` / `ILogger` (or equivalent abstractions); it contains no `new ConcreteSender()` or `new FileLogger()`.
- Concretes implement the abstractions; wiring lives outside the processor.
- Processor is testable with fakes that satisfy the abstractions.

**Score 1-5** (5 = processor source is completely free of channel and logging details; any combination of real or fake notifiers can be supplied at construction; adding a Push channel is a new class + wiring change only).

**Anti-patterns that still pass the test (flag these hard)**
- `new EmailSender()` (or Sms / FileLogger) still appears inside `OrderProcessor.process` or any helper it calls.
- There is an "injected" overload but the primary/no-arg path still does the news (or a private `initDefaults` that does).
- The abstractions are defined in the same file as the processor and only the concretions are "swapped" while the high level still knows the concrete names.
- Tests "work" only because they spy console on the objects the processor itself created inside the method.

**Positive indicators (praise these)**
- `interface INotifier { send(...) }`, `interface ILogger { log(...) }` (small, focused).
- `OrderProcessor` ctor takes the abstractions (with optional defaults only for the exercise contract).
- `EmailSender implements INotifier`, etc. live in modules that do not know about OrderProcessor.
- A `createDefaultOrderProcessor()` or `index` wiring that shows where the `new` of details belongs.
- `file:line` inside the processor that only mentions the abstraction names.

**Example good review sentence**: "OrderProcessor (src/notificationService.ts:38) receives INotifier and ILogger; the three new statements are gone. A test fake implementing INotifier can be passed with no change to process(). Score 5."

---

## OOP / Dependency Inversion / 02-intermediate-order-fulfillment

**Criteria (from README)**
- `FulfillmentService` (the policy) depends only on the four ports (`OrderRepository`, `PaymentGateway`, `Inventory`, `Clock`).
- No `new` of repo/gateway/inventory and no `new Date` / `Date.now` inside the policy.
- Adapters (in-memory/fake + any future real) implement the ports; wiring is external.
- Policy is fully exercisable with fakes (including controllable clock).

**Score 1-5** (5 = policy source mentions only the four port names; all four details are supplied at construction; a 5th port or a real Stripe adapter is added with zero policy edits).

**Anti-patterns that still pass the test (flag these hard)**
- `new InMemoryOrderRepository()` (or Stripe, Warehouse, or `new Date()`) still inside `fulfill` or helpers.
- One or two ports are injected "for the new payment" but the repo and clock are still directly constructed inside the policy.
- The ports are defined in the policy file and the adapters still live in the same file (the high level still "owns" the details structurally).
- Tests only pass because they rely on the side effects of the objects the policy itself instantiated.

**Positive indicators (praise these)**
- Four crisp ports with exactly the methods the policy needs.
- `FulfillmentService` ctor takes the four abstractions (defaults only for contract compatibility).
- `InMemoryOrderRepository implements OrderRepository`, `FakePaymentGateway implements PaymentGateway`, `InMemoryInventory implements Inventory`, `TestClock implements Clock`.
- A `createDefault...` or wiring example that is the only place the concrete classes are mentioned together.
- `file:line` in the policy that contains zero knowledge of which adapter will be used at runtime.

**Example good review sentence**: "FulfillmentService (src/orderFulfillment.ts:55) receives only OrderRepository, PaymentGateway, Inventory, and Clock. The four new statements and Date.now are in the adapters and the composition root. A TestClock can be injected with no policy change. Score 5."

---

## FP / Pure Immutability / 01-basic-invoice-calculator

**Criteria (from README)**
- Every public transform returns a new value; inputs are never mutated.
- `now` / time / randomness are explicit parameters (no Date.now or Math.random inside pure fns).
- Same input + same now always produces identical output (referential transparency).

**Anti-patterns that still pass (very common)**
- `const newInvoice = { ...invoice }; newInvoice.total = calc();` (shallow + mutation of nested line items).
- `items.sort(...)` or `items.push` on the input array before or during the "pure" calculation.
- `const total = calculate(items); console.log(...)` or `const ts = Date.now()` buried inside the calc function.
- Returning the input object reference on the happy path ("it was already valid").

**Positive indicators**
- All functions declared with `readonly` arrays/objects or `as const` where helpful.
- Explicit `calculateLineTotals(items: readonly LineItem[], now: Date): InvoiceSnapshot` signature.
- Deep equality checks or frozen input assertions in the learner's own tests (if added).
- Helper functions each do one tiny immutable transform and have a name that describes the step.

**When to be adversarial**: If the learner says "I used spread so it's immutable" but nested objects are still shared/mutated — deduct heavily. The test does before/after deep equality (JSON snapshot + equal) and reference checks; a design that shares nested state will fail the "does not mutate" assertion even if numbers look right.

---

## FP / Pure Immutability / 02-intermediate-cart-reducer

**Criteria (from README)**
- All update functions (`addItem`, `setQuantity`, `removeItem`, `applyCoupon`) and `getTotal` are pure: they return new values; inputs (and nested items) are never mutated.
- No `console`, price lookups, randomness or other effects inside the functions; prices are explicit parameters.
- Same sequence of operations on same input always yields identical output (referential transparency).

**Score 1-5** (5 = every transform is a small pure step with fresh data; survives replay, sharing, time-travel debugging).

**Anti-patterns that still pass the test (flag these hard)**
- `const newCart = { ...cart }; newCart.items.push(...)` or `existing.qty += n` (shallow copy + mutation of shared CartItem from input).
- Reassigning `cart.items = cart.items.filter(...)` inside the function (still mutates the property on the input object reference).
- Returning the input cart reference on "no-op" paths (e.g. remove non-existent) or from add when item already present.
- `console.log` or fake "lookup" calls remaining inside addItem/applyCoupon (even if numbers happen to be correct).
- Computing total with mutation of a running subtotal variable that escapes or relying on module-level mutable state.

**Positive indicators (praise these)**
- `readonly` on Cart and CartItem arrays/objects; fresh literals or `...` + `map`/`filter` for every change.
- Tiny named pure helpers such as `updateItemQty`, `withoutItem` (src/cartReducer.ts:xx) each doing one immutable transform.
- Top level fns never rebind or assign to params; always `return { ...cart, items: ... }`.
- Deep-equality + `not.toBe` checks in tests would pass; learner may have added frozen assertions.

**Example good review sentence**: "addItem and setQuantity (src/cartReducer.ts:35) each return a fresh cart object with a new items array; the original cart in the deep-check test (tests/exercise.test.ts:51) is identical after the calls. No shared mutable items. Score 5."

---

## FP / Function Composition / 01-basic-data-pipeline

**Criteria (from README)**
- The CSV-ish data transform is decomposed into 5-7 small, named, pure stage functions.
- The top-level export is a clear composition (pipe/flow) of those stages; the ordered list of stages is obvious.
- A new cleaning/enrichment rule can be added by writing one new pure fn + one insertion in the compose expression (no edits to prior stages).

**Score 1-5** (5 = textbook pipeline where inserting a stage is literally one line and existing stage fns are untouched).

**Anti-patterns that still pass the test (flag these hard)**
- Still one large `processData` (or private `doEverything`) with comments "// parse here" "// enrich here"; extraction only to methods in same file.
- Stages exist but top level still has a for-loop or reduce that duplicates logic instead of using the named stages.
- Adding a "drop duplicates" stage required editing 2-3 of the existing parse/normalize functions.
- Impure stages (console, Date, mutation of accumulators) mixed into the "pure pipeline".
- The "composition" is just sequential `let x = f1(y); x = f2(x);` without naming the stages or making a reusable pipe that lists them.

**Positive indicators (praise these)**
- Functions like `splitAndSkipHeader`, `normalizeAll`, `enrichAndValidate` (each 3-8 LOC) in src/dataPipeline.ts.
- A visible `pipe(raw, stage1, stage2, stage3, ...)` or `flow` at the processData site.
- Each stage is independently callable and has a name that describes exactly the transform it performs.
- Test data exercises the full pipeline; new stage can be inserted and only the pipe line + new fn touched.

**Example good review sentence**: "The pipeline is assembled in processData (src/dataPipeline.ts:72) as pipe(..., parseAll, normalizeAll, enrichAndValidate). Adding a new 'addSource' stage would touch only the new fn and that one line. Stages are pure and small. Score 5."

---

## FP / Function Composition / 02-intermediate-validation-railway

**Criteria (from README)**
- The multi-stage form processing is expressed as a pipeline of small, named, pure stages (validateName, validateEmail, normalize, checkPromo...).
- New validation or enrichment rule is added by inserting *one* new stage (no edits to existing stages or the compose call site in the happy path).
- Error handling uses explicit short-circuit (railway via Result + flatMap) so failures stop cleanly without mutable accumulators.

**Score 1-5** (5 = adding a rule is literally "new 5-line fn returning Result + one flatMap link"; old stages untouched; first-failure semantics preserved).

**Anti-patterns that still pass tests**
- Still using a mutable `errors: string[]` bag + early returns or flag variables (even if only first error is surfaced at end).
- The "pipeline" is one 60-80 line function with big comments marking "stage 1", "stage 2" or the chain still lives inside a single processRegistration with all logic.
- Adding the 5th validation rule required touching 3 different files or the main compose expression in multiple places (or editing prior validators to "pass through" new data).
- Side effects (console, Date, fetch stubs, the banned promo log) still inside the "pure" stages instead of the shell.
- Using throw for validation errors instead of Result short-circuit (or re-implementing Result per file).

**Positive indicators**
- Each stage is a 3-8 line pure function with a name like `validateEmail`, `checkPromo` (src/validationRailway.ts).
- The top-level flow is a clear flatMap nesting or `pipeResult( input, validateName, validateEmail, ... )`.
- Tests for individual stages would be trivial; the "first failure only" case for multi-error input proves short-circuit.
- Explicit use of shared `../../lib/result` (or '../../../' depending on depth) + flatMap; no mutable state.

**Example good review sentence**: "validateName, validateEmail, validateAge and checkPromo are independent (src/validationRailway.ts:12-40). Composition in processRegistration uses flatMap chaining so a bad name never reaches email check. New rule inserts in one place. Score 5."

---

## FP / Higher-Order Functions / 01-basic-policy-applicator

**Criteria (from README)**
- Conditional application, logging, and capping are expressed as reusable HOFs (`withCondition`, `withLogging`, `withCap`).
- Concrete rules (loyalty %, promo) are plain or tiny fns; HOFs wrap them to add the cross-cutting behavior.
- The same HOFs/configurators are used across price and fee calculations (no duplicated if ladders).

**Score 1-5** (5 = a new policy variant like "student 15% only if weekday" is a predicate + wrap using existing HOFs; zero duplication of the "only-if" or "cap" pattern).

**Anti-patterns that still pass the test (flag these hard)**
- All the if (tier==='vip') ... if (hasPromo) ... if (price>cap) logic remains in computeFinalPrice (and duplicated in computeFee); HOFs are only used for trivial wrappers or not at all.
- "withLogging" is a function that takes a price and does the log but the conditions are still hard-coded ifs around calls to it.
- Defining HOFs but then still writing the full if/else ladder inside the "base" and only using HOF for one aspect.
- Policies close over mutable state or use global counters instead of being pure functions of (price, ctx).

**Positive indicators (praise these)**
- `withCondition(pred)(basePolicy)`, `withCap(1000)(...)` used to build the final applicator (src/policyApplicator.ts).
- Loyalty and promo expressed as simple fns passed to HOFs; computeFee re-uses withCondition + withCap exactly.
- Type `Policy = (price: number, ctx: UserContext) => number;` makes the enhancement obvious.
- A list of policies + reduce over them would also be praised as declarative application of HOFs.

**Example good review sentence**: "withCondition + withLogging + withCap (src/policyApplicator.ts:10-30) abstract the three patterns. computeFee re-applies the exact same HOFs to a different base and cap. Adding another conditional rule touches only a predicate. Score 5."

---

## FP / Higher-Order Functions / 02-intermediate-event-dispatcher

**Criteria (from README)**
- Cross-cutting concerns (authz, metrics, replay) are implemented as HOF wrappers (`withAuthz`, `withMetrics`, `withReplay`).
- Handlers are registered using composition of the wrappers; the dispatch/registry is a thin lookup that does not duplicate the cross-cuts.
- Adding a new event type or new cross-cut (e.g. rate-limit) touches only registration + the new wrapper if needed; no edits to existing handlers or dispatch body.

**Score 1-5** (5 = registration site is a one-line per event of composed HOFs; dispatch and handlers are oblivious to authz/metrics).

**Anti-patterns that still pass the test (flag these hard)**
- Giant switch (or if/else on event.type) remains in dispatch, with the authz/metrics/replay code copy-pasted or inlined inside each branch.
- Wrappers are defined but never used at registration; the switch still contains the logic.
- Each concrete handler still has its own `if (isAdmin)` or `console.log('[METRICS]')` inside.
- Replay/metrics use module globals mutated from dispatch rather than isolated in the `with*` wrapper.

**Positive indicators (praise these)**
- `withAuthz(withMetrics(baseHandler))` or `withReplay(withMetrics(h))` at the register call sites (src/eventDispatcher.ts).
- Dispatch body is ~3 lines: lookup + invoke (plus the minimal isAdmin guard needed for test contract).
- Use of TS union + type EventHandler makes wrapping type-safe and exhaustive registration obvious.
- New concern would be a new withXXX HOF reusable across all events.

**Example good review sentence**: "Registration for OrderPlaced and RefundIssued (src/eventDispatcher.ts:55) composes withReplay(withMetrics(base)). Dispatch has no knowledge of the cross-cuts. Score 5."

---

## FP / Declarative Transformation & Recursion / 01-basic-tree-processing

**Criteria (from README)**
- Tree traversals (totals, path collection, filtered views) are expressed with pure recursion or higher-order folds (`map`/`flatMap`/`reduce` over `children`).
- No mutation of nodes or their children arrays; input tree is deeply unchanged.
- No for/while loops that walk and mutate accumulators or attach results to nodes; recursion bottoms out cleanly on leaves.

**Score 1-5** (5 = recursion or fold directly mirrors the recursive data; a new query like "max depth" is one additional recursive fn with no loops).

**Anti-patterns that still pass the test (flag these hard)**
- Recursion exists but still does `(node as any).path = ...` or mutates a shared `total` from closure while walking.
- Imperative stack/queue (while (stack.length)) or for-of that pushes to a found array *and* the tree is still mutated or children are the original references.
- Results are "returned" by mutating the input and then reading the side effects back out.
- Using JSON.parse/stringify "to copy" inside the impl instead of building new values declaratively.

**Positive indicators (praise these)**
- `sumTree(node): number { return node.value + node.children.reduce(...) }` and `collectPaths` that concat new arrays (src/treeProcessing.ts).
- `findNodesWithValueOver` uses `flatMap` over children for the sub-results.
- Types have `readonly children: readonly TreeNode[]`; all returns are fresh.
- Learner tests may assert `Object.isFrozen` or deep equality of original.

**Example good review sentence**: "computeTotalsAndPaths delegates to sumTree + collectPaths (src/treeProcessing.ts:12-25); both are pure recursion over readonly children. The before/after deep equal at tests:37 passes because no node was mutated. Score 5."

---

## FP / Declarative Transformation & Recursion / 02-intermediate-rule-engine

**Criteria (from README)**
- Business rules are modeled as *data* (discriminated union Condition/AST + rule table) rather than control flow.
- Evaluation is a small pure interpreter (recursive match on the union via switch or visitors).
- Adding/changing a rule is a data change + (if new variant) one arm in the interpreter; the "engine" function stays stable.

**Score 1-5** (5 = the policy is literally a JSON-serializable data structure; interpreter is <30 LOC and exhaustive).

**Anti-patterns that still pass the test (flag these hard)**
- Still one big `evaluatePolicy` with if/else on facts.age etc and mutable `approved` / early returns (even if refactored into "private helpers").
- Rules "data" is just comments or an array of strings that are then re-parsed with ifs inside the same function.
- Mutation of a decision object or facts during eval; console or Date inside the interpreter.
- No union at all — conditions are still encoded as imperative predicates in JS.

**Positive indicators (praise these)**
- `type Condition = {kind:'and'; ...} | {kind:'ageLt'; n:number} | ...` (src/ruleEngine.ts).
- `evalCondition(c, facts)` is a switch on c.kind that recurses for and/not.
- Top level builds a list of {when: Condition, then: ...} data and calls the interpreter.
- Exhaustive check (never case) or all variants covered.

**Example good review sentence**: "The policy lives in the rules array of data literals (src/ruleEngine.ts:40); evalCondition is the pure recursive interpreter on the union. Changing the bulk threshold is editing one number in data. Score 5."

---

## FP / Pure Core, Impure Shell / 01-basic-pricing-rules

**Criteria (from README)**
- The pricing/discount math lives in a pure `calculatePricePure(cart, now: Date, tier, taxRate?)` that is referentially transparent.
- All time (`now`), randomness, loyalty lookup, and logging are obtained/ performed only in the shell; the shell calls the pure core with explicit values.
- Same (cart, now, tier) inputs to the pure core always produce the same output (including applied rules for time-based ones).

**Score 1-5** (5 = pure fn is trivially testable with any now/tier you want to simulate; shell is a few lines of wiring + effect code).

**Anti-patterns that still pass the test (flag these hard)**
- `const now = new Date(); const tier = lookup...; Math.random()` still inside the exported `calculatePrice` (even if you also accept now as param and mostly ignore it).
- The "pure" fn closes over or calls the DB lookup / random fn.
- Shell and pure are not separated at all (everything still in one calculatePrice with comments "// pure part here").
- Non-determinism leaks: two calls with same explicit now/tier produce different totals because random or fresh Date is still read inside.

**Positive indicators (praise these)**
- `calculatePricePure` in src/pure.ts takes explicit `now: Date`, `tier`; no Date/Math/console inside (ref solutions).
- Shell (src/shell.ts) does `const now = new Date(); const tier = await load...(); return calculatePricePure(...)`.
- Pure fn uses only the passed params for all decisions.
- Learner may have tests that call pure directly with synthetic dates.

**Example good review sentence**: "calculatePricePure (src/pure.ts:20) receives now and tier; wed-special decision is `if (now.getDay()===3)`. Shell in shell.ts:10 obtains the effects then delegates. No effects in core. Score 5."

---

## FP / Pure Core, Impure Shell / 02-intermediate-order-workflow

**Criteria (from README)**
- Decision logic is in pure function(s) returning `Result<{decision, commands: Command[]}, Err>` (using shared lib/result).
- Commands are plain data describing effects to perform (UpdateStatus, SendEmail, Charge).
- Shell loads the order data, invokes the pure decider, then executes the returned commands (pattern match + await the ports). No decision code in the effectful paths.

**Score 1-5** (5 = you can unit-test decideOrder with plain objects and assert exact commands list without ever calling DB or payment; shell is a loop over commands).

**Anti-patterns that still pass the test (flag these hard)**
- The big async processOrder still contains the `if (status !== 'pending')` / amount checks mixed with the awaits for db/email/pay.
- Pure decider exists but is not used; shell still has its own copy of the approval rules.
- Commands are not data — effects are performed immediately inside the decider ("if approve then await email").
- Try/catch for payment lives in the same place as the decision that chose to charge.

**Positive indicators (praise these)**
- `decideOrder(order): Result<...>` in src/pure.ts (no async, no console).
- Shell (src/shell.ts) does load, decide, then `for (const cmd of commands) await execute(cmd)`.
- Types for Command and Decision are separate from effect code.
- Test can import decideOrder directly and assert on the Result/commands for different order fixtures.

**Example good review sentence**: "decideOrder (src/pure.ts:12) is pure Result + commands data for approve/reject paths. Shell executes in a loop (src/shell.ts:15). Adding a new command kind touches only types + one case in executor. Score 5."

---

---








## OOP / Open/Closed / 01-basic-discount-engine

**Criteria (from README)**
- Adding a new customer tier or promo code requires only adding code (new rule/strategy + registration); never editing existing discount calculation logic or if/else chains.
- Existing tier and promo calculations remain unchanged in source when new behaviors are introduced.
- The engine is closed to modification for the rules it already supports.

**Score 1-5** (5 = textbook: a new "student" tier or "HOLIDAY25" promo is a new file + one registration line; the original engine source and the three starter rules are byte-for-byte untouched; tests for old behaviors still pass without change).

**Anti-patterns that still pass the test (flag these hard)**
- The if/else or switch for tiers and promos still lives in the main `calculateDiscountedPrice` (or "core engine") even if extracted to private methods or a helper in the same file.
- "Extension" is achieved only by editing the same module that contains the original conditions ("we'll add more tiers here later").
- New rule still requires modifying the engine's conditionals or the list of known strings.
- All rules are implemented as methods on the engine class itself rather than separate rule objects.
- The test passes the old numbers, but the source still has the closed list of every concrete case.

**Positive indicators (praise these)**
- `interface DiscountRule { applies(tier, promo, price): boolean; computeDiscount(...): number; }` (or equivalent strategy).
- `DiscountEngine` holds `rules: DiscountRule[]` (or a registry) and delegates; it has no knowledge of "vip" or "SUMMER20".
- Separate files/classes or co-located for 01 scope: VipTierRule etc. (registered; actual ref often keeps inside discountEngine.ts initially).
- Registration in a tiny composition root or `engine.register(new SeniorRule())`; adding a rule touches only the new file/code + one line.
- `file:line` where a single rule's logic lives in isolation.

**Example good review sentence**: "The VIP 15% logic is isolated to VipTierRule (co-located in discountEngine.ts or extracted in ref). Adding SeniorRule is a new registration; DiscountEngine.ts and the original rules are unmodified. Score 5."

---

## TypeScript / Mapped Types / 01-core + 02-applied

**Criteria**
- `DeepReadonly<T>` recurses into objects and arrays (but leaves Date, functions, primitives as-is, per documented decision).
- `Mutable<T>` correctly reverses it.
- `deepFreeze` (or update helpers) return the readonly version; updates create new objects without mutating originals.
- Used for immutable views in FP and safe "with" methods in OOP entities.

**Anti-patterns**
- Shallow implementation (only top level readonly/freeze).
- No handling for arrays (elements not readonly).
- Update helpers that mutate the input instead of returning new.

**Positive indicators**
- Test assertions pass for deep nested readonly + array elements + roundtrip with Mutable.
- In 02, the update is used in a pure reducer (returns new) and in a class "withX" method, both preserving readonly on the base.

**Example**: "DeepReadonly on the config with nested array produces readonly at all levels; the update fn in the pipeline returns a new frozen object. Score 5."

---

## General Review Template (use this structure for every review)

## Summary
[2-3 sentences: what the submission does, whether tests pass, dominant principle fidelity assessment.]

## Scores
- Functionality: PASS / FAIL (based on `npm test` for the exercise)
- Principle Fidelity (this exercise): X/5

## Issues (by severity)
### Issue 1 — Severity: major (or nit / suggestion)
- File: exercises/.../src/foo.ts:42 (or module:line)
- Description: ...
- Suggestion: ...
- Status: open

(Repeat for each. Be specific. If no issues of a category, omit the section.)

## What was done well
- (list 1-4 concrete positives with file:line where possible)

## Recommendation
Keep / needs targeted work on <specific criteria from rubric> / excellent demonstration of the principle for this scope.

---

(All 20 core exercises now have full rubrics following the model of the original 3 exemplars. Each is 120-250 words, actionable against "passes tests but violates principle", derived from the exercise README Criteria + plan force sentences. Stretches use lighter notes or the general bar; their authoritative guidance is the per-stretch README Criteria.)

**AGENTS.md size note**: If this file approaches the project 10k-char cap after all rubrics, the core guidance + "how to review" + the 01/02 rubrics for every principle stay here; stretches may be lighter or linked. The authoritative per-exercise rubrics are the ones the learner and reviewer actually use.

When in doubt, re-read the exercise README's Criteria section first — the rubric exists to operationalize those criteria for reviewers.
