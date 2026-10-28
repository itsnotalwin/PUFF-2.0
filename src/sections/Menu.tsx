import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { MENU, type Category, type MenuItem } from "@/data/menu";
import { useBag } from "@/components/BagContext";
import { AnimatedNumber, BagIcon, LiquidButton, PlusIcon, SectionHeading } from "@/components/ui";
import { cn } from "@/utils/cn";

const ease = [0.2, 0.9, 0.2, 1] as const;

function MenuRow({ item, cat, i }: { item: MenuItem; cat: Category; i: number }) {
  const { add } = useBag();
  return (
    <motion.li
      className="menu-row relative flex items-center justify-between gap-4 border-b border-line py-5 last:border-b-0 md:py-6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease }}
    >
      <div className="row-label">
        <p className="font-wide text-[0.78rem] font-semibold uppercase tracking-[0.28em] sm:text-sm">{item.label}</p>
        <p className="mt-1 text-[0.95rem] text-mist">{item.weight}</p>
      </div>
      <div className="relative flex items-center">
        <p className="row-price text-[2rem] font-extrabold leading-none tracking-tight sm:text-[2.35rem]">
          R<AnimatedNumber value={item.price} fromZeroOnView duration={1.4} />
        </p>
        <button
          className="row-add grid size-11 place-items-center rounded-full bg-ink text-cream hover:bg-ink/85"
          aria-label={`Add ${cat.title} ${item.label} to bag`}
          onClick={(e) =>
            add(
              [
                {
                  item: { id: item.id, category: cat.title, label: item.label, weight: item.weight, price: item.price },
                  qty: 1,
                },
              ],
              e.currentTarget.getBoundingClientRect(),
            )
          }
        >
          <PlusIcon className="size-5" />
        </button>
      </div>
    </motion.li>
  );
}

function MenuCard({ cat, index }: { cat: Category; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 16 });
  const sry = useSpring(ry, { stiffness: 140, damping: 16 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      style={{ perspective: 1400 }}
      initial={{ opacity: 0, y: 140, rotate: index ? 5 : -5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: "spring", stiffness: 55, damping: 14, delay: index * 0.15 }}
    >
      <motion.article
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: srx, rotateY: sry }}
        className="relative overflow-hidden rounded-[2.4rem] bg-cream px-6 pb-3 pt-9 text-ink sm:px-9 md:pt-11"
      >
        <h3 className="relative text-center font-wide text-[1.5rem] font-bold uppercase tracking-[0.28em] sm:text-[1.85rem] md:text-[1.95rem]">
          {cat.title.split("").map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 24, rotate: 8 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.15 + i * 0.04, duration: 0.55, ease }}
            >
              {ch}
            </motion.span>
          ))}
        </h3>
        <ul className="relative mt-5 flex min-h-[6.6rem] flex-col items-center gap-1.5">
          {cat.sub.map((s, i) => (
            <motion.li
              key={s}
              className={cn("kicker text-center text-mist transition-colors duration-300", cat.isStrainList && "hover:text-ink")}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55 + index * 0.15 + i * 0.07, duration: 0.5 }}
            >
              {s}
            </motion.li>
          ))}
        </ul>
        <motion.div
          className="mt-3 h-px origin-left bg-line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.5 + index * 0.15, ease: [0.7, 0, 0.2, 1] }}
        />
        <ul className="relative">
          {cat.items.map((it, i) => (
            <MenuRow key={it.id} item={it} cat={cat} i={i} />
          ))}
        </ul>
      </motion.article>
    </motion.div>
  );
}

export default function Menu() {
  const { setOpen, count } = useBag();
  return (
    <section id="menu" className="relative overflow-hidden bg-ink pb-6 pt-10 text-cream md:pt-16">
      <span className="blob-dot absolute left-[6%] top-[12%] h-5 w-5 bg-cream md:h-8 md:w-8" />
      <span
        className="blob-dot absolute right-[8%] top-[7%] hidden h-5 w-5 bg-cream md:block"
        style={{ animationDelay: "-2s, -3s" }}
      />
      <span
        className="blob-dot absolute right-[4%] top-[46%] hidden h-6 w-6 bg-cream md:block"
        style={{ animationDelay: "-4s, -1s" }}
      />
      <span
        className="blob-dot absolute left-[3%] top-[64%] hidden h-4 w-4 bg-cream md:block"
        style={{ animationDelay: "-1s, -5s" }}
      />

      <SectionHeading kicker="The menu · Prices in Rand" title="What's in the jar" tone="cream" className="relative px-5" />

      <div className="relative mx-auto mt-10 grid max-w-5xl items-start gap-6 px-4 md:mt-14 md:grid-cols-2 md:gap-8 md:px-8">
        {MENU.map((cat, i) => (
          <MenuCard key={cat.id} cat={cat} index={i} />
        ))}
      </div>

      <motion.div
        className="relative mt-12 flex flex-col items-center gap-5 px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="kicker text-cream/50">Tap + to add · Pre-rolls are 100% flower · Packs are pre-weighed</p>
        <LiquidButton variant="cream" onClick={() => setOpen(true)}>
          <BagIcon className="size-4" /> View bag · {count}
        </LiquidButton>
      </motion.div>
    </section>
  );
}
