// exercises/typescript/mapped-types/02-applied/src/update.ts
// Applied: deep readonly + safe deep update/merge.
// Produces a *new* deeply readonly object; never mutates the input base or patch.
// Used from both pure reducer (FP) and class "withX" methods (OOP).
// Leverages DeepReadonly from 01-core and DeepPartial (recursive).
// Cutoff matches DeepReadonly (01-core/deep.ts:7): fn, Date/RegExp/Map/Set/Weak* left as-is
// (patches replace terminals whole; do not recurse/partial their "props").

import { type DeepReadonly, deepFreeze } from '../../01-core/src/deep';

export type DeepPartial<T> = T extends (args: readonly unknown[]) => unknown
  ? T
  : T extends
        | Date
        | RegExp
        | Map<unknown, unknown>
        | Set<unknown>
        | WeakMap<object, unknown>
        | WeakSet<object>
    ? T
    : T extends (infer U)[]
      ? DeepPartial<U>[]
      : T extends object
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : T;

// Internal deep merge that builds fresh objects (no shared refs for updated paths).
function deepMerge(base: unknown, patch: unknown): unknown {
  if (patch === undefined) return base;
  if (base == null || typeof base !== 'object' || Array.isArray(base)) {
    return patch;
  }
  if (patch == null || typeof patch !== 'object' || Array.isArray(patch)) {
    return patch;
  }
  // both plain objects: merge
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(patch as Record<string, unknown>)) {
    out[key] = deepMerge(
      (base as Record<string, unknown>)[key],
      (patch as Record<string, unknown>)[key]
    );
  }
  return out;
}

export function deepUpdate<T>(base: DeepReadonly<T>, patch: DeepPartial<T>): DeepReadonly<T> {
  const next = deepMerge(base, patch);
  return deepFreeze(next as T) as DeepReadonly<T>;
}
