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

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

export function isAppEvent(x: unknown): x is AppEvent {
  if (!isRecord(x)) {
    return false;
  }
  if (x.type === 'mouse') {
    return typeof x.x === 'number' && typeof x.y === 'number';
  }
  if (x.type === 'key') {
    return typeof x.key === 'string';
  }
  return false;
}

export interface User {
  id: string;
  name: string;
}

export function isUser(x: unknown): x is User {
  if (!isRecord(x)) {
    return false;
  }
  return typeof x.id === 'string' && typeof x.name === 'string';
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
