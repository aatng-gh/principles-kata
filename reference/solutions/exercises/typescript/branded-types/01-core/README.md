# Branded Types (Core)

## Concept
Branded (nominal) types let you distinguish two strings (or numbers) that have the same *structural* type but different *semantic* meaning at the type level. E.g. `UserId` vs `OrderId` or `Email` vs `DisplayName`, both `string`.

The classic way: intersection with a unique "brand" marker that only trusted code can introduce.

Key: make construction of the brand only possible via a controlled function (the "trusted constructor"), so that you can't just `as UserId` anywhere (although TS allows the cast, the *culture* and API of the module makes raw casts the exception, not the default path).

## Why for OOP + FP
- **OOP**: IDs on entities, strongly typed keys in maps, preventing mixing IDs in service methods.
- **FP**: domain specific values in pipelines (a function that only accepts `PositiveNumber` brand), preventing unit mistakes (meters vs feet).
- Both: an `Entity` class can require `UserId` in ctor, while a pure `lookup(id: UserId)` or `format(id: UserId)` also gets the safety.

## Exercise
Implement a `Brand<T, BrandName>` helper.

Then:
- `UserId = Brand<string, 'UserId'>`
- `OrderId = Brand<string, 'OrderId'>`
- Trusted creators: `createUserId(raw: string): UserId`, `createOrderId`
- A small `isUserId` guard? or just the creators.
- Functions that take the branded and would not accept plain string.

The starter will allow `const id: UserId = 'foo' as any` everywhere.

## Starter
`src/brands.ts`

## Criteria
- Construction of branded value requires going through the exported creator (no direct literal assignment without cast).
- The brand marker is not easily forgeable (use unique symbol or a non-exported unique field).
- Functions using `UserId` will not accept a plain `string` (type error).
- `string & { __brand: 'UserId' }` style or equivalent; the test file itself has no extra `as` to "make" ids.
- No `any` in the public API of the brand module.

## Expectations
- Document that the only way to get a `UserId` is `createUserId` (or from DB deserializer etc).
- Test uses @ts-expect-error for passing raw string to id-accepting fn.
- Can still use the value as string at runtime (the brand evaporates).

## Getting Started
```bash
npx vitest run exercises/typescript/branded-types/01-core
npm run validate:exercise -- exercises/typescript/branded-types/01-core
```

See AGENTS for "branded types that can still be constructed from the raw primitive without trusted ctor" — that is the anti-pattern to avoid.
