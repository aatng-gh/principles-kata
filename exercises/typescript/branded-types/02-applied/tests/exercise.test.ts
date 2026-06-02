import { expectTypeOf } from 'expect-type';
import { describe, expect, it } from 'vitest';
import {
  type OrderId,
  type UserId,
  UserService,
  asOrderId,
  asUserId,
  formatUserRef,
} from '../src/ids';

describe('Branded Types 02 (applied)', () => {
  it('enforces brands in both OOP service and pure fn (type level)', () => {
    const svc = new UserService();
    const uid = svc.register('u1', 'Ada');
    const oid = asOrderId('o1');

    // @ts-expect-error - wrong brand to service method
    svc.getName(oid);

    // @ts-expect-error - wrong brand to pure fn
    formatUserRef(oid, 'x');

    // Good usage
    expectTypeOf(svc.getName(uid)).toEqualTypeOf<string | undefined>();
    expectTypeOf(formatUserRef(uid, 'Ada')).toEqualTypeOf<string>();
  });

  it('raw strings are rejected in good usage', () => {
    const svc = new UserService();
    // register is the *trusted* entry point (accepts raw string intentionally, produces branded).
    svc.register('raw123', 'bad');

    // raw strings to *consumer* fns (getName, format) are compile errors (no cast in this test line)
    // @ts-expect-error - raw string to branded id param in class method
    svc.getName('raw123');

    // @ts-expect-error - raw string to pure branded fn
    formatUserRef('raw456', 'x');
  });
});
