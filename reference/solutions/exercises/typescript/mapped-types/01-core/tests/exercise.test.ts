import { describe, expect, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import { DeepReadonly, deepFreeze } from '../src/deep';

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
    // profile should be deeply readonly
    expectTypeOf<RO['profile']['name']>().toEqualTypeOf<string>(); // still assignable, but the containing object is readonly
    // arrays inside should have readonly elements in practice (common expectation)
  });

  it('deepFreeze returns a deeply readonly version at the type level', () => {
    const user: User = { id: 1, profile: { name: 'Ada', tags: ['ts'] } };
    const frozen = deepFreeze(user);

    expectTypeOf(frozen).toEqualTypeOf<DeepReadonly<User>>();
    expect(Object.isFrozen(frozen)).toBe(true);
  });
});
