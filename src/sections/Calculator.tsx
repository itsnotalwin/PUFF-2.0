import { motion } from "framer-motion";
import { useMemo, useState, type CSSProperties } from "react";
import { MENU, bestMix, type Category } from "@/data/menu";
import { useBag } from "@/components/BagContext";
import { AnimatedNumber, LiquidButton, PlusIcon, SectionHeading } from "@/components/ui";
import { cn } from "@/utils/cn";

const activePrices = MENU.flatMap((category) => category.items.map((item) => item.price))
  .filter((price) => Number.isFinite(price) && price > 0);
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const STEP = activePrices.map((price) => Math.round(price * 100))
  .reduce((current, price) => gcd(current, price), 0) / 100;
const MIN = Math.min(...activePrices);
const MAX = Math.max(500, ...activePrices);
const MAX_GRAMS = Math.max(1, ...MENU.map((category) => bestMix(category.items, MAX).grams));
const PRESETS = [...new Set([
  ...MENU[0].items.filter((item) => item.grams > 1).map((item) => item.price),
  200, 300, MAX,
])].filter((value) => value >= MIN && value <= MAX).sort((a, b) => a - b);
const WAVE = "M0 8 Q20 0 40 8 T80 8 T120 8 T160 8 T200 8 T240 8 T280 8 T320 8 V280 H0 Z";
const fmtGrams = (v: number) => (Math.abs(v - Math.round(v)) < 0.005 ? String(Math.round(v)) : v.toFixed(2));

function Jar({ level, id }: { level: number; id: string }) {
  const top = 50 + (1 - Math.min(1, Math.max(0, level))) * 152;
  return (
    <svg viewBox="0 0 160 220" className="w-full max-w-[210px]" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <path d="M37 36v3c0 7-17 9-17 26v118c0 13 10 23 23 23h74c13 0 23-10 23-23V65c0-17-17-19-17-26v-3z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <motion.g initial={false} animate={{ y: top }} transition={{ type: "spring", stiffness: 45, damping: 11 }}>
          <g className="jar-wave slow" opacity={0.35}>
            <path d={WAVE} fill="#f3f1ec" transform="translate(0 -5)" />
          </g>
          <g className="jar-wave">
            <path d={WAVE} fill="#f3f1ec" />
          </g>
          {[
            { x: 50, d: 0, r: 3.5 },
            { x: 82, d: 1.3, r: 2.5 },
            { x: 108, d: 2.2, r: 4 },
            { x: 66, d: 2.9, r: 2.8 },
          ].map((b, i) => (
            <circle
              key={i}
              className="jar-bubble"
              cx={b.x}
              cy={190}
              r={b.r}
              fill="#0b0b0b"
              style={{ animationDelay: `${b.d}s` }}
            />
          ))}
        </motion.g>
      </g>
      <path
        d="M34 34v4c0 7-18 9-18 27v118c0 15 12 27 27 27h74c15 0 27-12 27-27V65c0-18-18-20-18-27v-4"
        fill="none"
        stroke="#f3f1ec"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="26" y="10" width="108" height="24" rx="7" fill="#0b0b0b" stroke="#f3f1ec" strokeWidth={3} />
      <path
        d="M40 16v12M52 16v12M64 16v12M76 16v12M88 16v12M100 16v12M112 16v12M124 16v12"
        stroke="#f3f1ec"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.45}
      />
      <path d="M30 82v64" stroke="#f3f1ec" strokeWidth={3} strokeLinecap="round" opacity={0.22} />
    </svg>
  );
}

