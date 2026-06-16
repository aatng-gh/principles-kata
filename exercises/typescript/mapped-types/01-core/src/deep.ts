// exercises/typescript/mapped-types/01-core/src/deep.ts
// Recursive DeepReadonly + Mutable using mapped types.
// Cutoff: primitives, functions, Date, RegExp, Map/Set (and weak) are left as-is (not recursed into).
// This lets e.g. objects holding a Date keep the original Date type (common for frozen snapshots).
// Arrays become readonly arrays with readonly elements.

export type DeepReadonly<T> = T extends (args: readonly unknown[]) => unknown
  ? T
  : T extends
        | Date
        | RegExp
        | Map<unknown, unknown>
        | Set<unknown>
        | WeakMap<object, unknown>
        | WeakSet<object>
    ? T
    : T extends readonly (infer U)[]
      ? readonly DeepReadonly<U>[]
      : T extends object
        ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
        : T;

export type Mutable<T> = T extends (args: readonly unknown[]) => unknown
  ? T
  : T extends
        | Date
        | RegExp
        | Map<unknown, unknown>
        | Set<unknown>
        | WeakMap<object, unknown>
        | WeakSet<object>
    ? T
    : T extends readonly (infer U)[]
      ? Mutable<U>[]
      : T extends object
        ? { -readonly [K in keyof T]: Mutable<T[K]> }
        : T;

export function deepFreeze<T>(obj: T): DeepReadonly<T> {
  freezeInPlace(obj);
  // Single documented cast: we performed in-place deep freeze (side-effect only walk below);
  // the runtime value is now deeply readonly, so we claim the DeepReadonly<T> view.
  // No recursive generic lying casts (e.g. no `as unknown as T`) remain.
  return obj as DeepReadonly<T>;
}

/** Side-effect only deep freeze walk. Uses unknown to avoid generic recast hacks in recursion. */
function freezeInPlace(value: unknown): void {
  if (value == null || typeof value !== 'object') {
    return;
  }

  // Terminal objects: freeze but do not recurse
  if (
    value instanceof Date ||
    value instanceof RegExp ||
    value instanceof Map ||
    value instanceof Set ||
    typeof value === 'function'
  ) {
    Object.freeze(value);
    return;
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      freezeInPlace(value[i]); // unknown element, no cast to outer T
    }
    Object.freeze(value);
    return;
  }

  // plain object
  const rec = value as Record<string, unknown>; // internal for keys iteration only
  for (const key of Object.keys(rec)) {
    freezeInPlace(rec[key]);
  }
  Object.freeze(value);
}
