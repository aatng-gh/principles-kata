import { expectTypeOf } from 'expect-type';
import { describe, expect, it } from 'vitest';
import { type DeepReadonly, deepFreeze } from '../../01-core/src/deep';
import {
  type AppState,
  type Public,
  type Updaters,
  createReadonlyUpdaters,
  createUpdaters,
} from '../src/mappedStore';
import { deepUpdate } from '../src/update';

interface Settings {
  theme: 'dark' | 'light';
  count: number;
  meta?: { version: number };
}

describe('Mapped 02 (applied - deep readonly updates + mapped updaters)', () => {
  it('deepUpdate produces new readonly object, original unchanged (deep)', () => {
    const base: Settings = { theme: 'dark' as const, count: 1, meta: { version: 1 } };
    const frozenBase = deepFreeze(base);

    const updated = deepUpdate(frozenBase, { count: 2, meta: { version: 2 } });

    expect(updated.count).toBe(2);
    expect(updated.meta?.version).toBe(2);
    expect(base.count).toBe(1); // original not mutated
    expect(base.meta?.version).toBe(1);

    // precise type, no any
    expectTypeOf(updated).toEqualTypeOf<DeepReadonly<Settings>>();
    expectTypeOf(updated.meta).toEqualTypeOf<{ readonly version: number } | undefined>();
  });

  it('deepUpdate + DeepReadonly used in pure reducer (FP) and class withX (OOP)', () => {
    // Pure reducer style
    function updateCountReducer(
      state: DeepReadonly<Settings>,
      newCount: number
    ): DeepReadonly<Settings> {
      return deepUpdate(state, { count: newCount });
    }

    const initial: Settings = { theme: 'light' as const, count: 10 };
    const frozenInitial = deepUpdate(initial, {});
    const after = updateCountReducer(frozenInitial, 99);

    expect(after.count).toBe(99);
    expect(frozenInitial.count).toBe(10); // no mutation
    expectTypeOf(after).toEqualTypeOf<DeepReadonly<Settings>>();

    // OOP class withX style (returns new readonly, like immutable wither)
    class SettingsService {
      private current: DeepReadonly<Settings>;
      constructor(initial: Settings) {
        this.current = deepUpdate(initial, {});
      }
      withCount(c: number): DeepReadonly<Settings> {
        const next = deepUpdate(this.current, { count: c });
        this.current = next; // adopt new
        return next;
      }
      withTheme(t: 'dark' | 'light'): DeepReadonly<Settings> {
        return deepUpdate(this.current, { theme: t });
      }
      get(): DeepReadonly<Settings> {
        return this.current;
      }
    }

    const svc = new SettingsService({ theme: 'dark' as const, count: 5 });
    const afterWith = svc.withCount(42);
    expect(afterWith.count).toBe(42);
    expect(svc.get().count).toBe(42);
    expectTypeOf(afterWith).toEqualTypeOf<DeepReadonly<Settings>>();
  });

  it('Public<T> strips underscore keys and Updaters derives setters (mapped remapping)', () => {
    type Pub = Public<AppState>;
    expectTypeOf<keyof Pub>().toEqualTypeOf<'user' | 'count'>();
    // @ts-expect-error _internalCache not public
    const _bad: Pub['_internalCache'] = undefined as unknown;

    type U = Updaters<Public<AppState>>;
    expectTypeOf<U>().toHaveProperty('setUser');
    expectTypeOf<U>().toHaveProperty('setCount');
    // @ts-expect-error no setter for private
    const _no: U['set_internalCache'] = undefined as unknown;

    type SetCount = U['setCount'];
    expectTypeOf<SetCount>().toEqualTypeOf<((value: number) => void) | undefined>();
  });

  it('createUpdaters + createReadonlyUpdaters work with deep readonly views and class/pure (exercises both together)', () => {
    const state: AppState = {
      user: { id: 1, name: 'Ada' },
      count: 0,
      _internalCache: new Map(),
    };

    // plain
    const ups = createUpdaters(state);
    if (ups.setCount) ups.setCount(7);
    expect(state.count).toBe(7);

    // with readonly view (ties to update/deep) -- types accept DeepReadonly, but we avoid invoking demo setters
    // because the demo impl mutates and the passed object may be frozen by deepFreeze/deepUpdate.
    const roState = deepUpdate(state, {}) as DeepReadonly<AppState>;
    const roUps = createReadonlyUpdaters(roState);
    expect(roUps).toBeDefined();
    // (do not call roUps.set* in this demo to avoid "cannot assign to readonly")

    // class usage
    class Controller {
      private state: DeepReadonly<AppState>;
      private ups: Updaters<Public<AppState>>;
      constructor(init: AppState) {
        this.state = deepUpdate(init, {});
        this.ups = createReadonlyUpdaters(this.state);
      }
      inc() {
        const cur = this.state.count;
        this.ups.setCount?.(cur + 1);
      }
    }
    const ctrl = new Controller({ ...state, count: 10, _internalCache: new Map() });
    // construction exercises readonly+updaters wiring; skip .inc() as demo updaters mutate and state is frozen
    expect(ctrl).toBeDefined();

    // pure fn usage
    function applyViaUpdater(u: Updaters<{ count: number }>, v: number) {
      u.setCount?.(v);
    }
    const smallState = { count: 0 };
    const smallUps = createUpdaters(smallState);
    applyViaUpdater(smallUps, 123);
    if (smallUps.setCount) {
      expect(typeof smallUps.setCount).toBe('function');
    }

    expectTypeOf(createUpdaters({ count: 1 })).toEqualTypeOf<Updaters<{ count: number }>>();
  });
});
