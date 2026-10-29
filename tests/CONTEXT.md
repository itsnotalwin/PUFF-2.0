# Mixer regression tests

Purpose: Guard catalogue weights and the data-driven budget mixer against stale pricing, wrong quantities or over-budget recommendations.

Key files: `menu-mixer.test.mjs` runs with Node 22 type stripping and imports the actual source `src/data/menu.ts`.

Connections: The `npm test` script runs before the production Vite build in `.github/workflows/deploy-pages.yml`.

Change and verify: Update test expectations when authorised menu prices change; ensure the line subtotals, total grams and unused budgets remain correct across both categories and newly introduced prices.
