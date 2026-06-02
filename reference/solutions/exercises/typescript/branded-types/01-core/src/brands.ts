// exercises/typescript/branded-types/01-core/src/brands.ts
// Branded via unique symbol (unforgeable without the module's creator).
// Only createUserId / createOrderId (the trusted paths) produce the brand.
// Raw string literals or variables cannot be assigned without a cast (which we treat as smell).

declare const userIdBrand: unique symbol;
export type UserId = string & { readonly [userIdBrand]: true };

declare const orderIdBrand: unique symbol;
export type OrderId = string & { readonly [orderIdBrand]: true };

export function createUserId(raw: string): UserId {
  // In production you might validate format here.
  return raw as UserId;
}

export function createOrderId(raw: string): OrderId {
  return raw as OrderId;
}

export function formatUser(id: UserId): string {
  return `user:${id}`;
}
