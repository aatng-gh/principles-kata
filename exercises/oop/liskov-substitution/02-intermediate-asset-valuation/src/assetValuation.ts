// exercises/oop/liskov-substitution/02-intermediate-asset-valuation/src/assetValuation.ts
// THIS IS THE STARTER — ValuationService contains instanceof special cases for "complex" assets.
// Some subtypes mutate or use hidden time; direct + batch numbers are produced so tests pass,
// but the design is not substitutable (new derivative would force edits + could invalidate aggregates).

export interface Asset {
  getValue(): number;
  getRisk(): number; // 0-10
}

export class Stock implements Asset {
  constructor(
    public symbol: string,
    public shares: number,
    public price: number
  ) {}
  getValue(): number {
    return this.shares * this.price;
  }
  getRisk(): number {
    return 6;
  }
}

export class Bond implements Asset {
  constructor(
    public faceValue: number,
    public years: number
  ) {}
  getValue(): number {
    return this.faceValue * (1 + 0.03 * this.years);
  }
  getRisk(): number {
    return 2;
  }
}

export class Option implements Asset {
  private lastValued = 0;
  constructor(
    public underlying: string,
    public contracts: number,
    public strike: number,
    public market: number
  ) {}
  getValue(): number {
    // "model" value — in starter we also mutate for "last"
    const intrinsic = Math.max(0, this.market - this.strike);
    const val = intrinsic * this.contracts * 100;
    this.lastValued = val; // mutation (bad for LSP clients that assume pure query)
    return val;
  }
  getRisk(): number {
    return 8;
  }
}

export class RealEstate implements Asset {
  constructor(
    public address: string,
    public appraised: number
  ) {}
  getValue(): number {
    // "appraisal factor" special cased later
    return this.appraised;
  }
  getRisk(): number {
    return 3;
  }
}

export class ValuationService {
  totalValue(assets: Asset[]): number {
    return assets.reduce((sum, a) => {
      let v = a.getValue();
      if (a instanceof Option) {
        v = v * 1.0; // placeholder for "vol adjustment" that was special
      } else if (a instanceof RealEstate) {
        v = v * 0.95; // "liquidity haircut" special only for RE
      }
      return sum + v;
    }, 0);
  }

  aggregateRisk(assets: Asset[]): number {
    if (assets.length === 0) return 0;
    // simple avg, but with special for options (they "count double" toward risk in bad design)
    let totalRisk = 0;
    for (const a of assets) {
      let r = a.getRisk();
      if (a instanceof Option) r = r * 1.5;
      totalRisk += r;
    }
    return Math.min(10, totalRisk / assets.length);
  }
}
