# Function Composition — Advanced (Stretch): ETL Pipeline

## Principle (recap)
An end-to-end extract-transform-load is a long pipeline of tiny pure stages. Error handling is railway (or Either/Result) so one bad record doesn't poison the batch; new transform rule = one new stage in the compose.

## Scenario (stretch)
Ingest customer events from CSV/JSON lines, clean (dedup, normalize), enrich (with loyalty from "db" snapshot), validate (business rules), aggregate (daily stats), load to "warehouse" (log or array). Failures at any stage must short-circuit per record without mutable global error lists.

## Functional Requirements
- Stages: extract, parse, clean, enrich, validate, aggregate, load.
- Handle mixed good/bad records with explicit error track.
- Produce aggregates + error report.

## Criteria (principle-specific success bar — this is what the judge will score)
- Each stage is a named pure fn (or Result-returning).
- Top level is `pipe( extract, parse, ... )` or equivalent Result-aware composition.
- A new validation or enrichment ("add geo from ip") is added by writing the fn and inserting it once.
- Side effects (the actual "db" read for enrich, the final load) are pushed to the shell; stages receive snapshots.

## Expectations
- Use the shared Result for error-carrying pipeline.
- Stages small (5-10 LOC).
- Test individual stages + the full pipe on sample data.
- Deterministic given the enrich snapshot.

## Getting Started (stretch)
Design and implement per the Criteria. No provided starter or test for this stretch exercise (you may write your own tests in vitest to verify your contracts and implementation).

```bash
# Design and implement per the Criteria. You may write your own tests in vitest.
npx vitest run exercises/fp/function-composition/03-advanced-etl-pipeline --passWithNoTests
```

## How the judge will evaluate
See the (lighter) rubric for this exercise in `AGENTS.md` (general bar + "FP / Function Composition / 03-advanced-etl-pipeline" or the stretch note). The stretch has no provided test; you will design your own contracts + verification. The judge will check whether the full ETL is a pipeline of pure named stages composed once, with effects only at the very edges (extract/load), and new stage = one addition. Criteria in this README are authoritative for the stretch.

## After you are done
1. Design/implement (and any self-written tests) per the Criteria; run `npx vitest run exercises/fp/function-composition/03-advanced-etl-pipeline --passWithNoTests` until green.
2. Run the 4-point self-calibration checklist from the root README (adapt for no provided test / stretch scope).
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial"; note the lighter rubric for stretches).
4. Only after receiving the review, reveal `reference/solutions/exercises/fp/function-composition/03-advanced-etl-pipeline/` (if present; many 03s have none) and compare designs.
