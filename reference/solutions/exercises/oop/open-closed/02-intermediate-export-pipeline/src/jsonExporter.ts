import type { ExportOptions, FormatExporter, ReportData } from './types';

export class JsonExporter implements FormatExporter {
  readonly format = 'json' as const;

  export(data: ReportData, options: ExportOptions = {}): string {
    const { watermark = false } = options;
    const payload: Record<string, unknown> = {
      title: data.title,
      rows: data.rows,
    };
    if (watermark) payload.watermark = true;
    return JSON.stringify(payload);
  }
}
