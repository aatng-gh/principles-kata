import { describe, expect, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import { formatLabel, getProductIds, makeOrderId, makeProductId, OrderId, Product, ProductId } from '../src/product';

describe('Branded Types 02 - Entity + FP pipeline', () => {
  it('Product ctor and pure fns require/use branded ProductId (type)', () => {
    const pid = makeProductId('p1');
    const prod = new Product(pid, 'Widget');
    expectTypeOf(prod.id).toEqualTypeOf<ProductId>();

    // @ts-expect-error - raw string not ok for ctor
    new Product('raw', 'x');

    const oId = makeOrderId('o1');
    // @ts-expect-error - wrong brand
    new Product(oId, 'bad');

    const ids = getProductIds([prod]);
    expectTypeOf(ids).toEqualTypeOf<ProductId[]>();

    // formatLabel should also be branded in good version
    expect(formatLabel(pid)).toContain('p1');
    // @ts-expect-error raw or order
    formatLabel('raw');
  });

  it('pipeline preserves brand, class and pure can be mixed', () => {
    const prods = [
      new Product(makeProductId('p_a'), 'A'),
      new Product(makeProductId('p_b'), 'B'),
    ];

    const idsFromPipe: ProductId[] = getProductIds(prods);
    expect(idsFromPipe).toEqual(['p_a', 'p_b']);

    // simulate a class that uses branded
    class Catalog {
      private readonly byId = new Map<ProductId, Product>();
      add(p: Product) {
        this.byId.set(p.id, p);
      }
      get(id: ProductId) {
        return this.byId.get(id);
      }
    }
    const cat = new Catalog();
    cat.add(prods[0]);
    const found = cat.get(makeProductId('p_a'));
    expect(found?.name).toBe('A');

    // type of map key would be ProductId in good code
    expectTypeOf(cat.get(makeProductId('p_a'))).toEqualTypeOf<Product | undefined>();
  });
});
