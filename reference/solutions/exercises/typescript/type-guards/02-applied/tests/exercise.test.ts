import { describe, expect, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import { AppEvent, collectValidEvents, EventProcessor, isAppEvent, isUser, User } from '../src/eventGuards';

describe('Type Guards 02 - Event guards in mixed OOP/FP', () => {
  it('isAppEvent narrows in if and in filter (types)', () => {
    const raw: unknown = { type: 'mouse', x: 10, y: 20 };
    if (isAppEvent(raw)) {
      expectTypeOf(raw).toEqualTypeOf<AppEvent>();
      if (raw.type === 'mouse') {
        expectTypeOf(raw.x).toEqualTypeOf<number>();
      }
    }

    const mixed: unknown[] = [
      { type: 'key', key: 'Enter' },
      123,
      { type: 'mouse', x: 0, y: 0 },
    ];
    const events = mixed.filter(isAppEvent);
    expectTypeOf(events).toEqualTypeOf<AppEvent[]>();
    expect(events).toHaveLength(2);
  });

  it('class processor and pure collector both rely on the same guard without casts', () => {
    const proc = new EventProcessor();
    expect(proc.handle({ type: 'key', key: 'a' })).toBe(true);
    expectTypeOf(proc.last!).toEqualTypeOf<AppEvent>();

    const collected = collectValidEvents([
      { type: 'mouse', x: 1, y: 2 },
      'bad',
      { type: 'key', key: 'x' },
    ]);
    expectTypeOf(collected).toEqualTypeOf<AppEvent[]>();
    expect(collected.map((e) => e.type)).toEqual(['mouse', 'key']);
  });

  it('isUser guard for entity-like (used in class ctor simulation + fp)', () => {
    const maybe: unknown = { id: 'u1', name: 'Ada' };
    if (isUser(maybe)) {
      expectTypeOf(maybe).toEqualTypeOf<User>();
      const u: User = maybe; // no cast needed
      expect(u.name).toBe('Ada');
    }

    function onlyUsers(list: unknown[]): User[] {
      return list.filter(isUser);
    }
    expect(onlyUsers([{ id: '1', name: 'x' }, {}])).toHaveLength(1);
  });
});
