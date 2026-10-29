import { motion } from "framer-motion";
import { MENU, SPECIAL_PACKS } from "@/data/menu";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

export type BagLine = {
  id: string;
  category: string;
  label: string;
  weight: string;
  price: number;
  qty: number;
};
export type BagInput = Omit<BagLine, "qty">;

type Drop = {
  key: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  lines: { item: BagInput; qty: number }[];
};

type BagCtx = {
  items: BagLine[];
  count: number;
  total: number;
  add: (lines: { item: BagInput; qty: number }[], from?: DOMRect | null) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  bagRef: RefObject<HTMLButtonElement | null>;
  bump: number;
};

const Ctx = createContext<BagCtx | null>(null);

export function useBag() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBag must be used inside <BagProvider>");
  return c;
}

const KEY = "puff-bag-v1";

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagLine[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      const saved: unknown = JSON.parse(raw);
      if (!Array.isArray(saved)) return [];

      // Reconcile persisted bags against current prices, weights and IDs.
      // Obsolete formats are removed instead of allowing incorrect totals.
      const products: BagInput[] = [
        ...MENU.flatMap((category) =>
          category.items.map((item) => ({
            id: item.id, category: category.title, label: item.label,
            weight: item.weight, price: item.price,
          })),
        ),
        ...SPECIAL_PACKS.map((item) => ({
          id: item.id, category: "Greenhouse", label: item.label,
          weight: item.weight, price: item.price,
        })),
      ];
      const current = new Map(products.map((item) => [item.id, item]));
      return saved.flatMap((value: unknown): BagLine[] => {
        if (!value || typeof value !== "object") return [];
        const line = value as Partial<BagLine>;
        if (typeof line.id !== "string" || typeof line.qty !== "number" ||
            !Number.isInteger(line.qty) || line.qty <= 0) return [];
        const product = current.get(line.id);
        return product ? [{ ...product, qty: line.qty }] : [];
      });
    } catch {
      return [];
    }
  });
  const [isOpen, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [drops, setDrops] = useState<Drop[]>([]);
  const bagRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const commit = useCallback((lines: { item: BagInput; qty: number }[]) => {
    setItems((prev) => {
      let next = [...prev];
      for (const { item, qty } of lines) {
        const ex = next.find((p) => p.id === item.id);
        next = ex
          ? next.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p))
          : [...next, { ...item, qty }];
      }
      return next;
    });
    setBump((b) => b + 1);
  }, []);

  const add = useCallback(
    (lines: { item: BagInput; qty: number }[], from?: DOMRect | null) => {
      if (!lines.length) return;
      const target = bagRef.current?.getBoundingClientRect();
      if (from && target && target.width > 0) {
        setDrops((d) => [
          ...d,
          {
            key: Date.now() + Math.random(),
            x0: from.left + from.width / 2,
            y0: from.top + from.height / 2,
            x1: target.left + target.width / 2,
            y1: target.top + target.height / 2,
            lines,
          },
        ]);
      } else commit(lines);
    },
    [commit],
  );

  const dropsRef = useRef<Drop[]>([]);
  dropsRef.current = drops;
  const land = useCallback(
    (key: number) => {
      const drop = dropsRef.current.find((x) => x.key === key);
      if (!drop) return;
      dropsRef.current = dropsRef.current.filter((x) => x.key !== key);
      commit(drop.lines);
      setDrops((d) => d.filter((x) => x.key !== key));
    },
    [commit],
  );

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((p) => p.id !== id) : prev.map((p) => (p.id === id ? { ...p, qty } : p)),
    );
  }, []);
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((p) => p.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<BagCtx>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    return { items, count, total, add, setQty, remove, clear, isOpen, setOpen, bagRef, bump };
  }, [items, add, setQty, remove, clear, isOpen, bump]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {/* droplets flying into the bag */}
      {drops.map((d) => (
        <FlyingDrop key={d.key} drop={d} onLand={land} />
      ))}
    </Ctx.Provider>
  );
}

function FlyingDrop({ drop, onLand }: { drop: Drop; onLand: (key: number) => void }) {
  const peak = Math.min(drop.y0, drop.y1) - 130;
  // guard against the drop being cancelled by strict-mode double effects
  const landed = useRef(false);
  return (
    <motion.span
      className="pointer-events-none fixed left-0 top-0 z-[160] block h-5 w-5 rounded-full bg-white mix-blend-difference"
      initial={{ x: drop.x0 - 10, y: drop.y0 - 10, scale: 0.4 }}
      animate={{
        x: drop.x1 - 10,
        y: [drop.y0 - 10, peak, drop.y1 - 10],
        scale: [0.4, 1.35, 0.5],
        borderRadius: ["50%", "42% 58% 50% 50%", "50%"],
      }}
      transition={{
        x: { duration: 0.85, ease: [0.45, 0, 0.55, 1] },
        y: { duration: 0.85, times: [0, 0.42, 1], ease: ["easeOut", "easeIn"] },
        scale: { duration: 0.85, times: [0, 0.42, 1] },
        borderRadius: { duration: 0.85 },
      }}
      onAnimationComplete={() => {
        if (landed.current) return;
        landed.current = true;
        onLand(drop.key);
      }}
    />
  );
}
