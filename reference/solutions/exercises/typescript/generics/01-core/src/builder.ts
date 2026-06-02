// Reference solution for generics/01-core
// A clean, inferring generic builder. Usable from classes or pure functions.

export function createBuilder<Shape extends object = {}>() {
  type PartialShape = Partial<Shape>;
  const state = {} as PartialShape;

  return {
    set<K extends keyof Shape>(key: K, value: Shape[K]) {
      (state as any)[key] = value;
      return this as any; // builder chaining type is a bit loose here on purpose for simplicity; see 02 for stricter
    },
    build(): Shape {
      // In a real impl you might validate required fields here
      return state as Shape;
    },
  };
}
