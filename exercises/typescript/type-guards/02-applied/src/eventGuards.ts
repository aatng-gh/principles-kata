// exercises/typescript/type-guards/02-applied/src/eventGuards.ts
// Fixed: proper predicate guards + dual OOP/FP usage without casts in impl.

export interface MouseEvent {
  type: 'mouse';
  x: number;
  y: number;
}

export interface KeyEvent {
  type: 'key';
  key: string;
}

export type AppEvent = MouseEvent | KeyEvent;

export function isAppEvent(x: unknown): x is AppEvent {
  if (typeof x !== 'object' || x === null) {
    return false;
  }
  const rec = x as Record<string, unknown>;
  if (rec.type === 'mouse') {
    return typeof rec.x === 'number' && typeof rec.y === 'number';
  }
  if (rec.type === 'key') {
    return typeof rec.key === 'string';
  }
  return false;
}

export interface User {
  id: string;
  name: string;
}

export function isUser(x: unknown): x is User {
  if (typeof x !== 'object' || x === null) {
    return false;
  }
  const rec = x as Record<string, unknown>;
  return typeof rec.id === 'string' && typeof rec.name === 'string';
}

export class EventProcessor {
  last?: AppEvent;
  handle(raw: unknown): boolean {
    if (isAppEvent(raw)) {
      // raw is now narrowed to AppEvent by the guard predicate; no cast
      this.last = raw;
      return true;
    }
    return false;
  }
}

export function collectValidEvents(raws: unknown[]): AppEvent[] {
  // Array.prototype.filter understands user-defined type guards and narrows the result
  return raws.filter(isAppEvent);
}
