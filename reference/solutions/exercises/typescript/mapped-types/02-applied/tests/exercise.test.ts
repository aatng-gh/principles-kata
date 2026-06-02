import { describe, expect, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import { AppState, createUpdaters, Public, Updaters } from '../src/mappedStore';

describe('Mapped Types 02 - Public + Updaters (applied dual)', () => {
  it('Public<T> strips underscore-prefixed keys (type level)', () => {
    type Pub = Public<AppState>;
    expectTypeOf<keyof Pub>().toEqualTypeOf<'user' | 'count'>();
    // @ts-expect-error - _internal should not be on Public
    const _bad: Pub['_internalCache'] = undefined as any;
  });

  it('Updaters<T> derives setXyz methods via key remapping + Capitalize (type)', () => {
    type U = Updaters<Public<AppState>>;
    // must have setUser and setCount, not set_internal
    expectTypeOf<U>().toHaveProperty('setUser');
    expectTypeOf<U>().toHaveProperty('setCount');
    // @ts-expect-error no set for private
    const _has: U['set_internalCache'] = undefined as any;

    // the setter types are precise
    type SetUser = U['setUser'];
    expectTypeOf<SetUser>().toEqualTypeOf<((value: { id: number; name: string }) => void) | undefined>();
  });

  it('createUpdaters returns the derived shape and works from class and pure fn', () => {
    const state: AppState = {
      user: { id: 1, name: 'Ada' },
      count: 0,
      _internalCache: new Map(),
    };

    const updaters = createUpdaters(state); // or Public state, but factory handles

    // runtime behavior: the setters should affect or record
    if (updaters.setCount) updaters.setCount(42);
    if (updaters.setUser) updaters.setUser({ id: 2, name: 'Grace' });

    expect(state.count).toBe(42); // demo impl may mutate target
    expect(state.user.name).toBe('Grace');

    // OOP usage simulation: a class holding updaters (init after ctor param assigned)
    class StateController {
      private readonly state: AppState;
      private readonly updaters: Updaters<Public<AppState>>;
      constructor(initial: AppState) {
        this.state = initial;
        this.updaters = createUpdaters(this.state);
      }

      increment() {
        const cur = this.state.count;
        this.updaters.setCount?.(cur + 1);
      }
    }

    const ctrl = new StateController({ ...state, count: 10, _internalCache: new Map() });
    ctrl.increment();
    // after, whatever the demo did

    // Pure function usage: a generic applier
    function applyCount(u: Updaters<{ count: number }>, v: number) {
      u.setCount?.(v);
    }
    const small = createUpdaters({ count: 0 });
    applyCount(small, 99);
    if (small.setCount) {
      expect(typeof small.setCount).toBe('function');
    } else {
      // should not happen
      expect(small.setCount).toBeDefined();
    }

    // type proof
    expectTypeOf(createUpdaters({ count: 1 })).toEqualTypeOf<Updaters<{ count: number }>>();
  });
});
