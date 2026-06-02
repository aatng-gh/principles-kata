// exercises/fp/higher-order-functions/02-intermediate-event-dispatcher/src/eventDispatcher.ts
// STARTER — giant switch on event.type; cross-cutting (authz, metrics, replay log) copy-pasted inside every case.
// Adding handler or new cross-cut requires editing N places.

export type Event =
  | { type: 'OrderPlaced'; orderId: string; userId: string; amount: number }
  | { type: 'UserLoggedIn'; userId: string }
  | { type: 'RefundIssued'; orderId: string; amount: number };

let replayLog: string[] = []; // mutable for starter "replay"

export function dispatch(event: Event, isAdmin: boolean): void {
  // duplicated cross cuts
  const canAct = isAdmin || event.type !== 'RefundIssued';
  if (!canAct) {
    console.log('[AUTHZ] denied', event.type);
    return;
  }
  replayLog.push(`event:${event.type}`);

  switch (event.type) {
    case 'OrderPlaced':
      console.log('[METRICS] order', event.orderId, event.amount);
      console.log('[DISPATCH] handled OrderPlaced');
      break;
    case 'UserLoggedIn':
      console.log('[METRICS] login', event.userId);
      console.log('[DISPATCH] handled UserLoggedIn');
      break;
    case 'RefundIssued':
      console.log('[METRICS] refund', event.orderId);
      console.log('[DISPATCH] handled RefundIssued');
      break;
  }
}

export function getReplayLog(): string[] {
  return replayLog;
}

export function clearReplayLog(): void {
  replayLog = [];
}
