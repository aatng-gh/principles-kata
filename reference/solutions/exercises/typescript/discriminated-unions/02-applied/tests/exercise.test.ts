import { describe, expect, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import { Command, OrderService, handleCommand } from '../src/commands';

describe('Discriminated Unions 02 - Commands (applied mixed)', () => {
  type PlaceOrder = { type: 'place'; orderId: string; items: readonly string[] };
  type CancelOrder = { type: 'cancel'; orderId: string; reason: string };
  type ShipOrder = { type: 'ship'; orderId: string; carrier: string };

  // We re-declare here only for the test expectations; the src must export a real Command = union of these
  type TestCommand = PlaceOrder | CancelOrder | ShipOrder;

  it('Command is a proper discriminated union (type level)', () => {
    // The exported Command should be assignable from the variants
    const place: PlaceOrder = { type: 'place', orderId: 'o1', items: ['book'] };
    const c: Command = place; // if Command is the DU this works
    expectTypeOf(c).toMatchTypeOf<{ type: string }>();

    if (c.type === 'place') {
      expectTypeOf(c.orderId).toEqualTypeOf<string>();
      expectTypeOf(c.items).toEqualTypeOf<readonly string[]>();
      // @ts-expect-error no reason on place
      c.reason;
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
          return 'place:' + cmd.orderId;
        case 'cancel':
          return 'cancel:' + (cmd as any).reason;
        case 'ship':
          return 'ship';
        // if a new variant added, without default or case, TS would error if we did:
        // default: assertNever(cmd);
      }
      return 'other';
    }

    expect(summarize({ type: 'ship', orderId: 's1', carrier: 'ups' } as Command)).toBe('ship');
  });
});
