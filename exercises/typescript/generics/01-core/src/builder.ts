// exercises/typescript/generics/01-core/src/builder.ts
// Precise generic builder using SetKeys tracking.
// - set() constrains K extends keyof Shape (no bad keys)
// - build() returns Shape only after every key has been set; incomplete chains build as Partial<Shape>
// No `any` in public signatures or implementation.
// Works cleanly from OOP class methods and pure FP functions (exact Shape inferred).

export function createBuilder<Shape extends object>() {
  const state = {} as Partial<Shape>;

  function api<SetKeys extends keyof Shape = never>(): Builder<Shape, SetKeys> {
    return {
      set<K extends keyof Shape>(key: K, value: Shape[K]) {
        state[key] = value;
        return api<SetKeys | K>();
      },
      build() {
        return { ...state } as BuildResult<Shape, SetKeys>;
      },
    };
  }

  return api();
}

type BuildResult<Shape extends object, SetKeys extends keyof Shape> = [keyof Shape] extends [
  SetKeys,
]
  ? Shape
  : Partial<Pick<Shape, SetKeys>>;

interface Builder<Shape extends object, SetKeys extends keyof Shape = never> {
  set<K extends keyof Shape>(key: K, value: Shape[K]): Builder<Shape, SetKeys | K>;
  build(): BuildResult<Shape, SetKeys>;
}
