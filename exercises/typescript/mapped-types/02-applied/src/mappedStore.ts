// exercises/typescript/mapped-types/02-applied/src/mappedStore.ts
// Uses mapped + key remapping (`as`) + template literal types for Public + Updaters.
// Public<T> drops private (underscore) members via never in key remap.
// Updaters<T> produces optional setX methods (using Capitalize) for each public key.
// The factory wires demo setters (may mutate target for simplicity of demo; real would be immutable via deepUpdate).

import type { DeepReadonly } from '../../01-core/src/deep';

export interface AppState {
  user: { id: number; name: string };
  count: number;
  _internalCache: Map<string, unknown>; // should be hidden in Public/Updaters
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
  for (const k of Object.keys(pub) as Array<keyof Public<T>>) {
    const setterName =
      `set${String(k).charAt(0).toUpperCase()}${String(k).slice(1)}` as keyof Updaters<Public<T>>;
    // biome-ignore lint/suspicious/noExplicitAny: demo wiring of dynamic keys; real immutable version would delegate to deepUpdate
    (updaters as any)[setterName] = (value: unknown) => {
      // demo: mutate the target (in real immutable version would return new via deepUpdate + assign back)
      // biome-ignore lint/suspicious/noExplicitAny: demo
      (target as any)[k as string] = value;
    };
  }

  return updaters;
}

// Example of tying mappedStore updaters to deep readonly views (for dual use demo).
export function createReadonlyUpdaters<S extends object>(
  target: DeepReadonly<S>
): Updaters<Public<S>> {
  // In real, the updaters would produce new readonly via deepUpdate rather than mutate.
  // Here we accept readonly view for the "state" param to show type flow.
  return createUpdaters(target as S); // cast for demo wiring only
}
