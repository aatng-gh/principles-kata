import { expectTypeOf } from 'expect-type';
import { describe, expect, it } from 'vitest';
import {
  type CancelOrder,
  type Command,
  OrderService,
  type PlaceOrder,
  type ShipOrder,
  assertNever,
  handleCommand,
} from '../src/commands';

describe('Discriminated Unions 02 - Commands (applied mixed)', () => {
  it('Command is a proper discriminated union (type level)', () => {
    // The exported Command should be assignable from the variants
    const place: PlaceOrder = { type: 'place', orderId: 'o1', items: ['book'] };
    const c: Command = place; // if Command is the DU this works
    expectTypeOf(c).toMatchTypeOf<{ type: string }>();

    if (c.type === 'place') {
      expectTypeOf(c).toEqualTypeOf<PlaceOrder>();
      expectTypeOf(c.orderId).toEqualTypeOf<string>();
      expectTypeOf(c.items).toEqualTypeOf<readonly string[]>();
      // @ts-expect-error no reason on place
      c.reason;
    }

    // additional narrowing demo for other variant (no casts)
    const shipLike: Command = { type: 'ship', orderId: 's9', carrier: 'fedex' };
    if (shipLike.type === 'ship') {
      expectTypeOf(shipLike).toEqualTypeOf<ShipOrder>();
      expectTypeOf(shipLike.carrier).toEqualTypeOf<string>();
    }
  });

  it('class method and pure fn both narrow and produce correct behavior', () => {
    const svc = new OrderService();

    const placeCmd: Command = { type: 'place', orderId: 'o42', items: ['pen'] };
    const cancelCmd: Command = { type: 'cancel', orderId: 'o42', reason: 'changed mind' };

    expect(svc.execute(placeCmd)).toContain('placed');
    const h1 = handleCommand(cancelCmd);
    expect(h1.status).toBe('cancel');

    // pure pipeline style
    const results = [placeCmd, cancelCmd].map(handleCommand);
    expect(results.map((r) => r.status)).toEqual(['place', 'cancel']);
  });

  it('exhaustiveness: missing a case in a handler would fail to assign to never (simulated)', () => {
    function summarize(cmd: Command): string {
      switch (cmd.type) {
        case 'place':
          return `place:${cmd.orderId}`;
        case 'cancel':
          return `cancel:${cmd.reason}`;
        case 'ship':
          return `ship:${cmd.carrier}`;
        default:
          return assertNever(cmd);
      }
    }

    expect(summarize({ type: 'ship', orderId: 's1', carrier: 'ups' })).toBe('ship:ups');

    // Strong @ts-expect-error for bad variant (not part of union) - uses satisfies to force type error without 'as' or any
    // @ts-expect-error - Type '{ type: "refund"; orderId: string; }' does not satisfy the expected type 'Command'
    const _bad = { type: 'refund', orderId: 'x' } satisfies Command;
  });
});
