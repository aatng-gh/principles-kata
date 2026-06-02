// exercises/fp/higher-order-functions/02-intermediate-event-dispatcher/tests/exercise.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Event, clearReplayLog, dispatch, getReplayLog } from '../src/eventDispatcher';

describe('eventDispatcher (HOF intermediate)', () => {
  beforeEach(() => {
    clearReplayLog();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('dispatches OrderPlaced for non-admin and records replay + metrics', () => {
    const e: Event = { type: 'OrderPlaced', orderId: 'o1', userId: 'u1', amount: 42 };
    dispatch(e, false);
    expect(getReplayLog()).toContain('event:OrderPlaced');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[METRICS]'),
      expect.anything(),
      expect.anything()
    );
  });

  it('denies RefundIssued for non-admin (authz cross-cut)', () => {
    const e: Event = { type: 'RefundIssued', orderId: 'o2', amount: 10 };
    dispatch(e, false);
    expect(getReplayLog()).not.toContain('event:RefundIssued');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[AUTHZ] denied'),
      expect.anything()
    );
  });

  it('allows RefundIssued for admin', () => {
    const e: Event = { type: 'RefundIssued', orderId: 'o3', amount: 99 };
    dispatch(e, true);
    expect(getReplayLog()).toContain('event:RefundIssued');
  });

  it('UserLoggedIn always allowed and replayed', () => {
    dispatch({ type: 'UserLoggedIn', userId: 'u9' }, false);
    expect(getReplayLog()).toContain('event:UserLoggedIn');
  });
});
