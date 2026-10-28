import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef, type CSSProperties } from "react";
import { LeafIcon } from "@/components/ui";
import { cn } from "@/utils/cn";

const A = ["Sunset Sherbet", "Fresh drop", "Lemon Cheese", "Hand trimmed", "Forbidos", "Slow cured", "Jungle Diamonds", "Pre-rolls"];
const B = ["Greenhouse", "Stay lifted", "Outdoor", "Puff puff pass", "R20 pre-rolls", "Good vibes", "Packs from R50", "Puff"];

function Track({ items, reverse, dur }: { items: string[]; reverse?: boolean; dur: string }) {
  return (
    <div className={cn("marquee-track", reverse && "reverse")} style={{ "--dur": dur } as CSSProperties}>
      {[0, 1].map((k) => (
        <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
          {items.map((it, i) => (
            <span key={i} className="flex items-center">
              <span
                className={
                  i % 2
                    ? "px-5 font-script text-[1.9rem] leading-[1.5] md:px-8 md:text-[3.2rem]"
                    : "px-5 font-wide text-lg font-bold uppercase tracking-[0.22em] md:px-8 md:text-[2.1rem]"
                }
              >
                {it}
              </span>
              <LeafIcon className="size-6 shrink-0 md:size-9" />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Marquee() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const xA = useTransform(scrollYProgress, [0, 1], ["6%", "-16%"]);
  const xB = useTransform(scrollYProgress, [0, 1], ["-16%", "6%"]);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const skew = useSpring(useTransform(velocity, [-2500, 0, 2500], [-7, 0, 7], { clamp: true }), {
    stiffness: 220,
    damping: 30,
  });

  return (
    <section ref={ref} aria-label="Strains & specials" className="relative overflow-hidden bg-cream py-12 md:py-20">
      <motion.div style={{ skewX: skew }}>
        <div className="relative z-10 -rotate-[3deg] scale-[1.08] bg-ink py-3 text-cream md:py-5">
          <motion.div style={{ x: xA }}>
            <Track items={A} dur="46s" />
          </motion.div>
        </div>
        <div className="-mt-2 rotate-[2deg] scale-[1.08] border-y-2 border-ink bg-cream py-2 text-ink md:-mt-4 md:py-4">
          <motion.div style={{ x: xB }}>
            <Track items={B} reverse dur="52s" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
