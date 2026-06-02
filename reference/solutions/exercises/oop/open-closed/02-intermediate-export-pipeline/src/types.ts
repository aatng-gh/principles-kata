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

export type ExportFormat = 'pdf' | 'csv' | 'json';

export interface FormatExporter {
  readonly format: ExportFormat;
  export(data: ReportData, options?: ExportOptions): string;
}
