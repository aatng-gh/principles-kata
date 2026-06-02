import type { ExportOptions, FormatExporter, ReportData } from './types';

/**
 * Decorator that adds watermark behavior to any FormatExporter.
 * This is how new cross-cutting behavior (watermark) is added via extension.
 * The wrapped exporter does not know about watermarking.
 */
export class WatermarkingExporter implements FormatExporter {
  readonly format: 'pdf' | 'csv' | 'json';

  constructor(private readonly inner: FormatExporter) {
    this.format = inner.format;
  }

  export(data: ReportData, options: ExportOptions = {}): string {
    // Force watermark on for demo; real version could merge flags.
    return this.inner.export(data, { ...options, watermark: true });
  }
}
