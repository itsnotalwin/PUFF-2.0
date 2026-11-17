export type MenuItem = {
  id: string;
  label: string;
  weight: string;
  grams: number;
  price: number;
  promo?: "buy-9-get-1";
};

export type Category = {
  id: "greenhouse" | "outdoor";
  title: string;
  sub: string[];
  isStrainList: boolean;
  items: MenuItem[];
};

export const MENU: Category[] = [
  {
    id: "greenhouse",
    title: "Greenhouse",
    sub: ["Sunset Sherbet", "Lemon Cheesecake"],
    isStrainList: true,
    items: [
      { id: "gh-gram", label: "Per Gram", weight: "1g", grams: 1, price: 30 },
      { id: "gh-60", label: "R60 Pack", weight: "2g", grams: 2, price: 60 },
      { id: "gh-120", label: "R120 Pack", weight: "4g", grams: 4, price: 120 },
      { id: "gh-pre", label: "Pre-Roll", weight: "1g", grams: 1, price: 50, promo: "buy-9-get-1" },
    ],
  },
  {
    id: "outdoor",
    title: "Outdoor",
    sub: ["Sun-grown", "House blend", "Easy on the pocket"],
    isStrainList: false,
    items: [
      { id: "od-50", label: "R50 Pack", weight: "4g", grams: 4, price: 50 },
      { id: "od-100", label: "R100 Pack", weight: "8g", grams: 8, price: 100 },
      { id: "od-bulk", label: "10g+ (Per Gram)", weight: "10g minimum · R120 for 10g", grams: 10, price: 120 },
      { id: "od-pre", label: "Pre-Roll", weight: "1g", grams: 1, price: 20, promo: "buy-9-get-1" },
    ],
  },
];

/** Limited-time flower specials. Kept outside the standard price list and budget mixer. */
export const MENU_SPECIALS: { category: "greenhouse" | "outdoor"; item: MenuItem }[] = [
  { category: "outdoor", item: { id: "special-od-10g", label: "10g Outdoor Special", weight: "10g", grams: 10, price: 100 } },
  { category: "greenhouse", item: { id: "special-gh-10g", label: "10g Greenhouse Special", weight: "10g", grams: 10, price: 200 } },
];

export const PRE_ROLL_OFFER = {
  label: "10 Pre-Rolls",
  detail: "Buy 9, get 1 free",
  note: "Mix & match; the lowest-priced pre-roll is free when types are combined.",
} as const;

/** Every tenth eligible pre-roll is free; if types are mixed, discount the cheapest one(s). */
export function calculatePreRollOffer(
  lines: Array<{ promo?: MenuItem["promo"]; price: number; qty: number }>,
) {
  const unitPrices = lines.flatMap((line) =>
    line.promo === "buy-9-get-1" && Number.isFinite(line.qty) && line.qty > 0
      ? Array.from({ length: Math.floor(line.qty) }, () => line.price)
      : [],
  );
  const freeCount = Math.floor(unitPrices.length / 10);
  const discount = unitPrices
    .sort((a, b) => a - b)
    .slice(0, freeCount)
    .reduce((sum, price) => sum + price, 0);

  return {
    eligibleCount: unitPrices.length,
    freeCount,
    discount: Math.round(discount * 100) / 100,
  };
}

/** Separate legacy 1.67g offerings; not part of the general greenhouse budget mixer. */
export const SPECIAL_PACKS: MenuItem[] = [
  { id: "gh-forbidos-167", label: "Forbidos", weight: "1.67g", grams: 1.67, price: 50 },
  { id: "gh-jungle-167", label: "Jungle Diamonds", weight: "1.67g", grams: 1.67, price: 50 },
];

export type Strain = {
  no: string;
  name: string;
  blurb: string;
  notes: string;
  mood: string;
  intensity: number;
  icon: "sun" | "lemon" | "apple" | "diamond";
};

