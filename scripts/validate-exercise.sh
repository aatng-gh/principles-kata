#!/usr/bin/env bash
# validate-exercise.sh — targeted validation helper for a single exercise path.
#
# Usage:
#   bash scripts/validate-exercise.sh <exercise-path>
#   npm run validate:exercise -- exercises/oop/single-responsibility/01-basic-user-profile
#   npm run validate:exercise -- exercises/fp/pure-immutability/01-basic-invoice-calculator
#   npm run validate:exercise -- exercises/typescript/generics/01-core
#
# Runs:
#   - Full project typecheck (always; strict + --skipLibCheck) but NON-FATAL (|| true + status note).
#     Reason: project-wide typecheck will report on TS issues in *other* exercise starters (e.g. 02s)
#     even for FP/TS targeted runs. See note printed at runtime. (The 'noise' from starters is real.)
#   - Biome lint targeted to the path (|| true to tolerate deliberate 'any'/loose in starters).
#     Prints note explaining expected reports.
#   - Vitest run targeted to the path (captures status for summary; non-zero makes script fail).
#
# Improvements: better notes for typecheck/lint (no more silent swallow of real errors), final
# summary status line, updated header/usage, typecheck made non-fatal to support targeted use.
#
# For baseline global lint (shows errors from starters): npm run lint
# See also: package.json "validate:exercise", root quickstart examples.
set -euo pipefail

if [ $# -eq 0 ]; then
  echo "Usage: $0 <exercise-path>"
  echo "Example: $0 exercises/oop/single-responsibility/01-basic-user-profile"
  echo "Example (FP pure-immut fail demo): $0 exercises/fp/pure-immutability/01-basic-invoice-calculator"
  echo "Example (TS): $0 exercises/typescript/generics/01-core"
  echo "Example (stretch/02): $0 exercises/oop/open-closed/02-intermediate-export-pipeline"
  echo "(For npm: use 'npm run validate:exercise -- <path>' to reliably pass the arg.)"
  exit 1
fi

EX_PATH="$1"

echo "=== Validating $EX_PATH ==="

echo "Typecheck (project-wide, strict)..."
echo "Note: typecheck is always the full project (npm run typecheck -- --skipLibCheck); this is intentional for global consistency but means unrelated exercise starters (deliberate loose code in src/ + biome-ignores) can 'pollute' the output if not clean. We run it non-fatally here so targeted validate still reaches lint+test for your exercise. (Currently global tsc is clean; no @ts-nocheck remain in any test files.)"
TYPECHECK_STATUS=0
npm run typecheck -- --skipLibCheck || TYPECHECK_STATUS=$?
if [ "$TYPECHECK_STATUS" -ne 0 ]; then
  echo "Typecheck reported (pollution from other starters' deliberate loose code; your targeted ex may be clean — inspect above for errors mentioning $EX_PATH specifically). Global tsc should be clean; see VERIFICATION.md."
else
  echo "Typecheck clean globally."
fi

echo ""
echo "Lint (biome check on $EX_PATH)..."
echo "Note: running biome check targeted; || true + note below because starters deliberately include 'any' etc (see biome-ignore comments). Real errors will still surface in output. (No @ts-nocheck in tests; TS tests are strict-clean on good paths.)"
LINT_STATUS=0
npx @biomejs/biome check "$EX_PATH" 2>&1 || LINT_STATUS=$?
if [ "$LINT_STATUS" -ne 0 ]; then
  echo "Lint reported (expected for starters with deliberate loose types; see biome-ignores). Status: $LINT_STATUS"
else
  echo "Lint clean for path."
fi

echo ""
echo "Test (from root, targeted to $EX_PATH)..."
TEST_STATUS=0
npx vitest run "$EX_PATH" --passWithNoTests || TEST_STATUS=$?

echo ""
echo "=== Summary for $EX_PATH: Typecheck: $([ "$TYPECHECK_STATUS" -eq 0 ] && echo 'clean globally' || echo "reported (status $TYPECHECK_STATUS; pollution from other starters; check output for mentions of $EX_PATH)"), Lint: $([ "$LINT_STATUS" -eq 0 ] && echo 'clean' || echo "reported (status $LINT_STATUS; expected for starters)"), Test: exit=$TEST_STATUS (0=pass) ==="

if [ "$TEST_STATUS" -ne 0 ]; then
  echo "Tests failed — see vitest output above."
  exit "$TEST_STATUS"
fi

echo "=== Done for $EX_PATH ==="
