import type { Inventory } from './ports';

export class WarehouseInventory implements Inventory {
  private stock = new Map<string, number>();
  constructor(seed?: Record<string, number>) {
    if (seed) for (const [k, v] of Object.entries(seed)) this.stock.set(k, v);
  }
  async hasStock(sku: string, qty: number): Promise<boolean> {
    return (this.stock.get(sku) ?? 0) >= qty;
  }
  async reserve(sku: string, qty: number): Promise<boolean> {
    const cur = this.stock.get(sku) ?? 0;
    if (cur < qty) return false;
    this.stock.set(sku, cur - qty);
    console.log(`[INV] reserved ${qty} of ${sku}`);
    return true;
  }
}
