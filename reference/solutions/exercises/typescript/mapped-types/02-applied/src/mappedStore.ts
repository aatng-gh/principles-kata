// exercises/typescript/mapped-types/02-applied/src/mappedStore.ts
// Solution using mapped + key remapping (`as`) + template literal types.
// Public<T> drops private (underscore) members.
// Updaters<T> produces optional setX methods for each remaining key, using Capitalize.

export interface AppState {
  user: { id: number; name: string };
  count: number;
  _internalCache: Map<string, unknown>;
}

export type Public<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K];
};

export type Updaters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]?: (value: T[K]) => void;
};

export function createUpdaters<T extends object>(target: T): Updaters<Public<T>> {
  const updaters = {} as Updaters<Public<T>>;

  const pub = target as Public<T>;
  (Object.keys(pub) as Array<keyof Public<T>>).forEach((k) => {
    const setterName = `set${String(k).charAt(0).toUpperCase()}${String(k).slice(1)}` as keyof Updaters<Public<T>>;
    // biome-ignore lint/suspicious/noExplicitAny: demo wiring of dynamic keys in applied example; real code would use safer proxy or per-key
    (updaters as any)[setterName] = (value: unknown) => {
      // demo: mutate the target (in real immutable version would return new)
      // biome-ignore lint/suspicious/noExplicitAny: demo
      (target as any)[k as string] = value;
    };
  });

  return updaters;
}
