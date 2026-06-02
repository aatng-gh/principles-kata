// Impure shell: load, call pure decider, execute returned commands via fakes.

import { isOk } from '../../../lib/result';
import { decideOrder } from './pure';
import type { Command, Order, ProcessResult } from './types';

export async function processOrder(orderId: string): Promise<ProcessResult> {
  const order = await fakeDbGet(orderId);
  if (!order) return { ok: false, message: 'not found' };

  const res = decideOrder(order);
  if (!isOk(res)) {
    return { ok: false, message: res.error };
  }

  for (const cmd of res.value.commands) {
    await executeCommand(cmd);
  }
  return { ok: true, message: 'processed' };
}

async function executeCommand(cmd: Command): Promise<void> {
  switch (cmd.kind) {
    case 'UpdateStatus':
      await fakeDbUpdate(cmd.orderId, { status: cmd.status });
      break;
    case 'SendEmail':
      await fakeEmail(cmd.message);
      break;
    case 'Charge':
      await fakePayment(cmd.amount);
      break;
  }
}

// fakes (effects only in shell)
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
