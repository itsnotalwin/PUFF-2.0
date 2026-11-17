# Menu data context

Purpose: `menu.ts` is the canonical source for menu categories, strain descriptors, limited specials, FAQ copy and the budget-mixer algorithm.

Key files: `menu.ts`.

Connections: `sections/Menu.tsx` renders `MENU` and `MENU_SPECIALS`; `sections/Calculator.tsx` calls `bestMix` using prices and weights supplied by `MENU`; `components/BagContext.tsx` reconciles saved bag entries against this catalogue.

Change and verify: Keep IDs unique and prices/weights numeric. The standard greenhouse packs are 2g/R60 and 4g/R120; the four greenhouse strain names are listed together in `MENU`; the separate legacy 1.67g packs have been retired from the menu and bag catalogue. Verify no zero/negative-price items reach the calculator and that old saved bags do not retain obsolete products.


## Current offers (18 November 2026)

`MENU_SPECIALS` contains the two limited 10g flower offers: Outdoor R100 and Greenhouse R200. The buy-9-get-1 pre-roll offer is represented by `PRE_ROLL_OFFER`; eligible pre-roll menu items carry `promo: "buy-9-get-1"`. `calculatePreRollOffer` grants one free pre-roll per ten eligible units and discounts the cheapest unit(s) when types are mixed. Keep this calculation shared with the bag so the menu, displayed total and copied order agree.


## Greenhouse format retirement (18 November 2026)

The former SPECIAL_PACKS export and its 1.67g Forbidos/Jungle Diamonds product IDs have been removed. Those names remain in the main Greenhouse strain list. Standard greenhouse mixer products remain 1g/R30, 2g/R60 and 4g/R120. Keep the two 10g flower specials outside the general budget mixer; the buy-9-get-1 pre-roll calculation remains shared with the bag.
