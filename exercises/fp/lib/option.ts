/**
 * Minimal zero-dependency Option type.
 * Prefer over null/undefined for "maybe" values in pure FP exercises.
 */

export type Option<T> = { readonly some: true; readonly value: T } | { readonly some: false };

export const some = <T>(value: T): Option<T> => ({ some: true, value });
export const none: Option<never> = { some: false };

export const isSome = <T>(o: Option<T>): o is { some: true; value: T } => o.some;
export const isNone = <T>(o: Option<T>): o is { some: false } => !o.some;

export const map =
  <T, U>(f: (t: T) => U) =>
  (o: Option<T>): Option<U> =>
    isSome(o) ? some(f(o.value)) : none;

export const flatMap =
  <T, U>(f: (t: T) => Option<U>) =>
  (o: Option<T>): Option<U> =>
    isSome(o) ? f(o.value) : none;

export const unwrapOr =
  <T>(def: T) =>
  (o: Option<T>): T =>
    isSome(o) ? o.value : def;
