import type { ExportOptions, FormatExporter, ReportData } from './types';

export class CsvExporter implements FormatExporter {
  readonly format = 'csv' as const;

  export(data: ReportData, options: ExportOptions = {}): string {
    const { watermark = false } = options;
    const marker = watermark ? ' [WATERMARKED]' : '';
    if (data.rows.length === 0) {
      return data.title + marker;
    }
    const headers = Object.keys(data.rows[0]).join(',');
    const lines = data.rows.map((r) => Object.values(r).join(',')).join('\n');
    return `${data.title}${marker}\n${headers}\n${lines}`;
  }
}
