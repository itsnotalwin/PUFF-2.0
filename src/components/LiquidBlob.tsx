import { useAnimationFrame, useReducedMotion } from "framer-motion";
import { useMemo, useRef, type CSSProperties } from "react";
import { blobPath, makeBlobSpec } from "@/lib/liquid";
import { useNearViewport } from "@/lib/scroll";

type Props = {
  className?: string;
  style?: CSSProperties;
  seed?: number;
  points?: number;
  variance?: number;
  speed?: number;
  irregular?: number;
  fill?: string;
};

/** A morphing, organic ink blob driven by a shared animation clock. */
export default function LiquidBlob({
  className,
  style,
  seed = 1,
  points = 8,
  variance = 0.14,
  speed = 0.5,
  irregular = 0.1,
  fill = "currentColor",
}: Props) {
  const spec = useMemo(() => makeBlobSpec(points, seed, irregular), [points, seed, irregular]);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const near = useNearViewport(svgRef);
  const reduce = useReducedMotion();
  const offset = seed * 3.7;
  const initial = useMemo(() => blobPath(spec, 100, variance, offset), [spec, variance, offset]);

  useAnimationFrame((time) => {
    if (reduce || !near.current || !pathRef.current) return;
    pathRef.current.setAttribute("d", blobPath(spec, 100, variance, (time / 1000) * speed + offset));
  });

  return (
    <svg ref={svgRef} viewBox="-140 -140 280 280" className={className} style={style} aria-hidden="true">
      <path ref={pathRef} d={initial} fill={fill} />
    </svg>
  );
}
