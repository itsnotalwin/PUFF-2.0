# Build and asset-generation scripts

**Purpose:** Reproduce PUFF’s original logo master files and platform-sized social images while preserving the final site’s UI.

**Files:** `extract-puff-art.mjs` reads the current site vector geometry from `src/lib/bud.ts` and `src/components/puffPaths.ts`. `export-puff-assets.py` writes the four SVG/PNG variants, 40 circle-safe social PNGs, and three ZIP kits under `assets/brand/`.

**Connections:** GitHub Actions `.github/workflows/export-puff-assets.yml` runs both exporters, checks results, and commits generated assets. The main Vite build is separate and should remain unaffected.

**Verify:** `npm ci`, `node scripts/extract-puff-art.mjs`, `python scripts/export-puff-assets.py` (install pillow, cairosvg, numpy, lxml first); verify expected counts, previews, and generated file dimensions.
