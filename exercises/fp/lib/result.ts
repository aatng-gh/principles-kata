/**
 * Minimal zero-dependency Result type for FP exercises.
 * Use for explicit error handling in pure cores without exceptions.
 *
 * Do not mutate the error/success payloads.
 */

export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export const ok = <T, E = never>(value: T): Result<T, E> => ({ ok: true, value });
export const err = <E, T = never>(error: E): Result<T, E> => ({ ok: false, error });

export const isOk = <T, E>(r: Result<T, E>): r is { ok: true; value: T } => r.ok;
export const isErr = <T, E>(r: Result<T, E>): r is { ok: false; error: E } => !r.ok;

export const map =
  <T, U, E>(f: (t: T) => U) =>
  (r: Result<T, E>): Result<U, E> =>
    isOk(r) ? ok(f(r.value)) : (r as Result<U, E>);

export const flatMap =
  <T, U, E>(f: (t: T) => Result<U, E>) =>
  (r: Result<T, E>): Result<U, E> =>
    isOk(r) ? f(r.value) : (r as Result<U, E>);

export const mapErr =
  <T, E, F>(f: (e: E) => F) =>
  (r: Result<T, E>): Result<T, F> =>
    isErr(r) ? err(f(r.error)) : (r as Result<T, F>);

export const unwrapOr =
  <T, E>(def: T) =>
  (r: Result<T, E>): T =>
    isOk(r) ? r.value : def;

/** For tests / debug only. Never use in production code (violates referential transparency). */
export const unsafeUnwrap = <T, E>(r: Result<T, E>): T => {
  if (isOk(r)) return r.value;
  // biome-ignore lint/suspicious/noExplicitAny: intentional for debug helper only
  throw new Error(`unsafeUnwrap on Err: ${String((r as any).error)}`);
};
