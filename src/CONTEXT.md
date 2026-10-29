# Source folder context

Purpose: React application entrypoint, global styling and feature folders for the canonical PUFF 2.0 site.

Key files: `App.tsx` composes page sections, `index.css` contains visual styling, `main.tsx` starts React. Product and price data live in `data/menu.ts`; UI and shared bag logic live under `sections/` and `components/`.

Connections: Vite uses `index.source.html` as its development template and GitHub Actions synchronises compiled `dist/index.html` to the published root HTML.

Change and verify: Preserve monochrome liquid design and responsive layout. Run `npm ci && npm run build`, inspect desktop and mobile renderings, and verify branch Pages deployment. Genuine screenshots remain pending where unavailable.
