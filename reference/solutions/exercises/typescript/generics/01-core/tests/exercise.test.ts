import { describe, expect, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import { createBuilder } from '../src/builder';

describe('Generics 01 - createBuilder (core)', () => {
  it('builds an object with the exact requested shape (runtime)', () => {
    const builder = createBuilder<{ id: string; name: string; active: boolean }>();
    const result = builder
      .set('id', 'u_123')
      .set('name', 'Ada Lovelace')
      .set('active', true)
      .build();

    expect(result).toEqual({
      id: 'u_123',
      name: 'Ada Lovelace',
      active: true,
    });
  });

  it('type-checks correctly with good inference (type level)', () => {
    const builder = createBuilder<{ id: string; count: number }>();
    const result = builder.set('id', 'x').set('count', 42).build();

    // These should all be true with no extra casts
    expectTypeOf(result).toEqualTypeOf<{ id: string; count: number }>();
    expectTypeOf(result.id).toEqualTypeOf<string>();
    expectTypeOf(result.count).toEqualTypeOf<number>();

    // @ts-expect-error - setting a key that does not exist on the shape must be an error
    builder.set('unknownKey', 123);
  });

  it('supports being used inside pure functions as well as class methods', () => {
    // Pure function style
    function makeDefaultUser(id: string) {
      return createBuilder<{ id: string; role: 'user'; createdAt: Date }>()
        .set('id', id)
        .set('role', 'user')
        .set('createdAt', new Date())
        .build();
    }

    const pureUser = makeDefaultUser('u1');
    expect(pureUser.role).toBe('user');

    // OOP style (imagine this lives in a service class)
    class UserFactory {
      create(id: string, name: string) {
        return createBuilder<{ id: string; name: string; type: 'admin' | 'member' }>()
          .set('id', id)
          .set('name', name)
          .set('type', 'member')
          .build();
      }
    }
    const oopUser = new UserFactory().create('u2', 'Grace');
    expect(oopUser.name).toBe('Grace');

    // Type level: both usages produce the exact requested shape
    expectTypeOf(pureUser).toEqualTypeOf<{ id: string; role: 'user'; createdAt: Date }>();
    expectTypeOf(oopUser).toEqualTypeOf<{ id: string; name: string; type: 'admin' | 'member' }>();
  });
});
