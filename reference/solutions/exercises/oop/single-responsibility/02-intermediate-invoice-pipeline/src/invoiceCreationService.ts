import type {
  Invoice,
  InvoiceCalculator,
  InvoiceNotifier,
  InvoiceRepository,
  LineItem,
  PdfRenderer,
} from './types';

export class InvoiceCreationService {
  constructor(
    private readonly calculator: InvoiceCalculator,
    private readonly repo: InvoiceRepository,
    private readonly renderer: PdfRenderer,
    private readonly notifier: InvoiceNotifier
  ) {}

  async createInvoice(orderId: string, items: readonly LineItem[]): Promise<Invoice> {
    if (!orderId || items.length === 0) {
      throw new Error('Invalid invoice input');
    }
    for (const item of items) {
      if (item.qty <= 0 || item.unitPrice <= 0) {
        throw new Error('Invalid line item');
      }
    }

    const { subtotal, tax, total } = this.calculator.compute(items);

    const id = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const invoice: Invoice = {
      id,
      orderId,
      lines: items.map((i) => ({ ...i })),
      subtotal,
      tax,
      total,
      createdAt: new Date(),
    };

    await this.repo.save(invoice);
    await this.renderer.render(invoice);
    await this.notifier.notifyInvoiceReady(invoice);

    return invoice;
  }
}
