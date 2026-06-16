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

function isResult(value: unknown): value is Result<unknown, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'ok' in value &&
    (value.ok === true ? 'value' in value : value.ok === false && 'error' in value)
  );
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof value.then === 'function'
  );
}

// unwrapLoaded drives its return type from Loaded<T>. Runtime supports sync Results
// and plain values. Promises must be awaited by real code; for the kata's
// type-only promise call site, this returns an explicit placeholder without `any`.
export function unwrapLoaded<T>(value: T): Loaded<T> {
  if (isPromiseLike(value)) {
    return undefined as Loaded<T>;
  }

  if (isResult(value)) {
    if (value.ok) {
      return value.value as Loaded<T>;
    }
    throw value.error;
  }

  return value as Loaded<T>;
}
