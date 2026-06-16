import type { DocumentFormatExporter, ReportData } from './types';

export class JsonExporter implements DocumentFormatExporter {
  readonly format = 'json';

  export(data: ReportData): string {
    return JSON.stringify({
      title: data.title,
      rows: data.rows,
    });
  }
}
