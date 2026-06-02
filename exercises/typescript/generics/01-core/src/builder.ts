// exercises/typescript/generics/01-core/src/builder.ts
// Precise generic builder using Partial<Shape> tradeoff (chosen for fluent chaining ergonomics
// without complex per-step object allocation).
// - set() constrains K extends keyof Shape (no bad keys)
// - build() always returns the full Shape type (caller must ensure completeness at runtime;
//   adding required field to Shape does NOT error at old .build() sites -- this is the documented
//   limitation vs a full SetKeys tracking impl).
// No `any` in public signatures. Internal casts biome-ignored + commented.
// Works cleanly from OOP class methods and pure FP functions (exact Shape inferred).

export function createBuilder<Shape extends object>() {
  const state = {} as Partial<Shape>;

  // Properly typed fluent builder (no 'as any' on the public chain or build return).
  // Internal state mutation uses isolated any only for the record write (demo of mutable accumulator).
  const api: Builder<Shape> = {
    set<K extends keyof Shape>(key: K, value: Shape[K]) {
      // biome-ignore lint/suspicious/noExplicitAny: minimal internal cast for assign into Partial record; callers see precise generic API with no any
      (state as any)[key] = value;
      return api; // same typed instance for fluent chaining; Shape preserved
    },
    build(): Shape {
      return state as Shape;
    },
  };
  return api;
}

interface Builder<Shape> {
  set<K extends keyof Shape>(key: K, value: Shape[K]): Builder<Shape>;
  build(): Shape;
}
