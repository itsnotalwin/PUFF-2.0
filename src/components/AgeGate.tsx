import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Bud from "./Bud";
import LiquidBlob from "./LiquidBlob";
import LiquidEdge from "./LiquidEdge";
import PuffLogo from "./PuffLogo";
import { GATE_EDGE, INK } from "./edges";
import { LiquidButton } from "./ui";
import { lockScroll } from "@/lib/scroll";
import { cn } from "@/utils/cn";

type Phase = "ask" | "denied" | "fill" | "drain";

/** 18+ gate. "Yes" floods the screen with ink, which then drains away to reveal the site. */
export default function AgeGate({ onEnter, onDone }: { onEnter: () => void; onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("ask");
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  useEffect(() => lockScroll(), []);

  const radius = Math.hypot(window.innerWidth, window.innerHeight) + 40;

  const yes = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    setPhase("fill");
  };

  return (
    <div
      className={cn("fixed inset-0 z-[200]", phase === "drain" && "pointer-events-none")}
      role="dialog"
      aria-modal="true"
      aria-label="Age verification"
    >
      {phase !== "drain" && (
        <div className="absolute inset-0 overflow-hidden bg-cream text-ink">
          <motion.div
            className="absolute -left-[22vmax] -top-[24vmax] w-[62vmax]"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.2, 0.9, 0.2, 1] }}
          >
            <LiquidBlob seed={11} points={9} variance={0.13} speed={0.55} className="w-full text-ink" />
          </motion.div>
          <motion.div
            className="absolute -bottom-[28vmax] -right-[20vmax] w-[60vmax]"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.2, 0.9, 0.2, 1], delay: 0.15 }}
          >
            <LiquidBlob seed={5} points={9} variance={0.13} speed={0.5} className="w-full text-ink" />
          </motion.div>
          {[
            "left-[12%] bottom-[22%] h-9 w-9 md:h-14 md:w-14",
            "right-[14%] top-[18%] h-7 w-7 md:h-12 md:w-12",
            "right-[30%] bottom-[12%] h-4 w-4",
          ].map((cls, i) => (
            <motion.span
              key={i}
              className={cn("blob-dot absolute bg-ink", cls)}
              style={{ animationDelay: `${-i * 1.7}s, ${-i * 2.3}s` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 12, delay: 0.5 + i * 0.15 }}
            />
          ))}

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="flex flex-col items-center rounded-[2.5rem] bg-cream/0 px-2 py-6">
              <Bud play className="h-28 w-auto text-ink md:h-36" speed={1.4} />
              <PuffLogo play delay={0.9} className="-mt-1 h-20 w-auto text-ink md:h-28" />
              <motion.p
                className="kicker mt-6 text-mist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.7 }}
              >
                Greenhouse · Outdoor · Pre-rolls
              </motion.p>
              <motion.h1
                className="mt-3 font-wide text-lg font-bold uppercase tracking-[0.24em] md:text-2xl"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.75, duration: 0.7 }}
              >
                Are you 18 or older?
              </motion.h1>
              <motion.div
                className="mt-8 flex flex-wrap justify-center gap-3"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.95, duration: 0.7, ease: [0.2, 0.9, 0.2, 1] }}
              >
                <LiquidButton variant="ink" onClick={yes}>
                  Yes, let me in
                </LiquidButton>
                <LiquidButton variant="outline-ink" onClick={() => setPhase("denied")}>
                  Not yet
                </LiquidButton>
              </motion.div>
              <div className="h-14">
                <AnimatePresence>
                  {phase === "denied" && (
                    <motion.p
                      className="mt-5 font-wide text-xs font-semibold uppercase tracking-[0.2em]"
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      No stress — come back when you're 18 ✌
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <p className="max-w-xs text-xs leading-relaxed text-mist">
                By entering you confirm you're of legal age where you live. Please enjoy responsibly.
              </p>
            </div>
          </div>
        </div>
      )}

      {phase === "fill" && (
        <motion.div
          className="absolute inset-0 bg-ink"
          initial={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
          animate={{ clipPath: `circle(${radius}px at ${origin.x}px ${origin.y}px)` }}
          transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
          onAnimationComplete={() => {
            setPhase("drain");
            onEnter();
          }}
        />
      )}

      {phase === "drain" && (
        <motion.div
          className="absolute inset-0"
          initial={{ y: "0%" }}
          animate={{ y: "118%" }}
          transition={{ duration: 1.35, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
          onAnimationComplete={onDone}
        >
          <div className="absolute inset-0 bg-ink" />
          <LiquidEdge
            shape={GATE_EDGE}
            fill={INK}
            bg="transparent"
            flip
            speed={1.4}
            className="absolute inset-x-0 bottom-[calc(100%-2px)]"
          />
        </motion.div>
      )}
    </div>
  );
}
