import type { CSSProperties } from "react";
import { PUFF_LOGO } from "./puffPaths";
import { cn } from "@/utils/cn";

type Props = {
  play?: boolean;
  still?: boolean;
  delay?: number;
  interactive?: boolean;
  className?: string;
};

/** The "Puff" script wordmark — outlines draw on, then flood with ink. Jiggles on hover. */
export default function PuffLogo({ play = false, still = false, delay = 0, interactive = true, className }: Props) {
  return (
    <svg
      viewBox={`0 0 ${PUFF_LOGO.w} ${PUFF_LOGO.h}`}
      className={cn(
        "puff-logo overflow-visible",
        still ? "is-static" : play && "is-playing",
        interactive && "is-interactive",
        className,
      )}
      role="img"
      aria-label="Puff"
    >
      {PUFF_LOGO.glyphs.map((d, i) => (
        <g key={i} className="puff-glyph" style={{ "--i": i } as CSSProperties}>
          <path
            d={d}
            pathLength={1}
            className="puff-path"
            style={{ animationDelay: `${delay + i * 0.17}s, ${delay + 0.85 + i * 0.17}s` }}
          />
        </g>
      ))}
    </svg>
  );
}
