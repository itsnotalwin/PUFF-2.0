import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import PuffLogo from "@/components/PuffLogo";
import { ArrowUp, LiquidButton } from "@/components/ui";
import { scrollToTarget } from "@/lib/scroll";

const LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#lineup", label: "Lineup" },
  { href: "#calculator", label: "Budget mixer" },
  { href: "#faq", label: "FAQ" },
];

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-2 md:px-10">
        <div className="grid gap-10 border-b border-cream/15 pb-12 md:grid-cols-[1.4fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-script text-[2.6rem] leading-[1.35]">Stay lifted.</p>
            <p className="mt-2 max-w-xs text-cream/60">
              Greenhouse & outdoor flower, packs and pre-rolls — honest prices, zero fuss.
            </p>
            <LiquidButton variant="cream" href="#menu" className="mt-6">
              Back to the menu
            </LiquidButton>
          </motion.div>
          <div>
            <p className="kicker text-cream/45">Explore</p>
            <ul className="mt-4 space-y-3 font-wide text-[0.78rem] font-semibold uppercase tracking-[0.22em]">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToTarget(l.href);
                    }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div ref={ref} className="py-10 md:py-14">
          <PuffLogo play={inView} delay={0.1} className="mx-auto h-auto w-full max-w-[1000px] text-cream" />
        </div>

        <div className="flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
          <p className="kicker text-cream/40">© {new Date().getFullYear()} Puff · All rights reserved</p>
          <p className="kicker text-cream/40">Adults 18+ only · Enjoy responsibly · Don't drive high</p>
          <button
            onClick={() => scrollToTarget(0)}
            className="group grid size-12 place-items-center rounded-full border-2 border-cream transition-colors duration-300 hover:bg-cream hover:text-ink"
            aria-label="Back to top"
          >
            <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
