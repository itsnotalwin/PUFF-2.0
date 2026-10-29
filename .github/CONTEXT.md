# GitHub automation context

Purpose: Store the site's CI and publication automation. The GitHub Pages branch is deployed from compiled root `index.html`.

Key files: `workflows/deploy-pages.yml` runs checks/build/sync; `workflows/export-puff-assets.yml` exports official brand sizes.

Connections: Vite uses `index.source.html`; build produces `dist/index.html` and the workflow copies it to root for branch-based Pages.

Change and verify: Keep a single Pages publishing route. Confirm Actions success and Pages deployment; never push raw TypeScript template as the homepage.
