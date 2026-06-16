export interface ReportRow {
  readonly [key: string]: string | number;
}

export interface ReportData {
  readonly title: string;
  readonly rows: readonly ReportRow[];
}

export interface ExportOptions {
  readonly watermark?: boolean;
}

export type ExportFormat = string;

export interface DocumentFormatExporter {
  readonly format: ExportFormat;
  export(data: ReportData): string;
}

export interface WatermarkFormatter {
  readonly format: ExportFormat;
  addWatermark(output: string): string;
}
