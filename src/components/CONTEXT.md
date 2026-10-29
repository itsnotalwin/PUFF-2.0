# Shared components context

Purpose: Common controls, reusable visuals and bag state for the PUFF site.

Key files: `BagContext.tsx` owns the bag items, persisted data and add animations; `BagDrawer.tsx` displays the bag and Copy order action; other files provide logo, liquid edges and UI primitives.

Connections: The bag reads `data/menu.ts` to normalise saved items against current prices and product IDs; Menu and Calculator send their add actions here.

Change and verify: Never let an outdated saved price or removed menu item survive a catalogue change. Preserve the single Copy order CTA, working keyboard/touch interaction and existing liquid animations. Run production build and actual browser checks.
