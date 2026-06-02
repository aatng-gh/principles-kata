// exercises/oop/open-closed/02-intermediate-export-pipeline/tests/exercise.test.ts
import { describe, expect, it } from 'vitest';
import { DocumentExporter, type ExportFormat, type ReportData } from '../src/documentExporter';

describe('DocumentExporter (OCP intermediate)', () => {
  const sample: ReportData = {
    title: 'Q2 Sales',
    rows: [
      { region: 'EMEA', amount: 1200 },
      { region: 'APAC', amount: 950 },
    ],
  };

  let exporter: DocumentExporter;

  beforeEach(() => {
    exporter = new DocumentExporter();
  });

  it('exports pdf format', () => {
    const out = exporter.exportReport(sample, 'pdf');
    expect(out).toContain('[PDF] Q2 Sales (2 rows)');
  });

  it('exports csv format', () => {
    const out = exporter.exportReport(sample, 'csv');
    expect(out).toContain('Q2 Sales');
    expect(out).toContain('region,amount');
  });

  it('exports json format', () => {
    const out = exporter.exportReport(sample, 'json');
    const parsed = JSON.parse(out);
    expect(parsed.title).toBe('Q2 Sales');
    expect(parsed.rows).toHaveLength(2);
  });

  it('throws on unknown format', () => {
    expect(() => exporter.exportReport(sample, 'xml' as ExportFormat)).toThrow(/unsupported/i);
  });

  it('respects watermark option across formats (pdf includes marker + confidential)', () => {
    const out = exporter.exportReport(sample, 'pdf', { watermark: true });
    expect(out).toContain('[WATERMARKED]');
    expect(out).toContain('CONFIDENTIAL');
  });

  it('respects watermark option for csv (marker) and json (flag)', () => {
    const csv = exporter.exportReport(sample, 'csv', { watermark: true });
    expect(csv).toContain('[WATERMARKED]');
    const json = exporter.exportReport(sample, 'json', { watermark: true });
    const parsed = JSON.parse(json);
    expect(parsed.watermark).toBe(true);
  });

  it('defaults to no watermark when options omitted or false', () => {
    const pdfNo = exporter.exportReport(sample, 'pdf');
    expect(pdfNo).not.toContain('WATERMARK');
    const pdfExplicit = exporter.exportReport(sample, 'pdf', { watermark: false });
    expect(pdfExplicit).not.toContain('WATERMARK');
  });
});
