// exercises/typescript/type-guards/01-core/src/guards.ts
// Implemented: proper `x is X` predicates on `unknown`, sound runtime checks, no `any`.

export interface User {
  type: 'user';
  name: string;
}
export interface Admin {
  type: 'admin';
  name: string;
  permissions: string[];
}

export type Person = User | Admin;

export function isUser(p: unknown): p is User {
  return (
    typeof p === 'object' &&
    p !== null &&
    'type' in p &&
    p.type === 'user' &&
    'name' in p &&
    typeof p.name === 'string'
  );
}

export function isAdmin(p: unknown): p is Admin {
  return (
    typeof p === 'object' &&
    p !== null &&
    'type' in p &&
    p.type === 'admin' &&
    'name' in p &&
    typeof p.name === 'string' &&
    'permissions' in p &&
    Array.isArray(p.permissions)
  );
}

export function assertIsAdmin(p: unknown): asserts p is Admin {
  if (!isAdmin(p)) throw new Error('Not admin');
}

// Additional per README: positive number guards (sound narrowing, unknown input).
export function isPositive(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n > 0;
}

export function assertIsPositive(n: unknown): asserts n is number {
  if (!isPositive(n)) throw new Error('Not positive');
}
