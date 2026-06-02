export interface LineItem {
  readonly sku: string;
  readonly qty: number;
  readonly unitPrice: number;
}

export interface Invoice {
  readonly id: string;
  readonly orderId: string;
  readonly lines: readonly LineItem[];
  readonly subtotal: number;
  readonly tax: number;
  readonly total: number;
  readonly createdAt: Date;
}

export interface InvoiceCalculator {
  compute(items: readonly LineItem[]): { subtotal: number; tax: number; total: number };
}

export interface InvoiceRepository {
  save(invoice: Invoice): Promise<void>;
  findById(id: string): Promise<Invoice | undefined>;
}

export interface PdfRenderer {
  render(invoice: Invoice): Promise<void>; // stub in exercise; real would return bytes or path
}

export interface InvoiceNotifier {
  notifyInvoiceReady(invoice: Invoice): Promise<void>;
}
