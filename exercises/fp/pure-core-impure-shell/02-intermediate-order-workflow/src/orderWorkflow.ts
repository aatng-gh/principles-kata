// exercises/fp/pure-core-impure-shell/02-intermediate-order-workflow/src/orderWorkflow.ts
import { type Result, err, ok } from '../../../lib/result';

export interface Order {
  readonly id: string;
  readonly userId: string;
  readonly total: number;
  readonly status: string;
}

export interface ProcessResult {
  readonly ok: boolean;
  readonly message: string;
}

type OrderStatus = 'approved' | 'rejected' | 'payment-failed';

type Command =
  | { readonly kind: 'Charge'; readonly amount: number }
  | { readonly kind: 'UpdateOrder'; readonly orderId: string; readonly status: OrderStatus }
  | { readonly kind: 'SendEmail'; readonly message: string };

interface Decision {
  readonly result: ProcessResult;
  readonly commands: readonly Command[];
}

export function decideOrder(order: Order): Result<Decision, string> {
  if (order.status !== 'pending' || order.total > 10000) {
    return ok({
      result: { ok: false, message: 'rejected' },
      commands: [
        { kind: 'UpdateOrder', orderId: order.id, status: 'rejected' },
        { kind: 'SendEmail', message: `Order ${order.id} rejected` },
      ],
    });
  }

  if (order.total < 0) {
    return err('invalid total');
  }

  return ok({
    result: { ok: true, message: 'approved' },
    commands: [
      { kind: 'Charge', amount: order.total },
      { kind: 'UpdateOrder', orderId: order.id, status: 'approved' },
      { kind: 'SendEmail', message: `Order ${order.id} approved and charged` },
    ],
  });
}

export async function processOrder(orderId: string): Promise<ProcessResult> {
  const order = await fakeDbGet(orderId);
  if (!order) return { ok: false, message: 'not found' };

  const decision = decideOrder(order);
  if (!decision.ok) {
    return { ok: false, message: decision.error };
  }

  try {
    await executeCommands(decision.value.commands);
    return decision.value.result;
  } catch {
    await fakeDbUpdate(orderId, { status: 'payment-failed' });
    return { ok: false, message: 'payment failed' };
  }
}

async function executeCommands(commands: readonly Command[]): Promise<void> {
  await commands.reduce<Promise<void>>(async (previous, command) => {
    await previous;
    return executeCommand(command);
  }, Promise.resolve());
}

async function executeCommand(command: Command): Promise<void> {
  switch (command.kind) {
    case 'Charge':
      return fakePayment(command.amount);
    case 'UpdateOrder':
      return fakeDbUpdate(command.orderId, { status: command.status });
    case 'SendEmail':
      return fakeEmail(command.message);
    default: {
      const exhaustive: never = command;
      return exhaustive;
    }
  }
}

async function fakeDbGet(id: string): Promise<Order | null> {
  console.log('[DB] get', id);
  return { id, userId: 'u1', total: 42, status: 'pending' };
}
async function fakeDbUpdate(id: string, patch: Partial<Order>): Promise<void> {
  console.log('[DB] update', id, patch);
}
async function fakeEmail(msg: string): Promise<void> {
  console.log('[EMAIL]', msg);
}
async function fakePayment(amount: number): Promise<void> {
  console.log('[PAY] charge', amount);
  if (amount > 1000) throw new Error('declined');
}
