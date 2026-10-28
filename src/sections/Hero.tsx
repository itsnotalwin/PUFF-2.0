import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import Bud from "@/components/Bud";
import PuffLogo from "@/components/PuffLogo";
import LiquidBlob from "@/components/LiquidBlob";
import LiquidEdge from "@/components/LiquidEdge";
import { useBag } from "@/components/BagContext";
import { HERO_EDGE, INK } from "@/components/edges";
import { ArrowDown, BagIcon, CircularBadge, LiquidButton } from "@/components/ui";
import { cn } from "@/utils/cn";

const DOTS = [
  { cls: "left-[7%] top-[22%] h-9 w-9 md:left-[17%] md:top-[27%] md:h-14 md:w-14", delay: 0 },
  { cls: "right-[7%] top-[13%] h-10 w-10 md:right-[15%] md:top-[19%] md:h-16 md:w-16", delay: -2 },
  { cls: "left-[5%] top-[50%] h-4 w-4 md:left-[9%] md:top-[56%] md:h-6 md:w-6", delay: -4 },
  { cls: "right-[9%] top-[54%] h-3 w-3 md:right-[25%] md:top-[62%] md:h-5 md:w-5", delay: -1 },
  { cls: "hidden md:block left-[27%] top-[66%] h-3 w-3", delay: -3 },
];

export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { setOpen, count } = useBag();

  // scroll parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const budY = useTransform(scrollYProgress, [0, 1], [0, 190]);
  const budR = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const logoY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const logoS = useTransform(scrollYProgress, [0, 1], [1, 0.84]);
  const blobAy = useTransform(scrollYProgress, [0, 1], [0, -170]);
  const blobBy = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // pointer parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 16 });
  const smy = useSpring(my, { stiffness: 50, damping: 16 });
  const aX = useTransform(smx, (v) => v * -26);
  const aY = useTransform(smy, (v) => v * -18);
  const bX = useTransform(smx, (v) => v * 34);
  const bY = useTransform(smy, (v) => v * 22);
  const budX = useTransform(smx, (v) => v * 12);
  const budTilt = useTransform(smx, (v) => v * 4);
  const dotsX = useTransform(smx, (v) => v * 18);
  const dotsY = useTransform(smy, (v) => v * 14);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  const ease = [0.2, 0.9, 0.2, 1] as const;

  return (
    <section
      ref={ref}
      id="top"
      onPointerMove={onMove}
      className="relative isolate min-h-[100svh] overflow-hidden bg-cream text-ink"
    >
      {/* ink blob — top left */}
      <motion.div
        style={{ y: blobAy }}
        className="pointer-events-none absolute -left-[34vw] -top-[22vw] w-[78vw] min-w-[300px] max-w-[780px] md:-left-[15vw] md:-top-[17vw] md:w-[46vw]"
      >
        <motion.div style={{ x: aX, y: aY }}>
          <motion.div
            initial={{ scale: 0.25, opacity: 0, rotate: -30 }}
            animate={ready ? { scale: 1, opacity: 1, rotate: 0 } : {}}
            transition={{ duration: 1.6, ease }}
          >
            <LiquidBlob seed={3} points={9} variance={0.12} speed={0.4} className="w-full text-ink" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ink blob — right */}
      <motion.div
        style={{ y: blobBy }}
        className="pointer-events-none absolute -right-[30vw] top-[58%] w-[52vw] min-w-[220px] max-w-[520px] md:-right-[13vw] md:top-[30%] md:w-[29vw]"
      >
        <motion.div style={{ x: bX, y: bY }}>
          <motion.div
            initial={{ scale: 0.25, opacity: 0, rotate: 30 }}
            animate={ready ? { scale: 1, opacity: 1, rotate: 0 } : {}}
            transition={{ duration: 1.6, ease, delay: 0.15 }}
          >
            <LiquidBlob seed={9} points={8} variance={0.14} speed={0.5} className="w-full text-ink" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* floating droplets */}
      <motion.div style={{ x: dotsX, y: dotsY }} className="pointer-events-none absolute inset-0">
        {DOTS.map((d, i) => (
          <motion.span
            key={i}
            className={cn("blob-dot absolute bg-ink", d.cls)}
            style={{ animationDelay: `${d.delay}s, ${d.delay * 1.3}s` }}
            initial={{ scale: 0 }}
            animate={ready ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 170, damping: 11, delay: 0.7 + i * 0.12 }}
          />
        ))}
      </motion.div>

      {/* vertical editorial kicker */}
      <motion.p
        style={{ opacity: fade }}
        className="kicker pointer-events-none absolute left-6 top-[58%] z-20 hidden origin-left -translate-y-1/2 -rotate-90 text-white/60 mix-blend-difference lg:block"
      >
        <motion.span
          className="block"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 3, duration: 1 }}
        >
          Fresh · Local · Lifted
        </motion.span>
      </motion.p>

      {/* centre stage */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-6 pb-[21vh] pt-24 md:pb-[24vh]">
        <motion.div style={{ y: budY, rotate: budR }}>
          <motion.div style={{ x: budX, rotate: budTilt }}>
            <Bud play={ready} className="h-[min(31vh,330px)] w-auto text-ink" />
          </motion.div>
        </motion.div>

        <motion.div style={{ y: logoY, scale: logoS }} className="-mt-2 md:-mt-4">
          <PuffLogo play={ready} delay={1.45} className="h-[min(18vh,190px)] w-auto text-ink" />
        </motion.div>

        <motion.div style={{ opacity: fade }} className="flex flex-col items-center">
          <motion.p
            className="kicker mt-4 text-ink/70"
            initial={{ opacity: 0, y: 12, letterSpacing: "0.7em" }}
            animate={ready ? { opacity: 1, y: 0, letterSpacing: "0.34em" } : {}}
            transition={{ delay: 2.5, duration: 1.1, ease }}
          >
            Greenhouse · Outdoor · Pre-rolls
          </motion.p>
          <motion.div
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2.8, duration: 0.9, ease }}
          >
            <LiquidButton href="#menu" variant="ink">
              See the menu <ArrowDown className="size-4" />
            </LiquidButton>
            <LiquidButton onClick={() => setOpen(true)} variant="outline-ink">
              <BagIcon className="size-4" /> Bag · {count}
            </LiquidButton>
          </motion.div>
        </motion.div>
      </div>

      {/* rotating badge */}
      <motion.div
        className="absolute bottom-[31vh] right-[10%] z-20 hidden mix-blend-difference lg:block"
        initial={{ opacity: 0, scale: 0.5, rotate: -60 }}
        animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : {}}
        transition={{ delay: 3.1, duration: 1.1, ease }}
      >
        <CircularBadge text="SCROLL • TO • THE • MENU • " className="w-32 text-white">
          <span className="grid size-12 place-items-center rounded-full bg-white text-black">
            <ArrowDown className="bob size-5" />
          </span>
        </CircularBadge>
      </motion.div>

      {/* liquid floor */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 -bottom-px z-[5]"
        initial={{ y: "100%" }}
        animate={ready ? { y: "0%" } : {}}
        transition={{ duration: 1.7, ease, delay: 0.15 }}
      >
        <LiquidEdge shape={HERO_EDGE} fill={INK} bg="transparent" flip />
      </motion.div>
    </section>
  );
}
