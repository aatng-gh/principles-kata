import { describe, expect, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import { createOrderId, createUserId, formatUser, OrderId, UserId } from '../src/brands';

describe('Branded Types 01 - Core brands', () => {
  it('creators produce the branded type, raw strings do not assign (type)', () => {
    const uid = createUserId('u_123');
    expectTypeOf(uid).toEqualTypeOf<UserId>();

    // @ts-expect-error - plain string is not a UserId
    const bad: UserId = 'u_123';

    const oid = createOrderId('o_456');
    expectTypeOf(oid).toEqualTypeOf<OrderId>();

    // @ts-expect-error - UserId and OrderId are distinct
    const mix: UserId = oid;
  });

  it('functions that require brand reject plain string at compile (and accept brand at runtime)', () => {
    const uid = createUserId('u1');
    expect(formatUser(uid)).toBe('user:u1');

    // @ts-expect-error passing raw string to branded param
    formatUser('raw');

    // runtime the value is still the primitive
    expect(typeof uid).toBe('string');
  });

  it('brands survive through pure transforms and class usage', () => {
    function loadUserName(id: UserId): string {
      return id + '-name';
    }

    const id = createUserId('u42');
    expect(loadUserName(id)).toBe('u42-name');

    class UserRepo {
      find(id: UserId) {
        return { id, name: 'x' };
      }
    }
    const repo = new UserRepo();
    const found = repo.find(id);
    expectTypeOf(found.id).toEqualTypeOf<UserId>();
  });
});
