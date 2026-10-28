import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { STRAINS, type Strain } from "@/data/menu";
import LiquidBlob from "@/components/LiquidBlob";
import { SectionHeading } from "@/components/ui";
import { cn } from "@/utils/cn";

const ICONS: Record<Strain["icon"], ReactNode> = {
  sun: (
    <>
      <path className="ic" pathLength={1} d="M14 40a18 18 0 0 1 36 0" />
      <path className="ic" pathLength={1} d="M8 40h48M15 47h34M23 54h18" />
      <path className="ic" pathLength={1} d="M32 11v6M15.5 18.5l4 4M48.5 18.5l-4 4M7 30h5M52 30h5" />
    </>
  ),
  lemon: (
    <>
      <circle className="ic" pathLength={1} cx="32" cy="32" r="21" />
      <circle className="ic" pathLength={1} cx="32" cy="32" r="15.5" />
      <path className="ic" pathLength={1} d="M32 16.5v31M16.5 32h31M21 21l22 22M43 21L21 43" />
    </>
  ),
  apple: (
    <>
      <path
        className="ic"
        pathLength={1}
        d="M32 22c-5-4-15-4-18 4-4 9 1 22 7 27 3 2 6 2 8 0 2-1 4-1 6 0 2 2 5 2 8 0 4-3 7-9 8-14a7 7 0 0 1-1-13c-3-6-11-7-18-4z"
      />
      <path className="ic" pathLength={1} d="M32 22c0-5 2-9 6-11" />
      <path className="ic" pathLength={1} d="M36 13c4-4 10-4 13-1-4 4-9 4-13 1z" />
    </>
  ),
  diamond: (
    <>
      <path className="ic" pathLength={1} d="M18 14h28l10 14-24 24L8 28z" />
      <path className="ic" pathLength={1} d="M8 28h48M24 14l-4 14 12 24 12-24-4-14" />
    </>
  ),
};

function StrainCard({ s, index }: { s: Strain; index: number }) {
  const [active, setActive] = useState(false);
  return (
    <motion.article
      data-active={active}
      data-cursor
      onClick={() => setActive((a) => !a)}
      className="strain-card relative isolate flex min-h-[25rem] cursor-pointer flex-col overflow-hidden rounded-[2rem] border-2 border-ink bg-cream p-6 md:min-h-[27rem] md:p-7"
      initial={{ opacity: 0, y: 90 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 70, damping: 15, delay: index * 0.1 }}
    >
      {/* liquid that pours in on hover / tap */}
      <div className="liquid-fill" aria-hidden="true">
        <svg className="liquid-fill-wave" viewBox="0 0 400 28" preserveAspectRatio="none">
          <path
            d="M0 14 Q 25 0 50 14 T 100 14 T 150 14 T 200 14 T 250 14 T 300 14 T 350 14 T 400 14 V 28 H 0 Z"
            fill="#0b0b0b"
          />
        </svg>
        <div className="liquid-fill-body" />
      </div>

      {/* difference blend makes the content invert as the ink rises */}
      <div className="relative z-10 flex flex-1 flex-col text-white mix-blend-difference">
        <div className="flex items-start justify-between">
          <span className="font-wide text-xs font-bold tracking-[0.3em]">{s.no}</span>
          <svg
            viewBox="0 0 64 64"
            className="strain-icon size-16"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {ICONS[s.icon]}
          </svg>
        </div>
        <div className="mt-auto pt-10">
          <h3 className="font-wide text-lg font-bold uppercase tracking-[0.2em] md:text-xl">{s.name}</h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed opacity-75">{s.blurb}</p>
          <dl className="mt-6 font-wide text-[0.64rem] font-semibold uppercase tracking-[0.22em]">
            <div className="flex items-center justify-between border-t border-white/25 py-2.5">
              <dt className="opacity-70">Notes</dt>
              <dd>{s.notes}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-white/25 py-2.5">
              <dt className="opacity-70">Mood</dt>
              <dd>{s.mood}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-white/25 py-2.5">
              <dt className="opacity-70">Intensity</dt>
              <dd className="flex gap-1.5" aria-label={`${s.intensity} out of 5`}>
                {Array.from({ length: 5 }, (_, k) => (
                  <span
                    key={k}
                    className={cn("h-2.5 w-2.5 rounded-full border border-white", k < s.intensity && "bg-white")}
                  />
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </motion.article>
  );
}

export default function Lineup() {
  return (
    <section id="lineup" className="relative overflow-hidden bg-cream pb-20 pt-10 md:pb-28 md:pt-14">
      <LiquidBlob
        className="pointer-events-none absolute -right-28 bottom-6 w-64 text-ink md:-right-24 md:bottom-12 md:w-80"
        seed={14}
        variance={0.15}
      />
      <span className="blob-dot absolute left-[52%] top-[7%] hidden h-6 w-6 bg-ink md:block" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <SectionHeading kicker="Greenhouse strains" title="The lineup" align="left" />
          <motion.p
            className="max-w-sm pb-4 text-ink/60 md:pr-32 lg:pr-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Four indoor favourites, slow-cured and hand-trimmed. Hover — or tap — a card to pour.
          </motion.p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STRAINS.map((s, i) => (
            <StrainCard key={s.name} s={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
