// exercises/fp/pure-immutability/01-basic-invoice-calculator/src/invoiceCalculator.ts
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

const roundCurrency = (amount: number): number => Math.round(amount * 100) / 100;

const calculateLine = (item: CartItem): InvoiceLine => {
  const discountRate = item.discount ?? 0;
  return {
    sku: item.sku,
    qty: item.qty,
    unitPrice: item.unitPrice,
    lineTotal: roundCurrency(item.unitPrice * item.qty * (1 - discountRate)),
  };
};

export function calculateInvoice(cart: Cart, taxRate: number, now: Date): Invoice {
  const lines = cart.items.map(calculateLine);
  const subtotal = roundCurrency(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  const tax = roundCurrency(subtotal * taxRate);
  const total = roundCurrency(subtotal + tax);

  return {
    id: `inv_${cart.id}_${now.getTime()}`,
    cartId: cart.id,
    lines,
    subtotal,
    tax,
    total,
    createdAt: now,
  };
}
