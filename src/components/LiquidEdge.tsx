import { useAnimationFrame, useReducedMotion } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { bubblePos, buildEdgePath, r1, type EdgeShape } from "@/lib/liquid";
import { useNearViewport } from "@/lib/scroll";
import { cn } from "@/utils/cn";

type Props = {
  shape: EdgeShape;
  fill: string;
  bg: string;
  holeFill?: string;
  flip?: boolean;
  className?: string;
  speed?: number;
};

/**
 * Full-width animated liquid boundary between two sections.
 * - flip=false: fill hangs from the top and drips downward
 * - flip=true : fill rises from the bottom with round-headed fingers
 */
export default function LiquidEdge({ shape, fill, bg, holeFill, flip, className, speed = 1 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const holeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const dropRefs = useRef<(SVGCircleElement | null)[]>([]);
  const [W, setW] = useState(1440);
  const near = useNearViewport(wrapRef);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setW(Math.max(320, Math.round(el.getBoundingClientRect().width)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const s = Math.min(1.2, Math.max(0.55, W / 1440));
  const H = Math.round(shape.height * s);

  const draw = useCallback(
    (t: number) => {
      const { d, drops } = buildEdgePath(shape, t, W, s);
      pathRef.current?.setAttribute("d", d);
      shape.dots?.forEach((b, i) => {
        const el = dotRefs.current[i];
        if (!el) return;
        const p = bubblePos(b, t, W, s, shape.base);
        el.setAttribute("cx", String(r1(p.x)));
        el.setAttribute("cy", String(r1(p.y)));
        el.setAttribute("r", String(r1(p.r)));
      });
      shape.holes?.forEach((b, i) => {
        const el = holeRefs.current[i];
        if (!el) return;
        const p = bubblePos(b, t, W, s, shape.base);
        el.setAttribute("cx", String(r1(p.x)));
        el.setAttribute("cy", String(r1(p.y)));
        el.setAttribute("r", String(r1(p.r)));
      });
      drops.forEach((p, i) => {
        const el = dropRefs.current[i];
        if (!el) return;
        if (p) {
          el.setAttribute("cx", String(r1(p.x)));
          el.setAttribute("cy", String(r1(p.y)));
          el.setAttribute("r", String(r1(p.r)));
        } else el.setAttribute("r", "0");
      });
    },
    [shape, W, s],
  );

  useLayoutEffect(() => {
    draw(0);
  }, [draw]);

  useAnimationFrame((time) => {
    if (reduce || !near.current) return;
    draw((time / 1000) * speed);
  });

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={cn("pointer-events-none relative w-full overflow-hidden", className)}
      style={{ height: H, background: bg }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <g transform={flip ? `translate(0 ${H}) scale(1 -1)` : undefined}>
          <path ref={pathRef} fill={fill} />
          {shape.dots?.map((_, i) => (
            <circle
              key={`d${i}`}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              fill={fill}
            />
          ))}
          {shape.holes?.map((_, i) => (
            <circle
              key={`h${i}`}
              ref={(el) => {
                holeRefs.current[i] = el;
              }}
              fill={holeFill ?? bg}
            />
          ))}
          {shape.drips?.map((_, i) => (
            <circle
              key={`r${i}`}
              ref={(el) => {
                dropRefs.current[i] = el;
              }}
              r={0}
              fill={fill}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
