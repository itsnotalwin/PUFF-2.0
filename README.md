# PUFF 2.0

**The designated final PUFF website** (owner decision, 28 October 2026).

**Live site:** https://itsnotalwin.github.io/PUFF-2.0/

This repository owns the final monochrome PUFF website: the ink/cream palette, procedural bud illustration, outlined script PUFF logo, liquid animations, FAQ, and bag with Copy order. Earlier experiments are not the preferred PUFF website.

## Official brand assets

The final site’s artwork and ready-sized social files are stored at [assets/brand](assets/brand/README.md):

- [Four full/wordmark SVG + PNG masters](assets/brand/master)
- [WhatsApp profile photos](assets/brand/social/WhatsApp)
- [All 40 social sizes](assets/brand/social)
- [Downloadable logo, WhatsApp and full social ZIP kits](assets/brand/archives)

## Development and publishing

Uses React, TypeScript, Vite and Tailwind. Run `npm ci`, then `npm run dev` for local development. GitHub Pages must publish a **compiled** Vite site. See [PROJECT.md](PROJECT.md) and the [deployment workflow](.github/workflows/deploy-pages.yml); never replace the published root `index.html` with the raw TypeScript-reference template.

The brand export workflow [export-puff-assets.yml](.github/workflows/export-puff-assets.yml) regenerates static files from the website’s original bud and wordmark vectors. Asset exports must not change site layout or behavior.
