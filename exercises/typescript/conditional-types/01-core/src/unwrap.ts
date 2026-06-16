// exercises/typescript/conditional-types/01-core/src/unwrap.ts
// Implement ExtractInner using conditional types + infer.
// Demonstrates precise extraction for Promise, Result (via structural), arrays.
// Distributive over unions. No `any` in the type definition.

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

/**
 * Extract the "inner" / payload type from common containers using `infer` inside conditionals.
 * - Promise<U> → U
 * - Result<U, E> (success arm) → U
 * - U[] / readonly U[] → U
 * - anything else → T (identity fallback)
 *
 * The conditional is written with a naked `T` so it distributes over union inputs.
 * Uses structural matching for Result to avoid `any` in the `infer` position for E.
 */
export type ExtractInner<T> = T extends Promise<infer U>
  ? U
  : T extends Result<unknown, unknown>
    ? T extends { ok: true; value: infer U }
      ? U
      : never
    : T extends readonly (infer U)[]
      ? U
      : T;

// Runtime demo helpers. A Promise cannot be synchronously unwrapped; this helper keeps
// the exercise's type-level signature for the kata tests and uses an explicit placeholder
// without `any`. Real code should `await p`.
export function unwrapPromise<T>(p: Promise<T>): T {
  void p;
  return undefined as T;
}

export function unwrapResult<T, E>(r: Result<T, E>): T {
  if (r.ok) {
    return r.value;
  }
  // Re-throw the error payload (typed as E at call site if narrowed)
  throw r.error;
}
