// exercises/typescript/branded-types/02-applied/src/product.ts
// Branded ids used in a class entity (Product) and in pure transforms (getProductIds, formatLabel).

declare const productIdBrand: unique symbol;
export type ProductId = string & { readonly [productIdBrand]: true };

declare const orderIdBrand: unique symbol;
export type OrderId = string & { readonly [orderIdBrand]: true };

export function makeProductId(s: string): ProductId {
  return s as ProductId;
}

export function makeOrderId(s: string): OrderId {
  return s as OrderId;
}

export class Product {
  constructor(
    public readonly id: ProductId,
    public readonly name: string
  ) {}
}

export function getProductIds(products: Product[]): ProductId[] {
  // map preserves the branded id type because p.id is ProductId
  return products.map((p) => p.id);
}

export function formatLabel(id: ProductId): string {
  return 'prod:' + id;
}
