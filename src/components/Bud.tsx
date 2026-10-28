import type { CSSProperties } from "react";
import { generateBud, type BudGroup, type BudStroke } from "@/lib/bud";
import { cn } from "@/utils/cn";

const ART = generateBud(7);

type Props = {
  play?: boolean;
  /** render fully drawn without the intro */
  still?: boolean;
  className?: string;
  delay?: number;
  speed?: number;
};

/** Line-art cannabis bud that draws itself stroke by stroke, then breathes & sways. */
export default function Bud({ play = false, still = false, className, delay = 0, speed = 1 }: Props) {
  const stroke = (s: BudStroke, i: number) => (
    <path
      key={i}
      d={s.d}
      pathLength={1}
      className="bud-stroke"
      style={{
        animationDelay: `${delay + s.delay / speed}s`,
        animationDuration: `${s.dur / speed}s`,
        fill: s.fill ? "var(--cream)" : "none",
      }}
    />
  );

  const group = (g: BudGroup, key: string) => (
    <g
      key={key}
      className={g.sway ? "bud-sway" : undefined}
      style={
        g.origin
          ? ({
              transformOrigin: `${g.origin[0]}px ${g.origin[1]}px`,
              "--sway": `${g.sway}deg`,
              animationDuration: `${g.swayDur}s`,
              animationDelay: `${g.swayDelay}s`,
            } as CSSProperties)
          : undefined
      }
    >
      {g.strokes.map(stroke)}
    </g>
  );

  return (
    <svg
      viewBox={ART.viewBox}
      className={cn("bud", still ? "is-static" : play && "is-playing", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Line drawing of a cannabis bud"
    >
      <g className="bud-breathe">
        {ART.back.map((g, i) => group(g, `b${i}`))}
        {group(ART.stem, "stem")}
        {group(ART.body, "body")}
        {group(ART.details, "details")}
        <g stroke="none" fill="currentColor">
          {ART.dots.map((d, i) => (
            <circle
              key={i}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              className="bud-dot"
              style={{ animationDelay: `${delay + d.delay / speed}s` }}
            />
          ))}
        </g>
        {ART.front.map((g, i) => group(g, `f${i}`))}
      </g>
    </svg>
  );
}
