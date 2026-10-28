import { animate, motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { scrollToTarget } from "@/lib/scroll";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* Liquid, magnetic button                                             */
/* ------------------------------------------------------------------ */
type Variant = "ink" | "cream" | "outline-ink" | "outline-cream";
type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  variant?: Variant;
  className?: string;
  disabled?: boolean;
  target?: string;
  ariaLabel?: string;
  magnetic?: boolean;
};

export function LiquidButton({
  children,
  href,
  onClick,
  variant = "ink",
  className,
  disabled,
  target,
  ariaLabel,
  magnetic = true,
}: ButtonProps) {
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 14, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 14, mass: 0.5 });

  const setOrigin = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    el.style.setProperty("--x", `${px}px`);
    el.style.setProperty("--y", `${py}px`);
    return { r, px, py };
  };
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const o = setOrigin(e);
    if (!o || !magnetic || e.pointerType !== "mouse") return;
    x.set((o.px - o.r.width / 2) * 0.22);
    y.set((o.py - o.r.height / 2) * 0.35);
  };
  const onLeave = (e: React.PointerEvent<HTMLElement>) => {
    setOrigin(e);
    x.set(0);
    y.set(0);
  };
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (href && href.startsWith("#")) {
      e.preventDefault();
      scrollToTarget(href);
    }
    onClick?.(e);
  };
  const cls = cn("btn-liquid", `btn-${variant}`, className);
  const inner = <span className="relative z-10 inline-flex items-center gap-[inherit]">{children}</span>;

  if (href)
    return (
      <motion.a
        ref={(el: HTMLAnchorElement | null) => {
          ref.current = el;
        }}
        href={href}
        target={target}
        rel={target ? "noopener noreferrer" : undefined}
        onPointerMove={onMove}
        onPointerEnter={setOrigin}
        onPointerLeave={onLeave}
        onClick={handleClick}
        style={{ x: sx, y: sy }}
        className={cls}
        aria-label={ariaLabel}
      >
        {inner}
      </motion.a>
    );
  return (
    <motion.button
      ref={(el: HTMLButtonElement | null) => {
        ref.current = el;
      }}
      type="button"
      disabled={disabled}
      onPointerMove={onMove}
      onPointerEnter={setOrigin}
      onPointerLeave={onLeave}
      onClick={handleClick}
      style={{ x: sx, y: sy }}
      className={cls}
      aria-label={ariaLabel}
    >
      {inner}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Animated number                                                     */
/* ------------------------------------------------------------------ */
const defaultFormat = (v: number) => String(Math.round(v));

export function AnimatedNumber({
  value,
  format = defaultFormat,
  duration = 0.9,
  fromZeroOnView = false,
  className,
}: {
  value: number;
  format?: (v: number) => string;
  duration?: number;
  fromZeroOnView?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef(fromZeroOnView ? 0 : value);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [initial] = useState(() => format(fromZeroOnView ? 0 : value));
  const fmt = useRef(format);
  fmt.current = format;

  useEffect(() => {
    if (fromZeroOnView && !inView) return;
    const controls = animate(current.current, value, {
      duration,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (v) => {
        current.current = v;
        if (ref.current) ref.current.textContent = fmt.current(v);
      },
    });
    return () => controls.stop();
  }, [value, inView, fromZeroOnView, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {initial}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Section heading — kicker + script title                             */
/* ------------------------------------------------------------------ */
export function SectionHeading({
  kicker,
  title,
  tone = "ink",
  align = "center",
  className,
}: {
  kicker: string;
  title: string;
  tone?: "ink" | "cream";
  align?: "center" | "left";
  className?: string;
}) {
  const words = title.split(" ");
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
      <motion.p
        className={cn("kicker", tone === "cream" ? "text-cream/60" : "text-mist")}
        initial={{ opacity: 0, y: 14, letterSpacing: "0.7em" }}
        whileInView={{ opacity: 1, y: 0, letterSpacing: "0.34em" }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.1, ease: [0.2, 0.9, 0.2, 1] }}
      >
        {kicker}
      </motion.p>
      <h2
        className={cn(
          "mt-2 font-script text-[3.2rem] leading-[1.3] sm:text-[4rem] md:text-[5.4rem]",
          tone === "cream" ? "text-cream" : "text-ink",
        )}
      >
        {words.map((w, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: 50, rotate: -6, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, rotate: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.95, ease: [0.2, 0.9, 0.2, 1], delay: 0.1 + i * 0.11 }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Rotating circular text badge                                        */
/* ------------------------------------------------------------------ */
export function CircularBadge({
  text,
  className,
  children,
}: {
  text: string;
  className?: string;
  children?: ReactNode;
}) {
  const id = "badge-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <div className={cn("relative aspect-square", className)}>
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <path id={id} d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
        </defs>
        <text
          fill="currentColor"
          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: "0.2em" }}
        >
          <textPath href={`#${id}`} textLength={486} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */
type IconProps = { className?: string };
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const PlusIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const MinusIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <path d="M5 12h14" />
  </svg>
);
export const CloseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const ArrowDown = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <path d="M12 4v16M6 14l6 6 6-6" />
  </svg>
);
export const ArrowUp = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <path d="M12 20V4M6 10l6-6 6 6" />
  </svg>
);
export const BagIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
);
export const ChatIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5z" />
    <path d="M9 10.5c.3 1.8 2.2 3.7 4 4l1.2-1.2 1.8.8" />
  </svg>
);
export const CopyIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <rect x="8" y="8" width="12" height="12" rx="3" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </svg>
);
export const CheckIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

/** Little 5-leaflet silhouette used as a separator */
export const LeafIcon = ({ className }: IconProps) => {
  const leaves = [
    { a: -66, ry: 8.5 },
    { a: -33, ry: 11.5 },
    { a: 0, ry: 14 },
    { a: 33, ry: 11.5 },
    { a: 66, ry: 8.5 },
  ];
  return (
    <svg viewBox="0 0 48 48" className={className} fill="currentColor" aria-hidden="true">
      {leaves.map(({ a, ry }) => (
        <ellipse key={a} cx="24" cy={31 - ry} rx={a === 0 ? 4.2 : 3.6} ry={ry} transform={`rotate(${a} 24 31)`} />
      ))}
      <rect x="23" y="30" width="2.2" height="12" rx="1.1" />
    </svg>
  );
};
