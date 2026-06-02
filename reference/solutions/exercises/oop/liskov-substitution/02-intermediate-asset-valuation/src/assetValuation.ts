// Reference good LSP design.
// All valuation and risk logic for a kind lives inside that asset subtype.
// ValuationService is now a trivial uniform aggregator; it never mentions Option or RealEstate.
// Adding Derivative requires only the new class; totals and risk for existing assets are unaffected
// (their getValue/getRisk implementations are unchanged).

export interface Asset {
  getValue(): number;
  getRisk(): number;
}

export class Stock implements Asset {
  constructor(
    public readonly symbol: string,
    public readonly shares: number,
    public readonly price: number
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
    public readonly faceValue: number,
    public readonly years: number
  ) {}
  getValue(): number {
    return this.faceValue * (1 + 0.03 * this.years);
  }
  getRisk(): number {
    return 2;
  }
}

export class Option implements Asset {
  constructor(
    public readonly underlying: string,
    public readonly contracts: number,
    public readonly strike: number,
    public readonly market: number
  ) {}
  getValue(): number {
    // model value; no mutation, deterministic
    const intrinsic = Math.max(0, this.market - this.strike);
    return intrinsic * this.contracts * 100;
  }
  getRisk(): number {
    // effective contribution for aggregation (derivatives can have leveraged risk)
    // returning 8 here keeps nominal; aggregate uses uniform math
    return 8;
  }
}

export class RealEstate implements Asset {
  constructor(
    public readonly address: string,
    public readonly appraised: number
  ) {}
  getValue(): number {
    // liquidity / model adjustment is part of this asset's valuation (moved out of service)
    return this.appraised * 0.95;
  }
  getRisk(): number {
    return 3;
  }
}

export class ValuationService {
  totalValue(assets: readonly Asset[]): number {
    return assets.reduce((sum, a) => sum + a.getValue(), 0);
  }

  aggregateRisk(assets: readonly Asset[]): number {
    if (assets.length === 0) return 0;
    const sum = assets.reduce((s, a) => s + a.getRisk(), 0);
    return Math.min(10, sum / assets.length);
  }
}
