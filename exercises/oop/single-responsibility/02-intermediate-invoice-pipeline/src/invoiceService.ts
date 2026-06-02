// exercises/oop/single-responsibility/02-intermediate-invoice-pipeline/src/invoiceService.ts
// THIS IS THE STARTER — mixes calc, persist, pdf render stub, and notifications on purpose.

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface CreateInvoiceInput {
  customerId: string;
  items: InvoiceItem[];
}

export interface Invoice {
  id: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
}

export class InvoiceService {
  private invoices = new Map<string, Invoice>();

  async createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
    if (!input.customerId || input.items.length === 0) {
      throw new Error('Invalid invoice input');
    }

    // 1. Calc (mixed)
    const subtotal = input.items.reduce((s, it) => s + it.amount, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const id = `inv_${Date.now()}`;
    const invoice: Invoice = {
      id,
      customerId: input.customerId,
      items: input.items.map((i) => ({ ...i })), // copy
      subtotal,
      tax,
      total,
      createdAt: new Date(),
    };
    this.invoices.set(id, invoice);

    // 2. "PDF render" (side effect mixed)
    console.log(`[PDF] Rendered invoice ${id} for ${input.customerId} total ${total}`);

    // 3. Notification (side effect mixed)
    console.log(`[NOTIFY] Invoice ${id} sent to customer ${input.customerId}`);
    console.log(`[NOTIFY] Accounting copy for invoice ${id} total ${total}`);

    return invoice;
  }

  // for test inspection only
  getInvoice(id: string) {
    return this.invoices.get(id);
  }
}
