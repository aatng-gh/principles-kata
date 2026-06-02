// exercises/oop/liskov-substitution/02-intermediate-asset-valuation/tests/exercise.test.ts
import { beforeEach, describe, expect, it } from 'vitest';
import {
  type Asset,
  Bond,
  Option,
  RealEstate,
  Stock,
  ValuationService,
} from '../src/assetValuation';

describe('Asset valuation (LSP intermediate)', () => {
  let service: ValuationService;

  beforeEach(() => {
    service = new ValuationService();
  });

  it('individual asset values (current rules)', () => {
    const stock = new Stock('AAPL', 10, 180);
    expect(stock.getValue()).toBe(1800);
    expect(stock.getRisk()).toBe(6);

    const bond = new Bond(10000, 5);
    expect(bond.getValue()).toBeCloseTo(11500);
    expect(bond.getRisk()).toBe(2);

    const option = new Option('TSLA', 2, 250, 260);
    expect(option.getValue()).toBe(2000); // (260-250)*2*100
    expect(option.getRisk()).toBe(8);

    const re = new RealEstate('123 Main', 500000);
    expect(re.getValue()).toBe(500000);
    expect(re.getRisk()).toBe(3);
  });

  it('totalValue applies current special adjustments (RE haircut, option model)', () => {
    const assets: Asset[] = [
      new Stock('MSFT', 5, 400),
      new Bond(20000, 3),
      new Option('GOOG', 1, 100, 105),
      new RealEstate('Downtown', 1000000),
    ];
    // stock: 2000
    // bond: 20000 * 1.09 = 21800
    // option: 500 , no extra in getValue here
    // re: 1000000 * 0.95 = 950000   <--- from special in service
    const total = service.totalValue(assets);
    expect(total).toBeCloseTo(2000 + 21800 + 500 + 950000);
  });

  it('aggregateRisk applies current specials (options count more)', () => {
    const assets: Asset[] = [
      new Stock('X', 1, 100),
      new Option('Y', 1, 90, 95),
      new RealEstate('Z', 100000),
    ];
    const risk = service.aggregateRisk(assets);
    // risks: 6 , 8*1.5=12 -> but min later, 3 ; avg of (6 +12 +3)/3 =7 but capped at 10 in code? wait follow starter
    // starter: totalRisk =6 +12 +3=21 , /3 =7 , min(10,7)=7
    expect(risk).toBeCloseTo(7);
  });

  it('batch results are stable for the initial asset mix (new derivative must not require changing these calcs)', () => {
    const mix: Asset[] = [new Bond(5000, 10), new Stock('OLD', 2, 50)];
    const t1 = service.totalValue(mix);
    const r1 = service.aggregateRisk(mix);
    // re-run to show determinism in this test (starter mutates option but not these)
    const t2 = service.totalValue(mix);
    const r2 = service.aggregateRisk(mix);
    expect(t1).toBeCloseTo(t2);
    expect(r1).toBeCloseTo(r2);
  });
});
