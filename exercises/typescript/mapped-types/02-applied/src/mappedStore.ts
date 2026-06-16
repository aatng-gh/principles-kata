// exercises/typescript/mapped-types/02-applied/src/mappedStore.ts
// Uses mapped + key remapping (`as`) + template literal types for Public + Updaters.
// Public<T> drops private (underscore) members via never in key remap.
// Updaters<T> produces optional setX methods (using Capitalize) for each public key.
// The mutable factory wires demo setters for mutable targets. The readonly factory
// preserves readonly inputs by keeping an internal immutable snapshot updated via deepUpdate.

import type { DeepReadonly } from '../../01-core/src/deep';
import { type DeepPartial, deepUpdate } from './update';

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

export type ReadonlyUpdaters<S extends object> = Updaters<Public<S>> & {
  getState(): DeepReadonly<S>;
};

function setterNameFor(key: string): string {
  return `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
}

export function createUpdaters<T extends object>(target: T): Updaters<Public<T>> {
  const updaters: Record<string, (value: unknown) => void> = {};
  const writableTarget = target as Record<string, unknown>;

  for (const key of Object.keys(target).filter((k) => !k.startsWith('_'))) {
    updaters[setterNameFor(key)] = (value: unknown) => {
      writableTarget[key] = value;
    };
  }

  return updaters as Updaters<Public<T>>;
}

// Example of tying mappedStore updaters to deep readonly views (for dual use demo).
export function createReadonlyUpdaters<S extends object>(
  target: DeepReadonly<S>
): ReadonlyUpdaters<S> {
  const updaters: Record<string, (value: unknown) => void> = {};
  let current = target;

  for (const key of Object.keys(target).filter((k) => !k.startsWith('_'))) {
    updaters[setterNameFor(key)] = (value: unknown) => {
      current = deepUpdate(current, { [key]: value } as DeepPartial<S>);
    };
  }

  return {
    ...updaters,
    getState: () => current,
  } as ReadonlyUpdaters<S>;
}
