// exercises/typescript/conditional-types/02-applied/src/loaded.ts
// Applied solution: Loaded<T> using conditional + infer.
// Supports one level of Promise, Result (via structural {value}), and nested Promise<Result>.
// Used cleanly from both a class method and a pure function (see test).

export type Result<T, E = unknown> = { ok: true; value: T } | { ok: false; error: E };

/**
 * Loaded<T> flattens one "loading wrapper" layer using infer inside conditionals.
 * Works for:
 *   Loaded<Promise<U>> = U
 *   Loaded<Result<U,E>> = U   (via the success shape)
 *   Loaded<Promise<Result<U,E>>> = U
 *   Loaded<U> = U (identity for plain values)
 */
export type Loaded<T> =
  T extends Promise<infer U>
    ? Loaded<U> // allow one extra level for Promise<Result<...>>
    : T extends { ok: true; value: infer U } | { ok: false; error: unknown }
    ? U
    : T extends readonly (infer U)[]
    ? U
    : T;

export function unwrapLoaded<T>(value: T): Loaded<T> {
  // Demo implementation. For real Promise you would await before calling.
  // For Result you would inspect .ok.
  // The cast is contained here; the beauty is callers get the precise Loaded<T> with no cast.
  if (value && typeof value === 'object') {
    if ('value' in value) {
      // biome-ignore lint/suspicious/noExplicitAny: contained in demo helper
      return (value as any).value;
    }
    if (value instanceof Promise) {
      // cannot sync unwrap; return stand-in for demo
      // biome-ignore lint/suspicious/noExplicitAny: demo only
      return undefined as any;
    }
  }
  // biome-ignore lint/suspicious/noExplicitAny: demo identity
  return value as any;
}
