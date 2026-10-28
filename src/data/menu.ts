export type MenuItem = {
  id: string;
  label: string;
  weight: string;
  grams: number;
  price: number;
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
    sub: ["Sunset Sherbet", "Lemon Cheese", "Forbidos", "Jungle Diamonds"],
    isStrainList: true,
    items: [
      { id: "gh-gram", label: "Per Gram", weight: "1g", grams: 1, price: 30 },
      { id: "gh-50", label: "R50 Pack", weight: "1.67g", grams: 1.67, price: 50 },
      { id: "gh-100", label: "R100 Pack", weight: "3.33g", grams: 3.33, price: 100 },
      { id: "gh-pre", label: "Pre-Roll", weight: "1g", grams: 1, price: 50 },
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
      { id: "od-pre", label: "Pre-Roll", weight: "1g", grams: 1, price: 20 },
    ],
  },
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
    name: "Lemon Cheese",
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
    a: "Packs are pre-weighed so we can serve you fast. Grab an R50 or R100 pack in either grade — the exact weight is listed on the menu next to each price.",
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
    a: "Add what you want to your bag, then send the order to us on WhatsApp straight from the bag. We'll confirm availability and sort out the rest.",
  },
];

export const HOURS = [
  { day: "Mon – Thu", time: "10:00 – 20:00", days: [1, 2, 3, 4], open: 10, close: 20 },
  { day: "Fri – Sat", time: "10:00 – 22:00", days: [5, 6], open: 10, close: 22 },
  { day: "Sunday", time: "11:00 – 18:00", days: [0], open: 11, close: 18 },
];

/** Put your WhatsApp number here in international format, e.g. "27821234567".
 *  Left empty, the order button opens WhatsApp's share sheet instead. */
export const WHATSAPP_NUMBER = "";

export function waLink(text: string) {
  const base = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
}

/** Best-value mix for a budget (unbounded knapsack in R10 steps). */
export function bestMix(items: MenuItem[], budget: number) {
  const unit = 10;
  const B = Math.floor(budget / unit);
  type S = { grams: number; count: number; picks: number[] };
  const best: S[] = [{ grams: 0, count: 0, picks: items.map(() => 0) }];
  for (let b = 1; b <= B; b++) {
    let cur = best[b - 1];
    items.forEach((it, idx) => {
      const c = Math.round(it.price / unit);
      if (c > b) return;
      const prev = best[b - c];
      const g = prev.grams + it.grams;
      const cnt = prev.count + 1;
      if (g > cur.grams + 0.02 || (Math.abs(g - cur.grams) <= 0.02 && cnt < cur.count)) {
        const picks = [...prev.picks];
        picks[idx]++;
        cur = { grams: g, count: cnt, picks };
      }
    });
    best[b] = cur;
  }
  const r = best[B];
  const lines = r.picks.map((qty, i) => ({ item: items[i], qty })).filter((l) => l.qty > 0);
  const spent = lines.reduce((s, l) => s + l.qty * l.item.price, 0);
  return { grams: Math.round(r.grams * 100) / 100, spent, lines };
}
