# Branded Types (Applied - Entity + Pure Transform Safety)

## Scenario
In a mixed codebase you have:
- Domain entities (classes) that should only ever be constructed with properly branded IDs.
- Pure functions and pipelines that transform or validate lists of entities or IDs (e.g. `normalizeIds`, `toReport`).

Using brands for `ProductId`, `OrderId` etc. prevents accidentally passing a product id where an order id is expected, even if both are strings, in both the class ctor and the fp mapper.

## Exercise
Define branded `ProductId`, `OrderId`.

Provide a simple `Product` class that takes `ProductId` in ctor (and stores it).

Provide pure fns:
- `makeProductId(raw: string): ProductId`
- `formatProductLabel(p: Product): string` (uses the branded inside)
- A pipeline function e.g. `getProductIds(products: Product[]): ProductId[]` that preserves the brand.

Show that a pure "id transformer" that takes `ProductId` cannot be fed a raw or wrong brand.

## Starter
Loose string ids, class accepts string.

## Criteria
- The class ctor signature uses the branded ID type (not string).
- Pure fns also take/return the branded (so a map in a pipeline keeps the brand).
- You cannot do `new Product('raw-string')` or pass OrderId to a ProductId slot.
- The brand is created only via the trusted creator (or deserializer).
- No `any`.

## Expectations
- In the class, the field is typed `readonly id: ProductId`.
- A test pure function demonstrates `products.map(p => p.id)` yields `ProductId[]` not `string[]`.
- @ts-expect-error for cross-brand or raw misuse in both class and fn contexts.

## Getting Started
```bash
npx vitest run exercises/typescript/branded-types/02-applied
npm run validate:exercise -- exercises/typescript/branded-types/02-applied
```
