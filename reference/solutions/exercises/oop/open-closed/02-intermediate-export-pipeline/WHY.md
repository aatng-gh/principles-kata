# Why this design (OCP intermediate export pipeline)

The `DocumentExporter` is closed: its `exportReport` and internal map logic never change when we add formats. It only knows the `FormatExporter` abstraction and a register method.

Each format is its own `PdfExporter` / `CsvExporter` / `JsonExporter` (open for extension by writing more *Exporter classes).

Watermark behavior was added via `WatermarkingExporter` decorator that wraps any existing exporter — no changes to Pdf/Csv/Json classes or the core switch (there is none).

To add 'html': implement `HtmlExporter implements FormatExporter`, call `exporter.register(new HtmlExporter())` in the composition root or after construction. Zero edits to documentExporter.ts, types.ts (except if extending the union, which can be avoided by using string + runtime check), or the three original exporters. Old outputs remain identical.

This directly satisfies the force: "adding HTML or XML exporter + new "watermark" behavior must be pure extension."
