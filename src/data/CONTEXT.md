# Menu data context

Purpose: `menu.ts` is the canonical source for menu categories, strain descriptors, special pack formats, FAQ copy and the budget-mixer algorithm.

Key files: `menu.ts`.

Connections: `sections/Menu.tsx` renders `MENU` and `SPECIAL_PACKS`; `sections/Calculator.tsx` calls `bestMix` using prices and weights supplied by `MENU`; `components/BagContext.tsx` reconciles saved bag entries against this catalogue.

Change and verify: Keep IDs unique and prices/weights numeric. The standard greenhouse packs are 2g/R60 and 4g/R120; older 1.67g greenhouse options are in `SPECIAL_PACKS` and not included in the general mixer. Verify no zero/negative-price items reach the calculator and that old saved bags do not retain obsolete products.


## Current offers (18 November 2026)

`MENU_SPECIALS` contains the two limited 10g flower offers: Outdoor R100 and Greenhouse R200. The buy-9-get-1 pre-roll offer is represented by `PRE_ROLL_OFFER`; eligible pre-roll menu items carry `promo: "buy-9-get-1"`. `calculatePreRollOffer` grants one free pre-roll per ten eligible units and discounts the cheapest unit(s) when types are mixed. Keep this calculation shared with the bag so the menu, displayed total and copied order agree.
