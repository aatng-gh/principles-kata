// exercises/typescript/type-guards/02-applied/src/eventGuards.ts
// Correct guards + usage in both a class and a pure filter.

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
  if (typeof x !== 'object' || x === null) return false;
  const o = x as Record<string, unknown>;
  if (o.type === 'mouse') {
    return typeof o.x === 'number' && typeof o.y === 'number';
  }
  if (o.type === 'key') {
    return typeof o.key === 'string';
  }
  return false;
}

export interface User {
  id: string;
  name: string;
}

export function isUser(x: unknown): x is User {
  if (typeof x !== 'object' || x === null) return false;
  const o = x as Record<string, unknown>;
  return typeof o.id === 'string' && typeof o.name === 'string';
}

export class EventProcessor {
  last?: AppEvent;

  handle(raw: unknown): boolean {
    if (isAppEvent(raw)) {
      this.last = raw; // narrowed, no cast
      return true;
    }
    return false;
  }
}

export function collectValidEvents(raws: unknown[]): AppEvent[] {
  return raws.filter(isAppEvent); // filter narrows element
}
