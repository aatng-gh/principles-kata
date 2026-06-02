# Single Responsibility Principle — Advanced (Stretch): Reporting Pipeline

## Principle (recap)
Every module has one reason to change. In a larger end-to-end slice, this means the data source adapter, the aggregation rules, the formatting, the delivery channel, and audit each live alone.

## Scenario (stretch)
Build a scheduled reporting pipeline that pulls from multiple sources, aggregates metrics, renders to PDF/CSV/HTML, delivers via email/S3, and audits every run. Four teams will request changes: data (new metric), compliance (new audit fields), design (new template), infra (new delivery target).

## Functional Requirements (for a full impl)
- Pull recent orders/users (simulated).
- Compute aggregates (totals, top categories).
- Render to at least two formats.
- Deliver (log or write files).
- Write audit entry per run.
- Must be easy to evolve one concern without touching others.

## Criteria (principle-specific success bar — this is what the judge will score)
- ReportAggregator, ReportRenderer (strategy per format), DeliveryChannel (interface + impls), AuditLogger, DataSource each have one reason.
- Adding "export to Parquet" touches only a new renderer + registration.
- Swapping "email delivery" for "S3 + webhook" touches only delivery modules.
- No single file owns query + calc + render + send + log.

## Expectations
- Clear composition root that wires the pipeline stages.
- Interfaces for renderers and deliverers (enables OCP too, but SRP first).
- Tests (if you add) can fake one collaborator at a time.
- This stretch demonstrates SRP surviving a realistic multi-stakeholder feature.

## Getting Started (stretch)
Design and implement per the Criteria. No provided starter or test for this stretch exercise (you may write your own tests in vitest to verify your contracts and implementation).

```bash
# Design and implement per the Criteria. You may write your own tests in vitest.
npx vitest run exercises/oop/single-responsibility/03-advanced-reporting-pipeline --passWithNoTests
```

## How the judge will evaluate
See the (lighter) rubric for this exercise in `AGENTS.md` (general bar + "OOP / Single Responsibility / 03-advanced-reporting-pipeline" or the stretch note). The stretch has no provided test; you will design your own contracts + verification. The judge will check whether modules have single reasons to change, whether adding a new renderer or channel touches only the right files + registration, etc. Criteria in this README are authoritative for the stretch.

## After you are done
1. Design/implement (and any self-written tests) per the Criteria; run `npx vitest run exercises/oop/single-responsibility/03-advanced-reporting-pipeline --passWithNoTests` until green.
2. Run the 4-point self-calibration checklist from the root README (adapt for no provided test / stretch scope).
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial"; note the lighter rubric for stretches).
4. Only after receiving the review, reveal `reference/solutions/exercises/oop/single-responsibility/03-advanced-reporting-pipeline/` (if present; many 03s have none) and compare designs.
