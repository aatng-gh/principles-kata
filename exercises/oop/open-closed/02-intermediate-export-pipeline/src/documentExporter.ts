// exercises/oop/open-closed/02-intermediate-export-pipeline/src/documentExporter.ts
// STARTER — switch on format (plus duplicated watermark logic inside cases), closed to new formats only in name.
// This is the "bad" starting point demonstrating the OCP violation.

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

export class DocumentExporter {
  exportReport(data: ReportData, format: ExportFormat, options: ExportOptions = {}): string {
    const { watermark = false } = options;
    const marker = watermark ? ' [WATERMARKED]' : '';
    switch (format) {
      case 'pdf': {
        let out = `[PDF] ${data.title} (${data.rows.length} rows)${marker}`;
        if (watermark) out += '\n-- CONFIDENTIAL --';
        return out;
      }
      case 'csv': {
        if (data.rows.length === 0) {
          return data.title + marker;
        }
        // biome-ignore lint/style/noNonNullAssertion: starter code; length guard + real impls (see ref) use better patterns or separate empty handling
        const first = data.rows[0]!;
        const headers = Object.keys(first).join(',');
        const lines = data.rows.map((r) => Object.values(r).join(',')).join('\n');
        return `${data.title}${marker}\n${headers}\n${lines}`;
      }
      case 'json': {
        const payload: Record<string, unknown> = {
          title: data.title,
          rows: data.rows,
        };
        if (watermark) payload.watermark = true;
        return JSON.stringify(payload);
      }
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
}
