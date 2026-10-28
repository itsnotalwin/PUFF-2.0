/* ------------------------------------------------------------------ */
/*  Liquid geometry helpers — blobs, drippy edges, bubbles             */
/*  Pure functions so they can be driven by a single animation clock   */
/* ------------------------------------------------------------------ */

export type Pt = [number, number];

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const r1 = (n: number) => Math.round(n * 10) / 10;

/** Smooth closed path through points (Catmull-Rom → cubic Bézier) */
export function smoothClosedPath(pts: Pt[], tension = 1): string {
  const n = pts.length;
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    d +=
      `C${r1(p1[0] + ((p2[0] - p0[0]) / 6) * tension)} ${r1(p1[1] + ((p2[1] - p0[1]) / 6) * tension)} ` +
      `${r1(p2[0] - ((p3[0] - p1[0]) / 6) * tension)} ${r1(p2[1] - ((p3[1] - p1[1]) / 6) * tension)} ` +
      `${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d + "Z";
}

/* ---------------------------- Blobs ------------------------------- */

export type BlobSpec = {
  n: number;
  angles: number[];
  s1: number[];
  s2: number[];
  p1: number[];
  p2: number[];
  base: number[];
};

export function makeBlobSpec(n: number, seed: number, irregular = 0.12): BlobSpec {
  const rnd = mulberry32(seed);
  const spec: BlobSpec = { n, angles: [], s1: [], s2: [], p1: [], p2: [], base: [] };
  for (let i = 0; i < n; i++) {
    spec.angles.push((i / n) * Math.PI * 2 + (rnd() - 0.5) * (Math.PI / n) * 0.6);
    spec.s1.push(0.6 + rnd() * 0.9);
    spec.s2.push(0.3 + rnd() * 0.7);
    spec.p1.push(rnd() * Math.PI * 2);
    spec.p2.push(rnd() * Math.PI * 2);
    spec.base.push(1 + (rnd() - 0.5) * irregular * 2);
  }
  return spec;
}

export function blobPath(spec: BlobSpec, R: number, variance: number, t: number, cx = 0, cy = 0): string {
  const pts: Pt[] = [];
  for (let i = 0; i < spec.n; i++) {
    const k =
      spec.base[i] +
      variance *
        (0.62 * Math.sin(t * spec.s1[i] + spec.p1[i]) + 0.38 * Math.sin(t * spec.s2[i] * 1.7 + spec.p2[i]));
    const a = spec.angles[i];
    pts.push([cx + Math.cos(a) * R * k, cy + Math.sin(a) * R * k]);
  }
  return smoothClosedPath(pts);
}

/* ------------------------- Drippy edges ---------------------------- */
/* Geometry is built in "down" orientation: the fill occupies the top  */
/* of the box and the surface/drips hang downward. Flip for "up".      */

export type Wave = { amp: number; len: number; speed: number; phase?: number };
export type Lobe = { x: number; w: number; h: number; speed?: number; phase?: number; vary?: number };
export type Drip = {
  x: number; // normalised 0..1
  w: number; // flare half width (px)
  neck: number; // neck half width (px)
  bulb: number; // bulb radius (px)
  len: number; // length from surface (px)
  speed?: number;
  phase?: number;
  vary?: number;
  detach?: boolean; // periodically drops a droplet
  period?: number;
};
export type Bubble = { x: number; y: number; r: number; speed?: number; phase?: number; bob?: number };
export type EdgeShape = {
  height: number;
  base: number;
  waves?: Wave[];
  lobes?: Lobe[];
  drips?: Drip[];
  dots?: Bubble[]; // fill-coloured droplets floating outside the fill
  holes?: Bubble[]; // background-coloured bubbles inside the fill
};

const easeOutBack = (x: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export function edgeSurface(sh: EdgeShape, x: number, t: number, W: number, s: number): number {
  let y = sh.base * s;
  if (sh.waves)
    for (const w of sh.waves)
      y += w.amp * s * Math.sin((x / (w.len * s)) * Math.PI * 2 + t * w.speed + (w.phase ?? 0));
  if (sh.lobes)
    for (const l of sh.lobes) {
      const u = (x - l.x * W) / (l.w * s);
      if (Math.abs(u) > 2.2) continue;
      const h = l.h * s * (1 + (l.vary ?? 0.14) * Math.sin(t * (l.speed ?? 0.8) + (l.phase ?? 0)));
      y += h * Math.exp(-(u * u * u * u));
    }
  return y;
}

type DropPos = { x: number; y: number; r: number } | null;
type DripState = { cx: number; w: number; n: number; b: number; L: number; drop: DropPos };

function dripState(dr: Drip, t: number, W: number, s: number, y0: number): DripState {
  const cx = dr.x * W;
  const w = dr.w * s;
  const n = dr.neck * s;
  const b0 = dr.bulb * s;
  const len = dr.len * s;
  let L: number;
  let drop: DropPos = null;
  if (dr.detach) {
    const P = dr.period ?? 5;
    const c = ((((t + (dr.phase ?? 0)) / P) % 1) + 1) % 1;
    const split = 0.8;
    if (c < split) {
      const g = c / split;
      L = len * (0.5 + 0.65 * g * g);
    } else {
      const g = (c - split) / (1 - split);
      L = len * (1.15 - 0.65 * easeOutBack(g));
    }
    const tau = ((c - split + 1) % 1) * P;
    if (tau < 1.4) {
      const yS = y0 + len * 1.15 - b0;
      drop = {
        x: cx,
        y: yS + 0.5 * 1300 * s * tau * tau + 24 * s * tau,
        r: b0 * 0.9 * Math.max(0.4, 1 - tau * 0.3),
      };
    }
  } else {
    L = len * (1 + (dr.vary ?? 0.18) * Math.sin(t * (dr.speed ?? 0.9) + (dr.phase ?? 0)));
  }
  L = Math.max(L, b0 * 2.4);
  const b = b0 * (0.9 + 0.1 * Math.min(1.2, L / len));
  return { cx, w, n: Math.min(n, b * 0.85), b, L, drop };
}

export function buildEdgePath(
  sh: EdgeShape,
  t: number,
  W: number,
  s: number,
): { d: string; drops: DropPos[] } {
  const Y = (x: number) => edgeSurface(sh, x, t, W, s);
  const step = Math.max(10, 22 * s);
  const states = (sh.drips ?? []).map((dr) => dripState(dr, t, W, s, Y(dr.x * W)));
  const drops = states.map((st) => st.drop);
  const sorted = [...states].sort((a, b) => a.cx - b.cx);

  let d = `M-60 -6L-60 ${r1(Y(-60))}`;
  let cursor = -60;

  const run = (xa: number, xb: number) => {
    if (xb <= xa + 0.5) {
      d += `L${r1(xb)} ${r1(Y(xb))}`;
      return;
    }
    const n = Math.max(1, Math.ceil((xb - xa) / step));
    const dx = (xb - xa) / n;
    const P = (k: number): Pt => {
      const x = xa + k * dx;
      return [x, Y(x)];
    };
    let prev = P(-1);
    let cur = P(0);
    let next = P(1);
    for (let k = 0; k < n; k++) {
      const nn = P(k + 2);
      d +=
        `C${r1(cur[0] + (next[0] - prev[0]) / 6)} ${r1(cur[1] + (next[1] - prev[1]) / 6)} ` +
        `${r1(next[0] - (nn[0] - cur[0]) / 6)} ${r1(next[1] - (nn[1] - cur[1]) / 6)} ${r1(next[0])} ${r1(next[1])}`;
      prev = cur;
      cur = next;
      next = nn;
    }
  };
  const slope = (x: number) => (Y(x + 1) - Y(x - 1)) / 2;

  for (const st of sorted) {
    const xs = st.cx - st.w;
    const xe = st.cx + st.w;
    if (xs < cursor + 2 || xe > W + 54) continue;
    run(cursor, xs);
    const y0 = Y(st.cx);
    const ys = Y(xs);
    const ye = Y(xe);
    const ks = st.w * 0.55;
    const ms = slope(xs);
    const me = slope(xe);
    let yNt = y0 + Math.min(Math.max(st.L * 0.28, 3), st.w * 0.85);
    yNt = Math.max(yNt, ys + 2, ye + 2);
    let yBc = y0 + st.L - st.b;
    if (yBc < yNt + st.b * 0.3) yBc = yNt + st.b * 0.3;
    const mid = (yBc - yNt) * 0.45;
    const ln = st.cx - st.n;
    const rn = st.cx + st.n;
    const lb = st.cx - st.b;
    const rb = st.cx + st.b;
    d += `C${r1(xs + ks)} ${r1(ys + ks * ms)} ${r1(ln)} ${r1(yNt - (yNt - ys) * 0.55)} ${r1(ln)} ${r1(yNt)}`;
    d += `C${r1(ln)} ${r1(yNt + mid)} ${r1(lb)} ${r1(yBc - mid)} ${r1(lb)} ${r1(yBc)}`;
    d += `A${r1(st.b)} ${r1(st.b)} 0 0 0 ${r1(rb)} ${r1(yBc)}`;
    d += `C${r1(rb)} ${r1(yBc - mid)} ${r1(rn)} ${r1(yNt + mid)} ${r1(rn)} ${r1(yNt)}`;
    d += `C${r1(rn)} ${r1(yNt - (yNt - ye) * 0.55)} ${r1(xe - ks)} ${r1(ye - ks * me)} ${r1(xe)} ${r1(ye)}`;
    cursor = xe;
  }
  run(cursor, W + 60);
  d += `L${r1(W + 60)} -6Z`;
  return { d, drops };
}

export function bubblePos(bb: Bubble, t: number, W: number, s: number, base: number) {
  const ph = bb.phase ?? 0;
  return {
    x: bb.x * W,
    y: base * s + bb.y * s + (bb.bob ?? 6) * s * Math.sin(t * (bb.speed ?? 1) + ph),
    r: bb.r * s * (1 + 0.07 * Math.sin(t * 1.3 + ph)),
  };
}
