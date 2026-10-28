import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FAQ, HOURS, waLink } from "@/data/menu";
import Bud from "@/components/Bud";
import LiquidBlob from "@/components/LiquidBlob";
import { ChatIcon, CircularBadge, LiquidButton, PlusIcon, SectionHeading } from "@/components/ui";
import { cn } from "@/utils/cn";

function useOpenStatus() {
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    const compute = () => {
      try {
        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone: "Africa/Johannesburg",
          weekday: "short",
          hour: "numeric",
          minute: "numeric",
          hourCycle: "h23",
        }).formatToParts(new Date());
        const wd = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
        const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
        const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
        const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
        const now = h + m / 60;
        const today = HOURS.find((x) => x.days.includes(day));
        if (today && now >= today.open && now < today.close) {
          setStatus({ open: true, label: `Open now · until ${today.close}:00` });
          return;
        }
        if (today && now < today.open) {
          setStatus({ open: false, label: `Closed · opens ${today.open}:00` });
          return;
        }
        const next = HOURS.find((x) => x.days.includes((day + 1) % 7));
        setStatus({ open: false, label: next ? `Closed · opens tomorrow ${next.open}:00` : "Closed" });
      } catch {
        setStatus(null);
      }
    };
    compute();
    const id = window.setInterval(compute, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}

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
  const status = useOpenStatus();
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

        <aside id="visit" className="scroll-mt-24 lg:pt-28">
          <motion.div
            className="relative overflow-hidden rounded-[2.4rem] bg-ink p-7 text-cream md:p-9"
            initial={{ opacity: 0, y: 60, rotate: 3 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 60, damping: 14 }}
          >
            <LiquidBlob className="pointer-events-none absolute -right-20 -top-20 w-56 text-cream/[0.07]" seed={17} />
            <p className="kicker relative text-cream/55">Opening hours</p>
            <h3 className="relative mt-1 font-script text-[2.6rem] leading-[1.35]">Come say hi</h3>
            {status && (
              <div className="relative mt-4 inline-flex items-center gap-2.5 rounded-full border-2 border-cream/25 px-4 py-2">
                <span
                  className={cn("pulse-dot relative block h-2.5 w-2.5 rounded-full", status.open ? "bg-cream" : "bg-cream/40")}
                />
                <span className="font-wide text-[0.62rem] font-bold uppercase tracking-[0.2em]">{status.label}</span>
              </div>
            )}
            <ul className="relative mt-6 divide-y divide-cream/15 border-y border-cream/15">
              {HOURS.map((h) => (
                <li key={h.day} className="flex items-center justify-between py-3.5">
                  <span className="font-wide text-[0.72rem] font-semibold uppercase tracking-[0.22em]">{h.day}</span>
                  <span className="font-bold tabular-nums">{h.time}</span>
                </li>
              ))}
            </ul>
            <LiquidButton
              href={waLink("Hi Puff! I've got a question 🙂")}
              target="_blank"
              variant="cream"
              className="relative mt-7 w-full"
            >
              <ChatIcon className="size-4" /> Message us
            </LiquidButton>
            <p className="relative mt-5 text-center text-xs text-cream/50">18+ only · Valid ID required · Cash & card</p>
          </motion.div>

          <div className="mt-10 flex justify-center">
            <CircularBadge text="GREENHOUSE • OUTDOOR • PRE-ROLLS • " className="w-40 text-ink">
              <Bud still className="h-16 w-auto text-ink" />
            </CircularBadge>
          </div>
        </aside>
      </div>
    </section>
  );
}
