# PUFF 2.0 | final production site

- **Owner-approved role (2026-10-28):** This repository, `itsnotalwin/PUFF-2.0`, is the final PUFF website. Treat any earlier Puff site experiments as superseded for production use, without deleting or rewriting them.
- **Production URL:** https://itsnotalwin.github.io/PUFF-2.0/
- **Stack:** React 19, TypeScript, Vite 7, Tailwind CSS, Framer Motion.
- **Important design invariants:** monochrome ink and cream, original line-art bud, script PUFF wordmark, organic liquid animation and drip edges. Preserve the completed design unless the owner requests changes.
- **Current feature decision:** no hours/“Come say hi” panel, no WhatsApp buttons, bag uses the single Copy order primary CTA.
- **Brand assets:** `assets/brand/master/` contains four full/wordmark SVG + PNG master variants; `assets/brand/social/` contains 40 social exports; `assets/brand/archives/` contains three ZIP kits. Source-backed generation lives in `scripts/`.
- **Build:** `npm ci && npm run build`. **Deploy:** `.github/workflows/deploy-pages.yml` publishes a compiled singlefile `dist/index.html` and synchronizes root `index.html` for the legacy branch Pages source, which cannot run raw `/src/main.tsx`. Keep `index.source.html` as the Vite input template. Both Pages paths previously succeeded with compiled root on 2026-10-28. Browser acceptance must be checked after meaningful UI changes.
- **Status nuance:** “Final site” is an explicit owner designation, not a claim that every device or browser has passed visual QA.
- **Next:** preserve design; verify live browser and future deployments, and retain genuine visual captures when UI is changed.
