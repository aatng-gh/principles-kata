import type { ExportOptions, FormatExporter, ReportData } from './types';

export class PdfExporter implements FormatExporter {
  readonly format = 'pdf' as const;

  export(data: ReportData, options: ExportOptions = {}): string {
    const { watermark = false } = options;
    const marker = watermark ? ' [WATERMARKED]' : '';
    let out = `[PDF] ${data.title} (${data.rows.length} rows)${marker}`;
    if (watermark) out += '\n-- CONFIDENTIAL --';
    return out;
  }
}
