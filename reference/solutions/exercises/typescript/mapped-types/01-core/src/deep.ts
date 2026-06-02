// exercises/typescript/mapped-types/01-core/src/deep.ts
// Solution: recursive mapped DeepReadonly + deepFreeze.
// Stops recursion at "value" types that are not plain data (Date, RegExp, Function, Map, Set, etc.)
// so that e.g. a frozen object can still have a mutable Date if desired, or we keep the original.
// In practice for this exercise we treat Date/RegExp/Function as atomic.

export type DeepReadonly<T> =
  T extends (args: readonly unknown[]) => unknown
    ? T
    : T extends Date | RegExp | Map<unknown, unknown> | Set<unknown> | WeakMap<object, unknown> | WeakSet<object>
    ? T
    : T extends readonly (infer U)[]
    ? readonly DeepReadonly<U>[]
    : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

export function deepFreeze<T>(obj: T): DeepReadonly<T> {
  if (obj == null || typeof obj !== 'object') {
    return obj as DeepReadonly<T>;
  }

  // Do not recurse into or re-freeze "terminal" objects
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
      // recurse on elements (safe because we cast at end)
      deepFreeze(obj[i]);
    }
    Object.freeze(obj);
    return obj as DeepReadonly<T>;
  }

  // plain object
  const rec = obj as Record<string, unknown>;
  for (const key of Object.keys(rec)) {
    deepFreeze(rec[key]);
  }
  Object.freeze(obj);
  return obj as DeepReadonly<T>;
}
