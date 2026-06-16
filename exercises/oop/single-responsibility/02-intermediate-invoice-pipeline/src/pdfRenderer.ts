import type { Invoice } from './invoiceService';

export interface PdfRenderer {
  render(invoice: Invoice): Promise<void>;
}

export class ConsolePdfRenderer implements PdfRenderer {
  async render(invoice: Invoice): Promise<void> {
    console.log(
      `[PDF] Rendered invoice ${invoice.id} for ${invoice.customerId} total ${invoice.total}`
    );
  }
}
