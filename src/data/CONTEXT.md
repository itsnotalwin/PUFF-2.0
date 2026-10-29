# Menu data context

Purpose: `menu.ts` is the canonical source for menu categories, strain descriptors, special pack formats, FAQ copy and the budget-mixer algorithm.

Key files: `menu.ts`.

Connections: `sections/Menu.tsx` renders `MENU` and `SPECIAL_PACKS`; `sections/Calculator.tsx` calls `bestMix` using prices and weights supplied by `MENU`; `components/BagContext.tsx` reconciles saved bag entries against this catalogue.

Change and verify: Keep IDs unique and prices/weights numeric. The standard greenhouse packs are 2g/R60 and 4g/R120; older 1.67g greenhouse options are in `SPECIAL_PACKS` and not included in the general mixer. Verify no zero/negative-price items reach the calculator and that old saved bags do not retain obsolete products.
