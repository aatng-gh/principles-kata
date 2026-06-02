// exercises/fp/pure-immutability/01-basic-invoice-calculator/src/invoiceCalculator.ts
// STARTER — deliberately imperative and impure.

export interface CartItem {
  sku: string;
  unitPrice: number;
  qty: number;
  discount?: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  customerId?: string;
}

export interface InvoiceLine {
  sku: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Invoice {
  id: string;
  cartId: string;
  lines: InvoiceLine[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
}

/**
 * STARTER SIGNATURE (impure).
 * Learner must change to accept explicit now and stop mutating.
 */
export function calculateInvoice(cart: Cart, taxRate = 0.1, now: Date = new Date()): Invoice {
  // MUTATES INPUT on purpose (bad)
  let subtotal = 0;

  const lines: InvoiceLine[] = [];
  for (const item of cart.items) {
    let lineTotal = item.unitPrice * item.qty;
    if (item.discount) {
      lineTotal = lineTotal * (1 - item.discount);
    }
    // mutate the item!
    // biome-ignore lint/suspicious/noExplicitAny: deliberate in bad starter
    (item as any).lineTotal = lineTotal; // side effect on caller's data
    lines.push({ sku: item.sku, qty: item.qty, unitPrice: item.unitPrice, lineTotal });
    subtotal += lineTotal;
  }

  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // also mutate the cart's items array order sometimes
  cart.items.sort((a, b) => a.sku.localeCompare(b.sku));

  console.log('[IMPURE] calculated invoice for', cart.id, 'at', now.toISOString());

  return {
    id: `inv_${Date.now()}`,
    cartId: cart.id,
    lines,
    subtotal,
    tax,
    total,
    createdAt: now,
  };
}
