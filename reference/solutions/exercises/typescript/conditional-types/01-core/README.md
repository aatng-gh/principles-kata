# Conditional Types & `infer` (Core)

## Concept
Conditional types (`T extends U ? X : Y`) combined with `infer` let you *destruct* types at compile time. This is one of the most powerful tools in TS for building type-level utilities and safe APIs.

Mid-level mastery includes:
- Writing useful conditional types instead of reaching for `any`
- Using `infer` to extract pieces (e.g. element type of array, return type, parameter types)
- Distributive conditional types
- How conditionals interact with generics and mapped types

## Why useful for OOP + FP
- Extract "inner" types from wrappers (e.g. the `T` inside `Promise<T>`, `Result<T,E>`, `Observable<T>`)
- Build type-safe "extractors" that work whether the value is returned from a method or passed through a pure function pipeline
- Foundation for many utility types you will write on real projects (`DeepRequired`, `NonNullableFields`, API response mappers, etc.)

## Exercise
Implement (as a type + a small runtime helper) `UnwrapPromise<T>` and `UnwrapResult<T>` (or a general `Unwrap<T>`).

More concretely:

Create a generic type utility `ExtractInner<T>` that can "unwrap" common containers:
- `ExtractInner<Promise<U>>` → `U`
- `ExtractInner<Result<U, E>>` → `U` (you can use the local `Result` or define a simple one)
- `ExtractInner<U[]>` → `U`
- Falls back to `T` for non-wrappers

Also provide a small runtime `unwrap` function (or family) that is typed using your conditional type.

## Starter
`src/unwrap.ts`

## Criteria
- Your `ExtractInner<T>` must use `infer` inside conditional types.
- It must be distributive where it makes sense.
- The runtime helper must not use `any` and must preserve the extracted type in its signature.
- It should be useful as a building block (someone could use your type in a generic service or a pure mapper function).

## Expectations
- Good naming and documentation in the types (JSDoc on the type alias is appreciated).
- The solution demonstrates understanding of when `infer` "fires" vs when it doesn't.
- Works recursively for one level is enough (deep unwrap is bonus).

## Getting Started
```bash
npx vitest run exercises/typescript/conditional-types/01-core
```
or
npm run validate:exercise -- exercises/typescript/conditional-types/01-core

See AGENTS.md "TypeScript Type System Basics" for review criteria (use of infer, no any, dual paradigm usefulness, precise narrowing without lies).

## After success
Self-check + request review using AGENTS, then reveal reference with the script.
