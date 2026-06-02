# Discriminated Unions (Applied - Command/Event Processing in Mixed OOP/FP)

## Scenario
You need to model operations on an order system as a closed set of commands that can be:
- Dispatched from a class-based service (e.g. `OrderService.execute(cmd)`)
- Interpreted in a pure function pipeline or reducer (e.g. `reduce(commands, initial)` or `handle(cmd)` )

Using a discriminated union `Command` with variants `PlaceOrder`, `CancelOrder`, `ShipOrder` (with appropriate payloads) lets both the class and the pure code share the exact same type and get narrowing + exhaustiveness for free.

Adding a new command (Refund) requires adding the variant + handling it in the two places, but the core type and any generic processor stays stable.

## Exercise
In `src/commands.ts`:

- Define the `Command` DU with a `type: 'place' | 'cancel' | ...` discriminant (or `kind`).
- Each variant carries its specific data (e.g. Place has items, userId; Cancel has reason).
- Implement `execute(cmd: Command): string` (or a result) — can be used as method body.
- Implement a pure `handleCommand(cmd: Command): { status: string; sideEffects: string[] }` or similar.
- Optionally a tiny "processor" that is generic over the union.

Make the class `OrderService` have a method that accepts Command and delegates to logic, and show a pure compose of handlers.

## Starter
`src/commands.ts` — probably a big interface or `type Command = any` or non-discriminated.

## Criteria
- True DU with literal discriminant; variants are objects with different shapes.
- Both the class method and the pure function use switch on the discriminant and narrow without `as`.
- Exhaustive handling (assertNever or TS error if a case missing).
- The union type itself can be imported and used in both a `.ts` class file and a pure `.ts` module.
- No `any`.

## Expectations
- Payloads use precise types (e.g. readonly arrays where makes sense).
- Test proves that after if (cmd.type === 'place') the narrowed cmd has the place fields only.
- A comment or type test shows "if we added a 4th command the switch would complain unless handled".

## Getting Started
```bash
npx vitest run exercises/typescript/discriminated-unions/02-applied
npm run validate:exercise -- exercises/typescript/discriminated-unions/02-applied
```
