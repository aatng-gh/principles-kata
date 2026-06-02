# Open/Closed Principle — Advanced (Stretch): Plugin System

## Principle (recap)
Open for extension, closed for modification. A plugin host accepts new behaviors via registration or discovery without editing its core.

## Scenario (stretch)
A document processing host supports "plugins" for validation, transformation, and export. Current code has if/switch for known plugins. New requirements: user-provided plugins for watermark, OCR, custom export, and a "before/after" hook system.

## Functional Requirements
- Host can register plugins by interface.
- Run pipeline: load -> validate plugins -> transform plugins -> export plugins.
- Adding a plugin never requires changing host source.

## Criteria (principle-specific success bar — this is what the judge will score)
- Plugin is a small interface (or union of roles).
- Host iterates registered plugins; core never mentions concrete plugin types.
- New plugin = new class + one register line (or auto-discovery).
- Existing plugins and host code untouched for new capabilities.

## Expectations
- Use registry or dependency injection of plugin list.
- Decorator or middleware style for hooks if needed.
- Demonstrate adding two new plugins in separate modules with zero host edits.

## Getting Started (stretch)
Design and implement per the Criteria. No provided starter or test for this stretch exercise (you may write your own tests in vitest to verify your contracts and implementation).

```bash
# Design and implement per the Criteria. You may write your own tests in vitest.
npx vitest run exercises/oop/open-closed/03-advanced-plugin-system --passWithNoTests
```

## How the judge will evaluate
See the (lighter) rubric for this exercise in `AGENTS.md` (general bar + "OOP / Open/Closed / 03-advanced-plugin-system" or the stretch note). The stretch has no provided test; you will design your own contracts + verification. The judge will check whether the plugin host is closed for modification (no if/switch on concrete types) while open for extension via registration of new plugins, with zero edits to existing code for new capabilities. Criteria in this README are authoritative for the stretch.

## After you are done
1. Design/implement (and any self-written tests) per the Criteria; run `npx vitest run exercises/oop/open-closed/03-advanced-plugin-system --passWithNoTests` until green.
2. Run the 4-point self-calibration checklist from the root README (adapt for no provided test / stretch scope).
3. Paste your work + reasoning into a review request using the exact prompt in the root README ("use the rubrics in AGENTS.md — be adversarial"; note the lighter rubric for stretches).
4. Only after receiving the review, reveal `reference/solutions/exercises/oop/open-closed/03-advanced-plugin-system/` (if present; many 03s have none) and compare designs.
