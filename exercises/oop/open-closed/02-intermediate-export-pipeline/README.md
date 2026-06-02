# Open/Closed Principle — Intermediate: Export Pipeline

## Principle (recap)
Software entities (classes, modules, functions) should be **open for extension, but closed for modification**. You should be able to add new behavior (new export formats, new cross-cutting options like watermarking) by adding new code, without editing existing source files that already work for the current set of formats.

## Scenario
A reporting module must export documents in multiple formats for different consumers (finance wants CSV, executives want polished PDF, APIs want JSON). The initial `DocumentExporter` was written with a switch on format inside the main export method. Now the team needs to add HTML and XML support, plus a new "watermark" option that applies to any format. Every new format or behavior forces edits to the central switch and risks breaking the three existing formats.

## Functional Requirements
- `exportReport(report, format, options?)` takes ReportData (title + rows of key/value records), a format ('pdf' | 'csv' | 'json'), and optional { watermark?: boolean }.
- For 'pdf': produces a stub string containing "[PDF]" + title + row count (+ watermark note if set).
- For 'csv': produces comma-separated header + rows.
- For 'json': produces a JSON string of the report (watermark flag included if set).
- Watermark option, when true, must be reflected in the output for any format (e.g. appended marker or field).
- Invalid format throws or returns a clear error (the set of formats is closed at the core; extension adds new without changing the switch).
- The exporter must remain stable: adding support for a brand new format must not require changing any code that implements the existing three formats.

## Starter (what you are given)
See `src/documentExporter.ts` — a single class (`DocumentExporter`) containing a switch (or if/else ladder) on format string with duplicated or case-by-case logic for PDF/CSV/JSON plus watermark handling inside the cases. The test is written against the public export API (exportReport with optional options for watermark).

## Criteria (principle-specific success bar — this is what the judge will score)
- Adding a new format (e.g. 'html' or 'xml') is done by writing a new exporter implementation and registering it (or subclassing) — **zero edits** to the original switch or the three existing format cases.
- Adding a new cross-cutting behavior (e.g. always-on watermark, compression, digital signature) is done via decorator, strategy wrapper, or pipeline step — again without modifying existing format code.
- The core `exportReport` (or its equivalent) is closed: its source never changes when the set of supported formats grows.
- Existing formats continue to produce identical output for the same inputs (the test will assert this after "extension" scenarios in spirit; your design must make it true by construction).
- No "if (format === 'new') ..." added to the old code paths.

## Expectations (code quality + demonstration)
- Use an abstraction for exporters: e.g. `interface DocumentFormatExporter { readonly format: string; export(report: ReportData, options?: ExportOptions): string; }`
- A registry, map, or injected set of exporters (populated at composition time) rather than a giant switch.
- For the watermark feature: a decorator (e.g. `WatermarkingExporter`) or option passed cleanly to the strategy, not duplicated inside every case.
- Clear naming: `PdfExporter`, `CsvExporter`, `JsonExporter`, `DocumentExporter` (the closed orchestrator).
- Types precise; the set of core formats can be a closed union or string literal, but extension happens outside it.
- The provided test passes with byte-for-byte (or semantically) identical output for pdf/csv/json (with and without watermark).
- Bonus: your solution can literally demonstrate adding one more format (in a comment or extra file) with no change to the core exporter or the three original exporters.

## Getting Started
```bash
# from repo root
npx vitest run exercises/oop/open-closed/02-intermediate-export-pipeline
```

## How the judge will evaluate
See the rubric for this exercise in `AGENTS.md` (section "OOP / Open/Closed / 02-intermediate-export-pipeline").
Tests check that the three formats + watermark option behave correctly. The judge will look for whether you achieved "add without modify" (new files + registration only) or just moved the switch into a map while still editing the central file for every addition. It will be adversarial on "we'll add more formats later" comments that still leave the core closed only in name.

## After you are done
1. Make tests green.
2. Run the 4-point self-calibration checklist from the root README.
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial").
4. Only after receiving the review, reveal `reference/solutions/exercises/oop/open-closed/02-intermediate-export-pipeline/` and compare designs.
