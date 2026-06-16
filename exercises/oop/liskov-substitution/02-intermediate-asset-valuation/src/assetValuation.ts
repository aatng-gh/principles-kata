// exercises/oop/liskov-substitution/02-intermediate-asset-valuation/src/assetValuation.ts
export interface Asset {
  getValue(): number;
  getRisk(): number; // 0-10
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
    const intrinsic = Math.max(0, this.market - this.strike);
    return intrinsic * this.contracts * 100;
  }
  getRisk(): number {
    return 8;
  }
}

export class RealEstate implements Asset {
  constructor(
    public readonly address: string,
    public readonly appraised: number
  ) {}
  getValue(): number {
    return this.appraised * 0.95;
  }
  getRisk(): number {
    return 3;
  }
}

export class ValuationService {
  totalValue(assets: readonly Asset[]): number {
    return assets.reduce((sum, asset) => sum + asset.getValue(), 0);
  }

  aggregateRisk(assets: readonly Asset[]): number {
    if (assets.length === 0) return 0;
    const risks = assets.map((asset) => asset.getRisk());
    const averageRisk = risks.reduce((total, risk) => total + risk, 0) / risks.length;
    const concentrationAdjustment = Math.max(...risks) / 6;
    return Math.min(10, averageRisk + concentrationAdjustment);
  }
}