function JarCard({ cat, budget, index }: { cat: Category; budget: number; index: number }) {
  const mix = useMemo(() => bestMix(cat.items, budget), [cat, budget]);
  const { add } = useBag();
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 60, damping: 14, delay: index * 0.12 }}
    >
      <Jar level={mix.grams / MAX_GRAMS} id={`jar-${cat.id}`} />
      <p className="kicker mt-5 text-cream/60">{cat.title}</p>
      <p className="mt-1 text-4xl font-extrabold tracking-tight md:text-5xl">
        <AnimatedNumber value={mix.grams} format={fmtGrams} duration={0.7} />
        <span className="text-2xl md:text-3xl">g</span>
      </p>
      <div className="mt-3 flex min-h-[6rem] w-full max-w-[15rem] flex-col items-center gap-2 text-center">
        {mix.lines.length ? (
          <ul aria-label={`${cat.title} mix breakdown`} className="w-full space-y-1.5">
            {mix.lines.map(({ item, qty }) => (
              <li
                key={item.id}
                className="font-wide text-[0.62rem] font-semibold uppercase leading-relaxed tracking-[0.1em] text-cream/75"
              >
                <span className="block">{qty}× {fmtGrams(item.grams)}g · {item.label}</span>
                <span className="block text-cream/50">R{qty * item.price}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-wide text-[0.62rem] font-semibold uppercase leading-relaxed tracking-[0.1em] text-cream/60">
            Min. R{Math.min(...cat.items.map((item) => item.price))} for {cat.title.toLowerCase()}
          </p>
        )}
        <p className="font-wide text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-cream/65">
          R{mix.spent} used · R{Math.max(0, Math.round((budget - mix.spent) * 100) / 100)} left
        </p>
      </div>
      <LiquidButton
        variant="outline-cream"
        magnetic={false}
        className="mt-3 px-5 py-3.5"
        disabled={!mix.lines.length}
        onClick={(e) =>
          add(
            mix.lines.map((l) => ({
              item: { id: l.item.id, category: cat.title, label: l.item.label, weight: l.item.weight, price: l.item.price },
              qty: l.qty,
            })),
            e.currentTarget.getBoundingClientRect(),
          )
        }
      >
        <PlusIcon className="size-4" /> Add mix
      </LiquidButton>
    </motion.div>
  );
}

export default function Calculator() {
  const [budget, setBudget] = useState(150);
  const gh = useMemo(() => bestMix(MENU[0].items, budget), [budget]);
  const od = useMemo(() => bestMix(MENU[1].items, budget), [budget]);
  const ratio = gh.grams > 0 ? od.grams / gh.grams : 0;
  const pct = ((budget - MIN) / (MAX - MIN)) * 100;

  return (
    <section id="calculator" className="relative overflow-hidden bg-ink pb-16 pt-8 text-cream md:pb-24 md:pt-12">
      <span className="blob-dot absolute left-[5%] top-[30%] h-6 w-6 bg-cream md:h-10 md:w-10" />
      <span className="blob-dot absolute right-[6%] top-[12%] h-3 w-3 bg-cream md:h-5 md:w-5" style={{ animationDelay: "-3s, -2s" }} />
      <div className="relative mx-auto max-w-6xl px-5 md:px-10">
        <SectionHeading kicker="Budget mixer" title="Stretch your rand" tone="cream" />
        <motion.p
          className="mx-auto mt-3 max-w-lg text-center text-cream/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Slide to your budget and we'll pour the best-value mix for each grade.
        </motion.p>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            className="relative overflow-hidden rounded-[2.4rem] bg-cream p-7 text-ink md:p-10"
            initial={{ opacity: 0, y: 60, rotate: -3 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 60, damping: 14 }}
          >
            <p className="kicker text-mist">Your budget</p>
            <p className="mt-2 text-[4.5rem] font-extrabold leading-none tracking-tight md:text-[6rem]">
              R<AnimatedNumber value={budget} duration={0.5} />
            </p>
            <label htmlFor="budget" className="sr-only">
              Budget in rand
            </label>
            <input
              id="budget"
              type="range"
              min={MIN}
              max={MAX}
              step={STEP}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="range mt-8 w-full"
              style={{ "--p": `${pct}%` } as CSSProperties}
            />
            <div className="mt-3 flex justify-between font-wide text-[0.62rem] font-semibold tracking-[0.2em] text-mist">
              <span>R{MIN}</span>
              <span>R{MAX}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {PRESETS.map((v) => (
                <button
                  key={v}
                  onClick={() => setBudget(v)}
                  className={cn(
                    "rounded-full border-2 border-ink px-4 py-2 font-wide text-[0.68rem] font-bold tracking-[0.18em] transition-colors duration-300",
                    budget === v ? "bg-ink text-cream" : "hover:bg-ink hover:text-cream",
                  )}
                >
                  R{v}
                </button>
              ))}
            </div>
            <div className="mt-8 rounded-[1.4rem] bg-ink px-5 py-4 text-cream">
              {ratio > 0 ? (
                <p className="text-[0.95rem] leading-relaxed">
                  Outdoor gets you{" "}
                  <strong className="font-extrabold">
                    <AnimatedNumber value={ratio} format={(v) => v.toFixed(1)} duration={0.5} />×
                  </strong>{" "}
                  more flower — greenhouse gets you the top shelf.
                </p>
              ) : (
                <p className="text-[0.95rem] leading-relaxed">Greenhouse options start at R{Math.min(...MENU[0].items.map((item) => item.price))}. Slide up to compare both grades.</p>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:gap-10">
            {MENU.map((cat, index) => (
              <JarCard key={cat.id} cat={cat} budget={budget} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
