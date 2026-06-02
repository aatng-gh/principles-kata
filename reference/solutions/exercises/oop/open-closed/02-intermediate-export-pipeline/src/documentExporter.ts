// Reference implementation for OCP: the core is closed for modification.
// New formats = new *Exporter class + one registration line.
// New behavior (watermark) = decorator wrapper (see WatermarkingExporter).

import { CsvExporter } from './csvExporter';
import { JsonExporter } from './jsonExporter';
import { PdfExporter } from './pdfExporter';
import type { ExportFormat, ExportOptions, FormatExporter, ReportData } from './types';

export class DocumentExporter {
  private exporters = new Map<ExportFormat, FormatExporter>();

  constructor() {
    this.register(new PdfExporter());
    this.register(new CsvExporter());
    this.register(new JsonExporter());
  }

  register(exporter: FormatExporter): void {
    this.exporters.set(exporter.format, exporter);
  }

  exportReport(data: ReportData, format: ExportFormat, options: ExportOptions = {}): string {
    const exporter = this.exporters.get(format);
    if (!exporter) {
      throw new Error(`Unsupported format: ${format}`);
    }
    return exporter.export(data, options);
  }
}
