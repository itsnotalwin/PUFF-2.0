# PUFF 2.0 | final production site

- **Owner-approved role (2026-10-28):** This repository, `itsnotalwin/PUFF-2.0`, is the final PUFF website. Treat any earlier Puff site experiments as superseded for production use, without deleting or rewriting them.
- **Production URL:** https://itsnotalwin.github.io/PUFF-2.0/
- **Stack:** React 19, TypeScript, Vite 7, Tailwind CSS, Framer Motion.
- **Important design invariants:** monochrome ink and cream, original line-art bud, script PUFF wordmark, organic liquid animation and drip edges. Preserve the completed design unless the owner requests changes.
- **Current feature decision:** no hours/“Come say hi” panel, no WhatsApp buttons, bag uses the single Copy order primary CTA.
- **Brand assets:** `assets/brand/master/` contains four full/wordmark SVG + PNG master variants; `assets/brand/social/` contains 40 social exports; `assets/brand/archives/` contains three ZIP kits. Source-backed generation lives in `scripts/`.
- **Build:** `npm ci && npm run build`. **Deploy:** `.github/workflows/deploy-pages.yml` builds `dist/index.html` and synchronizes that compiled single-file result into root `index.html`. The repository's **branch-based GitHub Pages workflow is the only deployer**. The duplicate custom Pages deployment job was removed on 2026-10-28 after a documented overlapping deployment failure. Never publish the uncompiled `/src/main.tsx` template. Keep `index.source.html` as the Vite input template. Browser acceptance must be checked after meaningful UI changes.
- **Status nuance:** “Final site” is an explicit owner designation, not a claim that every device or browser has passed visual QA.
- **Next:** preserve design; verify live browser and future deployments, and retain genuine visual captures when UI is changed.
