import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useBag } from "./BagContext";
import LiquidBlob from "./LiquidBlob";
import { BagIcon, CloseIcon } from "./ui";
import { lockScroll, scrollToTarget } from "@/lib/scroll";

const LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#lineup", label: "Lineup" },
  { href: "#calculator", label: "Mixer" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar({ show }: { show: boolean }) {
  const { count, bagRef, setOpen, bump } = useBag();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    return lockScroll();
  }, [menuOpen]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    setTimeout(() => scrollToTarget(href), menuOpen ? 450 : 0);
  };

  return (
    <>
      {/* difference blending keeps the nav legible on both ink & cream */}
      <motion.header
        initial={{ y: -110 }}
        animate={{ y: show ? 0 : -110 }}
        transition={{ duration: 1, ease: [0.2, 0.9, 0.2, 1], delay: show ? 0.5 : 0 }}
        className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10 md:py-5">
          <a
            href="#top"
            onClick={go("#top")}
            className="font-script text-[1.9rem] leading-none transition-transform duration-500 hover:-rotate-6 md:text-[2.2rem]"
            aria-label="Puff — back to top"
          >
            Puff
          </a>
          <ul className="hidden items-center gap-9 font-wide text-[11px] font-semibold uppercase tracking-[0.32em] md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={go(l.href)} className="nav-link">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <button
              ref={bagRef}
              onClick={() => setOpen(true)}
              className="relative rounded-full bg-white py-2 pl-4 pr-2 font-wide text-[11px] font-bold uppercase tracking-[0.24em] text-black"
              aria-label={`Open bag, ${count} items`}
            >
              <motion.span
                key={bump}
                className="flex items-center gap-2.5"
                animate={bump ? { scale: [1, 1.22, 0.92, 1], rotate: [0, -6, 4, 0] } : undefined}
                transition={{ duration: 0.6 }}
              >
                <BagIcon className="size-4" />
                <span className="hidden sm:inline">Bag</span>
                <span className="grid h-7 min-w-7 place-items-center rounded-full bg-black px-2 text-[11px] tracking-normal text-white">
                  {count}
                </span>
              </motion.span>
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="grid size-11 place-items-center rounded-full border-2 border-white md:hidden"
              aria-label="Open navigation"
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 rounded bg-white" />
                <span className="block h-0.5 w-3.5 rounded bg-white" />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[90] flex flex-col overflow-hidden bg-ink text-cream md:hidden"
            initial={{ clipPath: "circle(0px at 88% 40px)" }}
            animate={{ clipPath: "circle(1500px at 88% 40px)" }}
            exit={{ clipPath: "circle(0px at 88% 40px)" }}
            transition={{ duration: 0.75, ease: [0.7, 0, 0.2, 1] }}
          >
            <LiquidBlob className="absolute -bottom-28 -left-28 w-96 text-cream/10" seed={21} />
            <LiquidBlob className="absolute -right-16 top-24 w-40 text-cream/10" seed={8} />
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-script text-[1.9rem] leading-none">Puff</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="grid size-11 place-items-center rounded-full border-2 border-cream"
                aria-label="Close navigation"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>
            <nav className="relative flex flex-1 flex-col justify-center gap-1 px-8">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={go(l.href)}
                  className="w-fit font-script text-[3.3rem] leading-[1.35]"
                  initial={{ opacity: 0, y: 40, rotate: -4 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <p className="kicker relative px-8 pb-10 text-cream/50">Adults 18+ only · Enjoy responsibly</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
