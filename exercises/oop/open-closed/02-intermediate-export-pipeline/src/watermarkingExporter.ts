import type {
  DocumentFormatExporter,
  ExportFormat,
  ReportData,
  ReportRow,
  WatermarkFormatter,
} from './types';

export class PdfWatermarkFormatter implements WatermarkFormatter {
  readonly format = 'pdf';

  addWatermark(output: string): string {
    return `${output} [WATERMARKED]\n-- CONFIDENTIAL --`;
  }
}

export class CsvWatermarkFormatter implements WatermarkFormatter {
  readonly format = 'csv';

  addWatermark(output: string): string {
    const [title, ...rest] = output.split('\n');
    return [`${title ?? ''} [WATERMARKED]`, ...rest].join('\n');
  }
}

export class JsonWatermarkFormatter implements WatermarkFormatter {
  readonly format = 'json';

  addWatermark(output: string): string {
    const payload = JSON.parse(output) as { title: string; rows: readonly ReportRow[] };
    return JSON.stringify({ ...payload, watermark: true });
  }
}

export class WatermarkingExporter implements DocumentFormatExporter {
  readonly format: ExportFormat;

  constructor(
    private readonly inner: DocumentFormatExporter,
    private readonly watermarkFormatter: WatermarkFormatter
  ) {
    this.format = inner.format;
  }

  export(data: ReportData): string {
    return this.watermarkFormatter.addWatermark(this.inner.export(data));
  }
}
