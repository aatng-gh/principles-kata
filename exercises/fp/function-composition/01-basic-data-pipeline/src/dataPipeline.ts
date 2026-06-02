// exercises/fp/function-composition/01-basic-data-pipeline/src/dataPipeline.ts
// STARTER — one big imperative function doing parse/clean/enrich/validate/serialize.

export interface RawRow {
  [key: string]: string;
}

export interface ProcessedRecord {
  id: string;
  name: string;
  amount: number;
  category: string;
}

export function processCSV(csv: string): ProcessedRecord[] {
  // big mixed fn
  const lines = csv.trim().split('\n');
  const records: ProcessedRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    // skip header
    const line = lines[i];
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length < 4) continue;
    const id = (parts[0] ?? '').trim();
    const name = (parts[1] ?? '').trim().toLowerCase();
    const amtStr = (parts[2] ?? '').trim();
    let cat = (parts[3] ?? '').trim().toUpperCase();
    const amt = Number.parseFloat(amtStr);
    if (Number.isNaN(amt) || amt < 0) continue; // "validate"  // deliberate bad starter keeps old isNaN style in spirit but biome fixed
    // enrich
    if (cat === 'VIP') cat = 'PREMIUM';
    records.push({ id, name, amount: Math.round(amt * 100) / 100, category: cat });
  }
  return records;
}
