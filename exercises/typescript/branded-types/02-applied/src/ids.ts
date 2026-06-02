// exercises/typescript/branded-types/02-applied/src/ids.ts
// Applied mixed scenario.

import { type Branded, brand } from '../../01-core/src/brand'; // reuse the type/brand helper

export type UserId = Branded<string, 'UserId'>;
export type OrderId = Branded<string, 'OrderId'>;

export const asUserId = (s: string): UserId => brand(s, 'UserId');
export const asOrderId = (s: string): OrderId => brand(s, 'OrderId');

// OOP style
export class UserService {
  // Use branded key type for the Map: runtime keys are still the underlying strings (phantom brand has no runtime presence),
  // but the type system prevents mixing brands or raw strings as keys.
  private users = new Map<UserId, { id: UserId; name: string }>();

  // register is the *trusted boundary* that accepts raw string (from input) and produces branded via asUserId.
  // This is the documented place raw strings enter the domain.
  register(rawId: string, name: string): UserId {
    const id = asUserId(rawId);
    this.users.set(id, { id, name });
    return id;
  }

  getName(id: UserId): string | undefined {
    // No cast: Map is keyed by UserId, so get accepts UserId directly.
    return this.users.get(id)?.name;
  }
}

// FP style pure transform — only accepts branded
export function formatUserRef(id: UserId, name: string): string {
  // No cast needed: String(id) yields the underlying primitive string value for interpolation.
  // Brand remains enforced at all call sites; this is pure data transform.
  return `${name} <${String(id)}>`;
}
