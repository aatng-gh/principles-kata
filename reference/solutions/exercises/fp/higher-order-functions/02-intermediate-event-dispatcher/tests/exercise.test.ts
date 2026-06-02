// Reference copy of the test (passes against the good HOF-wrapped handlers).
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Event, clearReplayLog, dispatch, getReplayLog } from '../src/eventDispatcher';

describe('eventDispatcher reference (HOF middleware)', () => {
  beforeEach(() => {
    clearReplayLog();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('records replay for allowed', () => {
    dispatch({ type: 'OrderPlaced', orderId: 'o1', userId: 'u1', amount: 42 }, false);
    expect(getReplayLog()).toContain('event:OrderPlaced');
  });
});
