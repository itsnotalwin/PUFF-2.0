# Workflow context

Purpose: Build and publish the compiled homepage and regenerate brand exports.

Key files: `deploy-pages.yml` tests data-driven budget mixer logic, builds Vite and syncs compiled `index.html` to root; `export-puff-assets.yml` exports PNG and SVG variants.

Connections: Uses npm dependencies and `index.source.html`; branch Pages publishes the compiled root.

Change and verify: Run `npm test && npm run build`. Preserve the single-branch Pages publishing flow without a competing custom deploy.
