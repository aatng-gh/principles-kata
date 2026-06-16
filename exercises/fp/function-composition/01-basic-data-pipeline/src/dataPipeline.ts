// exercises/fp/function-composition/01-basic-data-pipeline/src/dataPipeline.ts
export interface RawRow {
  readonly id: string;
  readonly name: string;
  readonly amount: string;
  readonly category: string;
}

export interface ProcessedRecord {
  readonly id: string;
  readonly name: string;
  readonly amount: number;
  readonly category: string;
}

interface CleanRow {
  readonly id: string;
  readonly name: string;
  readonly amount: string;
  readonly category: string;
}

interface ParsedRecord {
  readonly id: string;
  readonly name: string;
  readonly amount: number;
  readonly category: string;
}

const roundCurrency = (amount: number): number => Math.round(amount * 100) / 100;

const parseRows = (csv: string): RawRow[] =>
  csv
    .trim()
    .split('\n')
    .slice(1)
    .map((line) => line.split(','))
    .filter((parts) => parts.length >= 4)
    .map(([id = '', name = '', amount = '', category = '']) => ({ id, name, amount, category }));

const cleanRows = (rows: readonly RawRow[]): CleanRow[] =>
  rows.map((row) => ({
    id: row.id.trim(),
    name: row.name.trim().toLowerCase(),
    amount: row.amount.trim(),
    category: row.category.trim().toUpperCase(),
  }));

const parseAmounts = (rows: readonly CleanRow[]): ParsedRecord[] =>
  rows.map((row) => ({ ...row, amount: Number.parseFloat(row.amount) }));

const keepValidAmounts = (rows: readonly ParsedRecord[]): ParsedRecord[] =>
  rows.filter((row) => Number.isFinite(row.amount) && row.amount >= 0);

const enrichCategory = (row: ParsedRecord): ProcessedRecord => ({
  ...row,
  amount: roundCurrency(row.amount),
  category: row.category === 'VIP' ? 'PREMIUM' : row.category,
});

export const processCSV = (csv: string): ProcessedRecord[] =>
  keepValidAmounts(parseAmounts(cleanRows(parseRows(csv)))).map(enrichCategory);
