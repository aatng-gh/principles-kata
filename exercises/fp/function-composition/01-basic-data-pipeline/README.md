# Function Composition — Basic: Data Pipeline

## Principle (recap)
Complex transformations are built by composing small, single-purpose, pure functions. Each stage does one thing well; the overall flow is a clear pipeline of named stages. New stages are inserted without editing prior stages.

## Scenario
A data import job has a single 40-line `processCSV` that parses, lowercases names, uppercases categories, filters bad amounts, enriches VIP->PREMIUM, and returns records. Adding a new cleaning rule (trim ids) or a new enrichment (add tax) requires editing the monster function and re-testing every step.

## Functional Requirements
- `processCSV(csvText)` returns array of cleaned/enriched/validated records (id, name lower, amount num, category upper or enriched).
- Bad rows (non-numeric amount, negative, malformed) are dropped.
- VIP category becomes PREMIUM.

## Starter (what you are given)
See `src/dataPipeline.ts` — the single large imperative function.

## Criteria (principle-specific)
- The work is decomposed into 4-7 tiny pure named stages (e.g. `parseRows`, `cleanNames`, `enrichCategory`, `validateAmount`, `toRecords`).
- The top level is a composition: either a `pipe` call or a clear `stage5(stage4(stage3(...)))` of the named fns.
- Adding e.g. a trim-id stage or a tax enrichment is literally "write one new 3-line fn + insert it in the pipeline" — no edits to existing stage bodies.

## Expectations
- Each stage: 3-8 lines, takes input shape, returns new output shape, no side effects, no mutation.
- Use array methods (map, filter, reduce) inside the tiny stages.
- Public `processCSV` remains the entry point (can be the composed result).
- Types flow through the stages (RawRow -> Cleaned -> Enriched -> Valid -> Final).
- Deterministic and easy to unit test individual stages.

## Getting Started
```bash
npx vitest run exercises/fp/function-composition/01-basic-data-pipeline
```

## How the judge will evaluate
See AGENTS.md rubric. Tests only check end-to-end output for the given CSV cases. The judge will penalize a 30-line processCSV with comments "// parse here" even if numbers match; it wants small named pure stages composed at the top.

## After you are done
1. Make tests green.
2. Run the 4-point self-calibration checklist from the root README.
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial").
4. Only after receiving the review, reveal `reference/solutions/exercises/fp/function-composition/01-basic-data-pipeline/` and compare designs.
