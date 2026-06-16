// exercises/fp/higher-order-functions/02-intermediate-event-dispatcher/src/eventDispatcher.ts
export type Event =
  | { type: 'OrderPlaced'; orderId: string; userId: string; amount: number }
  | { type: 'UserLoggedIn'; userId: string }
  | { type: 'RefundIssued'; orderId: string; amount: number };

type Handler<E extends Event = Event> = (event: E, isAdmin: boolean) => void;
type Middleware = (handler: Handler) => Handler;

let replayLog: string[] = [];
const handlers: Partial<Record<Event['type'], Handler>> = {};

const composeMiddleware =
  (middleware: readonly Middleware[]) =>
  (handler: Handler): Handler =>
    middleware.reduceRight((next, wrap) => wrap(next), handler);

const withAuthz: Middleware = (handler) => (event, isAdmin) => {
  // Oblivious wrapper (no event kind knowledge or branching here). Specific authz policies live at registration composition sites only.
  handler(event, isAdmin);
};

const withReplay: Middleware = (handler) => (event, isAdmin) => {
  replayLog = [...replayLog, `event:${event.type}`];
  handler(event, isAdmin);
};

const withMetrics: Middleware = (handler) => (event, isAdmin) => {
  console.log('[METRICS]', event.type, event);
  handler(event, isAdmin);
};

const baseHandler: Handler = (_event) => {
  // pure; no side effects. Dispatch log (if desired) would be a withDispatchLog HOF applied at registration only.
};

const defaultMiddleware = composeMiddleware([withAuthz, withReplay, withMetrics]);

export const registerHandler = <E extends Event>(
  type: E['type'],
  handler: Handler<E>,
  middleware: readonly Middleware[] = [withAuthz, withReplay, withMetrics]
): void => {
  handlers[type] = composeMiddleware(middleware)(handler as Handler);
};

// Order and login use default (with* are oblivious cross-cuts).
registerHandler('OrderPlaced', baseHandler);
registerHandler('UserLoggedIn', baseHandler);

// Refund uses registration as composition site: pre-wrap replay+metrics into the handler arg,
// then supply a one-off authz guard as outer middleware. This keeps all with* HOFs generic/oblivious
// (no kind checks or hard-coded types inside them); specific policy for Refund+!admin lives only here.
registerHandler(
  'RefundIssued',
  composeMiddleware([withReplay, withMetrics])(baseHandler),
  [
    (h) => (event, isAdmin) => {
      if (event.type === 'RefundIssued' && !isAdmin) {
        console.log('[AUTHZ] denied', event.type);
        return;
      }
      h(event, isAdmin);
    },
  ]
);

export const dispatch = (event: Event, isAdmin: boolean): void => {
  const handler = handlers[event.type] ?? defaultMiddleware(baseHandler);
  handler(event, isAdmin);
};

export function getReplayLog(): string[] {
  return [...replayLog];
}

export function clearReplayLog(): void {
  replayLog = [];
}
