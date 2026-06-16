// exercises/oop/open-closed/02-intermediate-export-pipeline/src/documentExporter.ts
// Thin closed core per Open/Closed Principle.
// Registry + delegation only. Format-specific logic and watermark cross-cut live in
// dedicated modules (pdfExporter.ts etc). Core never changes for new formats/behaviors.

import { CsvExporter } from './csvExporter';
import { JsonExporter } from './jsonExporter';
import { PdfExporter } from './pdfExporter';
import type {
  DocumentFormatExporter,
  ExportFormat,
  ExportOptions,
  ReportData,
  ReportRow,
  WatermarkFormatter,
} from './types';
import {
  CsvWatermarkFormatter,
  JsonWatermarkFormatter,
  PdfWatermarkFormatter,
  WatermarkingExporter,
} from './watermarkingExporter';

// Re-exports so existing imports (e.g. tests, consumers) continue to work unchanged.
export type { ExportFormat, ReportData } from './types';
export type { DocumentFormatExporter, ExportOptions, ReportRow } from './types';
export type { WatermarkFormatter } from './types';

// Re-export concretes for registration / extension use.
export { PdfExporter } from './pdfExporter';
export { CsvExporter } from './csvExporter';
export { JsonExporter } from './jsonExporter';
export {
  PdfWatermarkFormatter,
  CsvWatermarkFormatter,
  JsonWatermarkFormatter,
  WatermarkingExporter,
} from './watermarkingExporter';

/**
 * Adding a 4th format e.g. HtmlExporter: create new file implementing DocumentFormatExporter,
 * import and register(new HtmlExporter()) here; zero edits to existing exporters or this core logic.
 */

export function createDefaultFormatExporters(): DocumentFormatExporter[] {
  return [new PdfExporter(), new CsvExporter(), new JsonExporter()];
}

export function createDefaultWatermarkFormatters(): WatermarkFormatter[] {
  return [new PdfWatermarkFormatter(), new CsvWatermarkFormatter(), new JsonWatermarkFormatter()];
}

export class DocumentExporter {
  private readonly exporters = new Map<ExportFormat, DocumentFormatExporter>();
  private readonly watermarkFormatters = new Map<ExportFormat, WatermarkFormatter>();

  constructor(
    exporters: readonly DocumentFormatExporter[] = createDefaultFormatExporters(),
    watermarkFormatters: readonly WatermarkFormatter[] = createDefaultWatermarkFormatters()
  ) {
    for (const exporter of exporters) {
      this.register(exporter);
    }
    for (const watermarkFormatter of watermarkFormatters) {
      this.registerWatermarkFormatter(watermarkFormatter);
    }
  }

  register(exporter: DocumentFormatExporter): void {
    this.exporters.set(exporter.format, exporter);
  }

  registerWatermarkFormatter(watermarkFormatter: WatermarkFormatter): void {
    this.watermarkFormatters.set(watermarkFormatter.format, watermarkFormatter);
  }

  exportReport(data: ReportData, format: ExportFormat, options: ExportOptions = {}): string {
    const exporter = this.exporters.get(format);
    if (!exporter) {
      throw new Error(`Unsupported format: ${format}`);
    }

    const watermarkFormatter = this.watermarkFormatters.get(format);
    const selected =
      options.watermark && watermarkFormatter
        ? new WatermarkingExporter(exporter, watermarkFormatter)
        : exporter;
    return selected.export(data);
  }
}
