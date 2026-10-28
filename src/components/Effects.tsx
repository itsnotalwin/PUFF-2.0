import { motion, useMotionValue, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/* Blend-mode cursor: dot + trailing ring that floods on hover         */
/* ------------------------------------------------------------------ */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const [hidden, setHidden] = useState(true);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const t = e.target as Element | null;
      setHover(!!t?.closest?.('a, button, [role="button"], input, label, [data-cursor]'));
    };
    const leave = () => setHidden(true);
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener("pointermove", move);
    root.addEventListener("mouseleave", leave);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      window.removeEventListener("pointermove", move);
      root.removeEventListener("mouseleave", leave);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      root.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[999] mix-blend-difference">
      <motion.div className="absolute left-0 top-0" style={{ x: rx, y: ry }}>
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          initial={false}
          animate={{
            width: hover ? 68 : 36,
            height: hover ? 68 : 36,
            backgroundColor: hover ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
            opacity: hidden ? 0 : 1,
            scale: down ? 0.78 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        />
      </motion.div>
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <motion.div
          className="h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          animate={{ opacity: hidden || hover ? 0 : 1 }}
        />
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Click anywhere → ink splash                                          */
/* ------------------------------------------------------------------ */
type Splash = { id: number; x: number; y: number; drops: { a: number; d: number; r: number }[] };

export function ClickSplash() {
  const [splashes, setSplashes] = useState<Splash[]>([]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const id = performance.now() + Math.random();
      const drops = Array.from({ length: 7 }, () => ({
        a: Math.random() * Math.PI * 2,
        d: 24 + Math.random() * 36,
        r: 2.5 + Math.random() * 4.5,
      }));
      setSplashes((s) => [...s.slice(-5), { id, x: e.clientX, y: e.clientY, drops }]);
      window.setTimeout(() => setSplashes((s) => s.filter((p) => p.id !== id)), 900);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[997] mix-blend-difference">
      {splashes.map((s) => (
        <div key={s.id} className="absolute" style={{ left: s.x, top: s.y }}>
          <motion.span
            className="absolute rounded-full border-2 border-white"
            initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 1 }}
            animate={{ width: 76, height: 76, x: -38, y: -38, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          {s.drops.map((d, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white"
              style={{ width: d.r * 2, height: d.r * 2, left: -d.r, top: -d.r }}
              initial={{ x: 0, y: 0, scale: 1 }}
              animate={{
                x: Math.cos(d.a) * d.d,
                y: [0, Math.sin(d.a) * d.d, Math.sin(d.a) * d.d + 28],
                scale: [1, 0.9, 0],
              }}
              transition={{ duration: 0.75, ease: "easeOut" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll progress hairline                                             */
/* ------------------------------------------------------------------ */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-white mix-blend-difference"
      style={{ scaleX: sx }}
    />
  );
}
