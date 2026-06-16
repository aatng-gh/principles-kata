import type { DocumentFormatExporter, ReportData } from './types';

export class CsvExporter implements DocumentFormatExporter {
  readonly format = 'csv';

  export(data: ReportData): string {
    if (data.rows.length === 0) {
      return data.title;
    }
    const [first] = data.rows;
    if (!first) return data.title;
    const headers = Object.keys(first).join(',');
    const lines = data.rows.map((row) => Object.values(row).join(',')).join('\n');
    return `${data.title}\n${headers}\n${lines}`;
  }
}
