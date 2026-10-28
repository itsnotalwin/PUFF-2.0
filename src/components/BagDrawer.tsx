import { AnimatePresence, motion, useAnimationFrame } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useBag, type BagLine } from "./BagContext";
import Bud from "./Bud";
import {
  AnimatedNumber,
  ChatIcon,
  CheckIcon,
  CloseIcon,
  CopyIcon,
  LiquidButton,
  MinusIcon,
  PlusIcon,
} from "./ui";
import { lockScroll, scrollToTarget } from "@/lib/scroll";
import { waLink } from "@/data/menu";

function orderText(items: BagLine[], total: number) {
  const lines = items.map((i) => `• ${i.qty}× ${i.category} — ${i.label} (${i.weight}) — R${i.qty * i.price}`);
  return ["Hi Puff! I'd like to order:", "", ...lines, "", `Total: R${total}`].join("\n");
}

/** Wobbly liquid left edge of the drawer */
function DrawerEdge() {
  const ref = useRef<SVGPathElement>(null);
  useAnimationFrame((time) => {
    const t = time / 1000;
    let d = "M32 0";
    for (let i = 0; i <= 48; i++) {
      const y = (i / 48) * 1000;
      const x = 15 + 8 * Math.sin(y / 110 + t * 1.3) + 5 * Math.sin(y / 41 - t * 0.9);
      d += `L${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    d += "L32 1000Z";
    ref.current?.setAttribute("d", d);
  });
  return (
    <svg
      className="pointer-events-none absolute right-[calc(100%-1px)] top-0 h-full w-8"
      viewBox="0 0 32 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path ref={ref} fill="#f3f1ec" />
    </svg>
  );
}

export default function BagDrawer() {
  const { items, total, count, isOpen, setOpen, setQty, remove, clear } = useBag();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const unlock = lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, setOpen]);

  const text = orderText(items, total);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div key="bag" className="fixed inset-0 z-[140]" initial="closed" animate="open" exit="closed">
          <motion.div
            className="absolute inset-0 bg-ink/45 backdrop-blur-[3px]"
            variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
            transition={{ duration: 0.4 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
            className="absolute right-0 top-0 flex h-[100dvh] w-[min(100vw,460px)] flex-col bg-cream text-ink"
            variants={{ open: { x: 0 }, closed: { x: "115%" } }}
            transition={{ type: "spring", stiffness: 170, damping: 26 }}
          >
            <DrawerEdge />
            <header className="flex items-center justify-between px-6 pb-3 pt-6 md:px-8">
              <div>
                <p className="kicker text-mist">
                  {count} {count === 1 ? "item" : "items"}
                </p>
                <h2 className="font-script text-[2.6rem] leading-[1.35]">Your bag</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid size-12 place-items-center rounded-full border-2 border-ink transition-colors hover:bg-ink hover:text-cream"
                aria-label="Close bag"
              >
                <CloseIcon className="size-5" />
              </button>
            </header>
            <div className="mx-6 h-px bg-line md:mx-8" />

            <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-5 md:px-8">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Bud still className="w-32 text-ink" />
                  </motion.div>
                  <p className="mt-6 font-wide text-sm font-bold uppercase tracking-[0.24em]">Your bag is empty</p>
                  <p className="mt-2 max-w-[16rem] text-sm text-mist">
                    Tap the + next to anything on the menu and it'll drip right in.
                  </p>
                  <LiquidButton
                    variant="ink"
                    className="mt-7"
                    onClick={() => {
                      setOpen(false);
                      setTimeout(() => scrollToTarget("#menu"), 380);
                    }}
                  >
                    Browse the menu
                  </LiquidButton>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((it) => (
                      <motion.li
                        key={it.id}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 80, transition: { duration: 0.25 } }}
                        transition={{ type: "spring", stiffness: 260, damping: 26 }}
                        className="rounded-[1.6rem] border-2 border-ink p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="kicker text-[0.6rem] text-mist md:text-[0.6rem]">{it.category}</p>
                            <p className="mt-0.5 font-wide text-sm font-bold uppercase tracking-[0.2em]">{it.label}</p>
                            <p className="text-sm text-mist">
                              {it.weight} · R{it.price} each
                            </p>
                          </div>
                          <button
                            onClick={() => remove(it.id)}
                            className="grid size-8 place-items-center rounded-full text-mist transition-colors hover:bg-ink hover:text-cream"
                            aria-label={`Remove ${it.category} ${it.label}`}
                          >
                            <CloseIcon className="size-4" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full bg-ink p-1 text-cream">
                            <button
                              onClick={() => setQty(it.id, it.qty - 1)}
                              className="grid size-8 place-items-center rounded-full transition-colors hover:bg-cream hover:text-ink"
                              aria-label="Decrease quantity"
                            >
                              <MinusIcon className="size-4" />
                            </button>
                            <span className="w-7 text-center font-bold tabular-nums">{it.qty}</span>
                            <button
                              onClick={() => setQty(it.id, it.qty + 1)}
                              className="grid size-8 place-items-center rounded-full transition-colors hover:bg-cream hover:text-ink"
                              aria-label="Increase quantity"
                            >
                              <PlusIcon className="size-4" />
                            </button>
                          </div>
                          <p className="text-2xl font-extrabold tracking-tight">R{it.qty * it.price}</p>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t-2 border-ink px-6 pb-6 pt-5 md:px-8">
                <div className="flex items-end justify-between">
                  <span className="kicker text-mist">Total</span>
                  <span className="text-4xl font-extrabold tracking-tight">
                    R<AnimatedNumber value={total} />
                  </span>
                </div>
                <div className="mt-5 grid gap-2.5">
                  <LiquidButton href={waLink(text)} target="_blank" variant="ink" magnetic={false} className="w-full">
                    <ChatIcon className="size-4" /> Order on WhatsApp
                  </LiquidButton>
                  <div className="grid grid-cols-[1fr_auto] gap-2.5">
                    <LiquidButton onClick={copy} variant="outline-ink" magnetic={false} className="w-full">
                      {copied ? (
                        <>
                          <CheckIcon className="size-4" /> Copied
                        </>
                      ) : (
                        <>
                          <CopyIcon className="size-4" /> Copy order
                        </>
                      )}
                    </LiquidButton>
                    <button
                      onClick={clear}
                      className="rounded-full px-4 font-wide text-[11px] font-bold uppercase tracking-[0.2em] text-mist underline-offset-4 transition-colors hover:text-ink hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-center text-xs text-mist">18+ only · ID required on collection</p>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
