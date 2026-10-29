# Page sections context

Purpose: Each section builds one part of the PUFF homepage, including the two-column main menu and the budget mixer.

Key files: `Menu.tsx` renders primary and original-size product cards; `Calculator.tsx` visualises the best-value mix for a selected budget; `Faq.tsx` reads shared FAQ data.

Connections: Menu content and mixer prices come from `data/menu.ts`; add-to-bag actions use `components/BagContext.tsx`. Motion and layout use the existing design utilities.

Change and verify: After menu edits, check top strain names, bottom legacy formats, accurate prices, slider presets and both jar totals. Run the production build and capture actual mobile/desktop screenshots. Screenshot evidence is currently pending.

Mixer check: jar totals, product quantities, displayed weights, per-line subtotals, spend and remaining budget must all derive from `bestMix`. Both jars render from `MENU`, and slider step adapts to catalogue prices; rerun `npm test` after pricing edits.
