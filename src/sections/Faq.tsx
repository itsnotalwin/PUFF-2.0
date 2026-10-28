import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FAQ } from "@/data/menu";
import Bud from "@/components/Bud";
import { CircularBadge, PlusIcon, SectionHeading } from "@/components/ui";
import { cn } from "@/utils/cn";

function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(i === 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay: i * 0.07, duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }}
      className={cn(
        "overflow-hidden rounded-[1.8rem] border-2 border-ink transition-colors duration-500",
        open ? "bg-ink text-cream" : "bg-transparent text-ink hover:bg-ink/[0.04]",
      )}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left md:px-7"
      >
        <span className="font-wide text-[0.8rem] font-bold uppercase leading-relaxed tracking-[0.16em] md:text-[0.9rem]">
          {q}
        </span>
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full transition-all duration-500",
            open ? "rotate-[135deg] bg-cream text-ink" : "bg-ink text-cream",
          )}
        >
          <PlusIcon className="size-5" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.7, 0, 0.2, 1] }}
          >
            <p className="px-5 pb-6 text-[0.98rem] leading-relaxed text-cream/75 md:px-7">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="relative overflow-hidden bg-cream pb-6 pt-6 md:pb-8 md:pt-10">
      <span className="blob-dot absolute left-[4%] top-[40%] hidden h-5 w-5 bg-ink md:block" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 md:px-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
        <div>
          <SectionHeading kicker="Good to know" title="Questions?" align="left" />
          <div className="mt-8 space-y-3">
            {FAQ.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} i={i} />
            ))}
          </div>
        </div>

        <aside className="flex items-center justify-center">
          <div className="flex justify-center">
            <CircularBadge text="GREENHOUSE • OUTDOOR • PRE-ROLLS • " className="w-40 text-ink">
              <Bud still className="h-16 w-auto text-ink" />
            </CircularBadge>
          </div>
        </aside>
      </div>
    </section>
  );
}
