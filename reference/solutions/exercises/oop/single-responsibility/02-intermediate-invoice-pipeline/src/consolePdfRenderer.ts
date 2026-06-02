import type { Invoice, PdfRenderer } from './types';

export class ConsolePdfRenderer implements PdfRenderer {
  async render(invoice: Invoice): Promise<void> {
    const pdfSummary = `Invoice ${invoice.id} for ${invoice.orderId}: ${invoice.lines.length} lines, total ${invoice.total}`;
    console.log(`[PDF] rendered ${pdfSummary}`);
  }
}
