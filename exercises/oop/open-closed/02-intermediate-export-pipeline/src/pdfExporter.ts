import type { DocumentFormatExporter, ReportData } from './types';

export class PdfExporter implements DocumentFormatExporter {
  readonly format = 'pdf';

  export(data: ReportData): string {
    return `[PDF] ${data.title} (${data.rows.length} rows)`;
  }
}
