// exercises/fp/pure-core-impure-shell/02-intermediate-order-workflow/src/orderWorkflow.ts
// STARTER — everything in one async fn: DB read, decision, DB write, email, payment try/catch.
// Mixed pure decision with effects; hard to test decisions without real DB.

import { type Result, err, ok } from '../../../lib/result';

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
}

export interface ProcessResult {
  ok: boolean;
  message: string;
}

export async function processOrder(orderId: string): Promise<ProcessResult> {
  // effect: load
  const order = await fakeDbGet(orderId);
  if (!order) return { ok: false, message: 'not found' };

  // "decision" mixed in
  if (order.status !== 'pending' || order.total > 10000) {
    await fakeDbUpdate(orderId, { status: 'rejected' });
    await fakeEmail(`Order ${orderId} rejected`);
    return { ok: false, message: 'rejected' };
  }

  // more effect
  try {
    await fakePayment(order.total);
    await fakeDbUpdate(orderId, { status: 'approved' });
    await fakeEmail(`Order ${orderId} approved and charged`);
    return { ok: true, message: 'approved' };
  } catch (e) {
    await fakeDbUpdate(orderId, { status: 'payment-failed' });
    return { ok: false, message: 'payment failed' };
  }
}

// fakes
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
