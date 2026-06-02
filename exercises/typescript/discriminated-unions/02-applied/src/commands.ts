// exercises/typescript/discriminated-unions/02-applied/src/commands.ts
// Real DU with literal discriminant. Exhaustive handlers using assertNever in both class method and pure fn.
// Usable from OOP services and FP pipelines with precise narrowing, no any.

export type PlaceOrder = {
  type: 'place';
  orderId: string;
  items: readonly string[];
};

export type CancelOrder = {
  type: 'cancel';
  orderId: string;
  reason: string;
};

export type ShipOrder = {
  type: 'ship';
  orderId: string;
  carrier: string;
};

export type Command = PlaceOrder | CancelOrder | ShipOrder;

export function assertNever(x: never): never {
  throw new Error(`Unexpected command: ${JSON.stringify(x)}`);
}

export class OrderService {
  execute(cmd: Command): string {
    switch (cmd.type) {
      case 'place':
        return `placed ${cmd.orderId} (${cmd.items.length} items)`;
      case 'cancel':
        return `cancelled ${cmd.orderId}: ${cmd.reason}`;
      case 'ship':
        return `shipped ${cmd.orderId} via ${cmd.carrier}`;
      default:
        return assertNever(cmd);
    }
  }
}

export function handleCommand(cmd: Command): { status: string; sideEffects: string[] } {
  switch (cmd.type) {
    case 'place':
      return { status: 'place', sideEffects: [`reserve ${cmd.items.length} items`] };
    case 'cancel':
      return { status: 'cancel', sideEffects: [`refund for ${cmd.orderId}`] };
    case 'ship':
      return { status: 'ship', sideEffects: [`notify carrier ${cmd.carrier}`] };
    default:
      return assertNever(cmd);
  }
}
