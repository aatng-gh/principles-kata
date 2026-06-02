// Pure decision logic for order workflow. Returns Result + list of commands (data).
// Why (pure-core): all ifs about approval live here; no awaits, no console, no DB. Deterministic given
// the Order snapshot. Shell executes the commands. Uses Result for explicit error/decision.

import { type Result, err, ok } from '../../../lib/result';
import type { Command, Decision, Order } from './types';

export function decideOrder(
  order: Order
): Result<{ decision: Decision; commands: readonly Command[] }, string> {
  if (order.status !== 'pending') {
    return err('order not pending');
  }
  if (order.total > 10000) {
    const decision: Decision = { kind: 'Reject', reason: 'amount too high' };
    const commands: Command[] = [
      { kind: 'UpdateStatus', orderId: order.id, status: 'rejected' },
      { kind: 'SendEmail', message: `Order ${order.id} rejected: ${decision.reason}` },
    ];
    return ok({ decision, commands });
  }
  const decision: Decision = { kind: 'Approve', chargeAmount: order.total };
  const commands: Command[] = [
    { kind: 'Charge', amount: order.total },
    { kind: 'UpdateStatus', orderId: order.id, status: 'approved' },
    { kind: 'SendEmail', message: `Order ${order.id} approved and charged` },
  ];
  return ok({ decision, commands });
}
