// Reference good implementation — fully pure + immutable.

export interface CartItem {
  readonly sku: string;
  readonly unitPrice: number;
  readonly qty: number;
  readonly discount?: number;
}

export interface Cart {
  readonly id: string;
  readonly items: readonly CartItem[];
  readonly customerId?: string;
}

export interface InvoiceLine {
  readonly sku: string;
  readonly qty: number;
  readonly unitPrice: number;
  readonly lineTotal: number;
}

export interface Invoice {
  readonly id: string;
  readonly cartId: string;
  readonly lines: readonly InvoiceLine[];
  readonly subtotal: number;
  readonly tax: number;
  readonly total: number;
  readonly createdAt: Date;
}

function lineTotal(item: CartItem): number {
  const base = item.unitPrice * item.qty;
  return item.discount ? base * (1 - item.discount) : base;
}

function toLine(item: CartItem): InvoiceLine {
  return {
    sku: item.sku,
    qty: item.qty,
    unitPrice: item.unitPrice,
    lineTotal: lineTotal(item),
  };
}

export function calculateInvoice(cart: Cart, taxRate = 0.1, now: Date): Invoice {
  const lines = cart.items.map(toLine);
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const tax = Math.round(subtotal * taxRate * 100) / 100; // simple money
  const total = subtotal + tax;

  return {
    id: `inv_${now.getTime()}`,
    cartId: cart.id,
    lines,
    subtotal,
    tax,
    total,
    createdAt: now,
  };
}
