// exercises/typescript/branded-types/01-core/src/brand.ts

declare const brandSymbol: unique symbol;

export type Branded<T, Brand extends string> = T & { readonly [brandSymbol]: Brand };

export function brand<T, B extends string>(value: T, _brand: B): Branded<T, B> {
  // Trusted constructor: the cast is the *only* place the brand is introduced.
  // This is the controlled escape; callers must go through asUserId etc.
  // No `any` used.
  return value as Branded<T, B>;
}

export type UserId = Branded<string, 'UserId'>;
export type PostId = Branded<string, 'PostId'>;

export const asUserId = (s: string): UserId => brand(s, 'UserId');
export const asPostId = (s: string): PostId => brand(s, 'PostId');
