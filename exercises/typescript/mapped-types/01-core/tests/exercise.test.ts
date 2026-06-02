import { expectTypeOf } from 'expect-type';
import { describe, expect, it } from 'vitest';
import { type DeepReadonly, type Mutable, deepFreeze } from '../src/deep';

interface User {
  id: number;
  profile: {
    name: string;
    tags: string[];
  };
  settings?: { theme: 'dark' | 'light' };
}

describe('Mapped Types 01 - DeepReadonly (core)', () => {
  it('DeepReadonly makes nested properties readonly (type level)', () => {
    type RO = DeepReadonly<User>;

    expectTypeOf<RO['id']>().toEqualTypeOf<Readonly<number>>();
    expectTypeOf<RO['profile']>().toEqualTypeOf<{
      readonly name: string;
      readonly tags: readonly string[];
    }>();
    expectTypeOf<RO['profile']['tags'][number]>().toEqualTypeOf<string>();
    expectTypeOf<RO['settings']>().toEqualTypeOf<
      { readonly theme: 'dark' | 'light' } | undefined
    >();

    // Primitives and functions stay as-is (common expectation)
    type Prim = DeepReadonly<{ n: number; f: () => void; d: Date }>;
    expectTypeOf<Prim['n']>().toEqualTypeOf<number>();
    expectTypeOf<Prim['f']>().toEqualTypeOf<() => void>();
  });

  it('deepFreeze returns a deeply readonly version at the type level', () => {
    const user: User = { id: 1, profile: { name: 'Ada', tags: ['ts'] } };
    const frozen = deepFreeze(user);

    expectTypeOf(frozen).toEqualTypeOf<DeepReadonly<User>>();
    expect(Object.isFrozen(frozen)).toBe(true);
    // nested should also be frozen (deep)
    expect(Object.isFrozen(frozen.profile)).toBe(true);
  });

  it('Mutable reverses DeepReadonly (type level)', () => {
    type RO = DeepReadonly<User>;
    type Back = Mutable<RO>;
    expectTypeOf<Back>().toEqualTypeOf<User>();
  });
});
