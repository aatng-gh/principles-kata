// Reference good implementation — data pipeline expressed as composition of tiny pure stages.
// Why this design: each stage has one clear responsibility and can be understood/tested/reused alone.
// New rule (e.g. add "normalizePhone" or "dedupe") = new 4-line fn + one entry in the pipe list.
// No edits to parse, enrich etc. required. Pure throughout, input never touched. Uses a simple pipe
// so the ordered stages are obvious at the composition site.

export interface RawRow {
  id: string;
  name: string;
  email: string;
  amountStr: string;
}

export interface ProcessedRecord {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly amount: number;
  readonly tax: number;
  readonly total: number;
}

type PipeFn<T> = (x: T) => T;

function pipe<T>(initial: T, ...fns: Array<(x: T) => T>): T {
  return fns.reduce((v, f) => f(v), initial);
}

function splitAndSkipHeader(lines: readonly string[]): string[] {
  return lines.filter((l) => l && !l.startsWith('id,'));
}

function parseRaw(line: string): RawRow | null {
  const parts = line.split(',');
  if (parts.length < 4) return null;
  return {
    id: parts[0].trim(),
    name: parts[1].trim(),
    email: parts[2].trim(),
    amountStr: parts[3].trim(),
  };
}

function parseAll(lines: readonly string[]): RawRow[] {
  return lines.map(parseRaw).filter((r): r is RawRow => r !== null);
}

function normalize(r: RawRow): RawRow {
  return {
    id: r.id,
    name: r.name,
    email: r.email.toLowerCase(),
    amountStr: r.amountStr,
  };
}

function normalizeAll(rows: readonly RawRow[]): RawRow[] {
  return rows.map(normalize);
}

function toProcessed(r: RawRow): ProcessedRecord | null {
  const id = Number.parseInt(r.id, 10);
  const amount = Number.parseFloat(r.amountStr);
  if (!r.email.includes('@') || isNaN(amount) || amount <= 0 || isNaN(id)) {
    return null;
  }
  const tax = Math.round(amount * 0.1 * 100) / 100;
  const total = Math.round((amount + tax) * 100) / 100;
  return { id, name: r.name, email: r.email, amount, tax, total };
}

function enrichAndValidate(rows: readonly RawRow[]): ProcessedRecord[] {
  return rows.map(toProcessed).filter((p): p is ProcessedRecord => p !== null);
}

export function processData(rawLines: readonly string[]): ProcessedRecord[] {
  return pipe(rawLines, splitAndSkipHeader, parseAll, normalizeAll, enrichAndValidate);
}
