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
  if (obj == null || typeof obj !== 'object') {
    return obj as DeepReadonly<T>;
  }

  // Terminal objects: freeze but do not recurse (preserve their type, e.g. Date stays Date)
  if (
    obj instanceof Date ||
    obj instanceof RegExp ||
    obj instanceof Map ||
    obj instanceof Set ||
    typeof obj === 'function'
  ) {
    Object.freeze(obj);
    return obj as DeepReadonly<T>;
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      // recurse to freeze elements (using unknown cast only internally)
      deepFreeze(obj[i] as unknown as T); // T here is element but cast for generic
    }
    Object.freeze(obj);
    return obj as DeepReadonly<T>;
  }

  // plain object
  const rec = obj as Record<string, unknown>;
  for (const key of Object.keys(rec)) {
    deepFreeze(rec[key] as T);
  }
  Object.freeze(obj);
  return obj as DeepReadonly<T>;
}
