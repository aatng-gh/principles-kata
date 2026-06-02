// Reference good impl for branded 01
declare const brandSymbol: unique symbol;

export type Branded<T, Brand extends string> = T & { readonly [brandSymbol]: Brand };

export function brand<T, B extends string>(value: T, _brand: B): Branded<T, B> {
  return value as Branded<T, B>;
}

export type UserId = Branded<string, 'UserId'>;
export type PostId = Branded<string, 'PostId'>;

export const asUserId = (s: string): UserId => brand(s, 'UserId');
export const asPostId = (s: string): PostId => brand(s, 'PostId');
