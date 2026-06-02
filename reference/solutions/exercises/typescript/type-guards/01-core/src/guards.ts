// exercises/typescript/type-guards/01-core/src/guards.ts
// Correct type guards using the `is` predicate return type.
// All are total and truthful.

export function isString(x: unknown): x is string {
  return typeof x === 'string';
}

export function isNumber(x: unknown): x is number {
  return typeof x === 'number' && !Number.isNaN(x);
}

export function isNonEmptyString(x: unknown): x is string {
  return isString(x) && x.length > 0;
}

export function isPlainObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

export interface Shape {
  kind: string;
}

export function isShape(x: unknown): x is Shape {
  return isPlainObject(x) && isString((x as Record<string, unknown>).kind);
}

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export function isResultOk<T, E>(r: Result<T, E>): r is { ok: true; value: T } {
  return r.ok;
}
