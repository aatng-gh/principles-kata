// exercises/typescript/conditional-types/02-applied/src/loaded.ts
// Applied: Loaded<T> using conditional + infer for Promise/Result flattening.
// Supports recursion for Promise<Result<...>> → inner.
// Leaves plain values (incl. arrays of data) as-is: Loaded<number[]> === number[] .
// Same utility used from class methods (OOP) and pure mappers (FP).

export type Result<T, E = unknown> = { ok: true; value: T } | { ok: false; error: E };

/**
 * Loaded<T> flattens one "loading wrapper" layer using infer inside conditionals.
 * - Loaded<Promise<U>> → U
 * - Loaded<Result<U, E>> → U
 * - Loaded<Promise<Result<U, E>>> → U  (recurses on the Promise)
 * - Loaded<U> → U (for plain, including arrays etc.)
 *
 * No array unwrapping (that is ExtractInner's job); plain arrays stay intact.
 * Distributes properly over unions.
 */
export type Loaded<T> = T extends Promise<infer U>
  ? Loaded<U>
  : T extends Result<unknown, unknown>
    ? T extends { ok: true; value: infer U }
      ? U
      : never
    : T;

// unwrapLoaded drives its return type from Loaded<T>.
// Callers in both class and pure fn get the inner type with no casts needed at use sites.
// Runtime is demo (real code awaits or checks .ok before).
export function unwrapLoaded<T>(value: T): Loaded<T> {
  if (value && typeof value === 'object') {
    // biome-ignore lint/suspicious/noExplicitAny: demo only, contained; type system already narrowed caller
    if ('ok' in value && (value as any).ok) {
      // biome-ignore lint/suspicious/noExplicitAny: demo only, contained; type system already narrowed caller
      return (value as any).value;
    }
    if ('then' in value) {
      // would await in real; stand-in for type demo
      // biome-ignore lint/suspicious/noExplicitAny: demo only
      return undefined as any;
    }
  }
  // biome-ignore lint/suspicious/noExplicitAny: identity for non-wrappers, contained in helper
  return value as any;
}
