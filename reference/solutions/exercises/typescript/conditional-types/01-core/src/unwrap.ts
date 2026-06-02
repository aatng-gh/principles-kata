// exercises/typescript/conditional-types/01-core/src/unwrap.ts
// Solution demonstrating conditional types + infer.
// ExtractInner<T> destructures common "wrapper" types to their inner payload.
// It is distributive over unions thanks to naked type param in conditionals.
// The runtime helpers exist only to *demonstrate* the extracted signatures in tests;
// in real use you would await / pattern match instead of these "unwrap" fns.

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

/**
 * Extract the "inner" / payload type from common containers using infer.
 * - Promise<U> -> U
 * - { value: U } (i.e. the success case of our Result) -> U
 * - Array<U> or readonly Array<U> -> U
 * - anything else -> itself (identity)
 *
 * Written to be distributive.
 */
export type ExtractInner<T> =
  T extends Promise<infer U>
    ? U
    : T extends { ok: true; value: infer U } | { ok: false; error: unknown }
    ? U
    : T extends readonly (infer U)[]
    ? U
    : T;

// Runtime demo helpers. The bodies are intentionally not "real" unwraps
// (you can't synchronously unwrap a promise without blocking).
// They let the test execute the call expression so expectTypeOf can observe
// the *return type* of the helper as driven by the conditional.

export function unwrapPromise<T>(p: Promise<T>): T {
  // Type demo only. Real code: await p
  // We use a cast here (in the helper) so the *test file* needs no casts.
  // The cast is the "implementation detail" of the demo stub.
  return undefined as unknown as T;
}

export function unwrapResult<T, E>(r: Result<T, E>): T {
  if (r.ok) return r.value;
  // E may be anything; rethrowing the error value is fine (no any escape in public).
  throw r.error;
}
