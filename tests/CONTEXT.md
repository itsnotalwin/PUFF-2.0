# Mixer regression tests

Purpose: Guard catalogue weights and the data-driven budget mixer against stale pricing, wrong quantities or over-budget recommendations.

Key files: `menu-mixer.test.mjs` runs with Node 22 type stripping and imports the actual source `src/data/menu.ts`.

Connections: The `npm test` script runs before the production Vite build in `.github/workflows/deploy-pages.yml`.

Change and verify: Update test expectations when authorised menu prices change; ensure the line subtotals, total grams and unused budgets remain correct across both categories and newly introduced prices.


## Promotion regression coverage (18 November 2026)

Tests now verify the 10g Outdoor R100 and Greenhouse R200 specials, absence of the old R250 offer, the 9/10/20 pre-roll thresholds, cheapest-free handling for mixed types, and unique IDs across standard, legacy and limited-special catalogue entries. Continue running `npm test` before the production build.
