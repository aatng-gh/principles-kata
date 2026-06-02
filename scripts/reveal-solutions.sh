#!/usr/bin/env bash
# Reveal reference solutions (use ONLY after you have completed the self-check + invoked the judge via AGENTS.md rubrics).
set -euo pipefail
echo "Revealing reference/solutions (per AGENTS.md and exercise README policy)..."
git checkout -- reference/solutions || echo "No git or already present. Solutions are now visible under reference/solutions/."
echo "Compare your design to the reference ONLY after review. This protects the learning loop."
ls reference/solutions/exercises/ 2>/dev/null || true