export const STRAINS: Strain[] = [
  {
    no: "01",
    name: "Sunset Sherbet",
    blurb: "Dessert-sweet and silky smooth — a sundowner in a jar.",
    notes: "Berry · Cream",
    mood: "Mellow",
    intensity: 4,
    icon: "sun",
  },
  {
    no: "02",
    name: "Lemon Cheesecake",
    blurb: "Bright citrus up front with that famous funky finish.",
    notes: "Lemon · Funk",
    mood: "Uplifted",
    intensity: 4,
    icon: "lemon",
  },
  {
    no: "03",
    name: "Forbidos",
    blurb: "The one you were warned about. Heavy, fruity, unforgettable.",
    notes: "Tropical · Spice",
    mood: "Deep chill",
    intensity: 5,
    icon: "apple",
  },
  {
    no: "04",
    name: "Jungle Diamonds",
    blurb: "Frosty, glittering buds with a fresh forest-floor nose.",
    notes: "Pine · Gas",
    mood: "Balanced",
    intensity: 3,
    icon: "diamond",
  },
];

export const FAQ = [
  {
    q: "Greenhouse vs outdoor — what's the difference?",
    a: "Greenhouse flower is grown under controlled conditions, so you get denser buds, louder aroma and more consistency. Outdoor is sun-grown in season — an earthier, mellower smoke at a friendlier price.",
  },
  {
    q: "What's in a pack?",
    a: "Packs are pre-weighed; check the exact weight beside each price. Special 1.67g greenhouse packs are listed separately beneath the main menu.",
  },
  {
    q: "Are the pre-rolls pure flower?",
    a: "Always. One full gram of flower, no shake, no fillers, rolled fresh.",
  },
  {
    q: "Who can buy?",
    a: "Adults 18+ only. Bring a valid ID — no ID, no puff. No exceptions.",
  },
  {
    q: "How do I order?",
    a: "Add what you want to your bag, then use Copy order to copy the details.",
  },
];

/** Maximise flower weight for a budget using the currently supplied product prices.
 * Prices are normalised to cents and the DP step is derived from their GCD,
 * so updating menu.ts or adding non-R10 prices never requires changing the mixer.
 */
export function bestMix(items: MenuItem[], budget: number) {
  const empty = () => ({ grams: 0, spent: 0, lines: [] as { item: MenuItem; qty: number }[] });
  if (!Number.isFinite(budget) || budget <= 0 || items.length === 0) return empty();

  const options = items
    .map((item, index) => ({ item, index, cents: Math.round(item.price * 100) }))
    .filter(({ item, cents }) => cents > 0 && Number.isFinite(cents) && Number.isFinite(item.grams) && item.grams > 0);
  if (options.length === 0) return empty();

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const step = options.reduce((value, option) => gcd(value, option.cents), 0);
  const capacity = Math.floor(Math.round(budget * 100) / step);
  type State = { grams: number; count: number; cents: number; picks: number[] };
  const initial: State = { grams: 0, count: 0, cents: 0, picks: items.map(() => 0) };
  const best: State[] = [initial];

  for (let b = 1; b <= capacity; b++) {
    let current = best[b - 1];
    for (const option of options) {
      const cost = option.cents / step;
      if (cost > b) continue;
      const previous = best[b - cost];
      const grams = previous.grams + option.item.grams;
      const count = previous.count + 1;
      const cents = previous.cents + option.cents;
      const better = grams > current.grams + 0.00001 ||
        (Math.abs(grams - current.grams) <= 0.00001 &&
          (count < current.count || (count === current.count && cents < current.cents)));
      if (!better) continue;
      const picks = [...previous.picks];
      picks[option.index]++;
      current = { grams, count, cents, picks };
    }
    best[b] = current;
  }

  const result = best[capacity];
  const lines = result.picks
    .map((qty, index) => ({ item: items[index], qty }))
    .filter(({ qty }) => qty > 0);
  return { grams: Math.round(result.grams * 100) / 100, spent: result.cents / 100, lines };
}
