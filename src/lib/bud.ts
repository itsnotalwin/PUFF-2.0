/* ------------------------------------------------------------------ */
/*  Procedural line-art cannabis bud (deterministic, seeded)           */
/*  Every stroke is a separate path so it can be "drawn" on screen.    */
/* ------------------------------------------------------------------ */

type P = [number, number];

export type BudStroke = { d: string; fill: boolean; delay: number; dur: number };
export type BudGroup = { strokes: BudStroke[]; origin?: P; sway?: number; swayDur?: number; swayDelay?: number };
export type BudDot = { cx: number; cy: number; r: number; delay: number };
export type BudArt = {
  viewBox: string;
  back: BudGroup[];
  stem: BudGroup;
  body: BudGroup;
  details: BudGroup;
  dots: BudDot[];
  front: BudGroup[];
};

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => Math.round(n * 10) / 10;

type Seg = { c: P | null; p: P };

/** One serrated cannabis leaflet. Returns outline + centre vein. */
function leaflet(bx: number, by: number, angDeg: number, len: number, wid: number, teeth: number, track: P[]) {
  const a = (angDeg * Math.PI) / 180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const T = (x: number, y: number): string => {
    const X = bx + x * ca - y * sa;
    const Y = by + x * sa + y * ca;
    track.push([X, Y]);
    return `${f(X)} ${f(Y)}`;
  };
  const prof = (s: number) => wid * Math.pow(Math.sin(Math.PI * s), 0.8) * (1 - 0.28 * s);
  const s0 = 0.14;
  const s1 = 0.92;
  const seg = (s1 - s0) / teeth;

  const side = (sg: number): Seg[] => {
    const segs: Seg[] = [];
    segs.push({ c: [s0 * len * 0.5, sg * prof(s0) * 0.75], p: [s0 * len, sg * prof(s0) * 0.86] });
    for (let i = 0; i < teeth; i++) {
      const sA = s0 + seg * i;
      const sB = s0 + seg * (i + 1);
      const sT = sB - seg * 0.24;
      const sm = (sA + sT) / 2;
      segs.push({ c: [sm * len, sg * (prof(sm) + wid * 0.05)], p: [sT * len, sg * (prof(sT) + wid * 0.14)] });
      segs.push({ c: null, p: [sB * len, sg * prof(sB) * 0.88] });
    }
    segs.push({ c: [(s1 + 0.04) * len, sg * prof(s1) * 0.5], p: [len, 0] });
    return segs;
  };

  const up = side(-1);
  const lo = side(1);
  let d = `M${T(0, 0)}`;
  for (const sg of up) d += sg.c ? `Q${T(sg.c[0], sg.c[1])} ${T(sg.p[0], sg.p[1])}` : `L${T(sg.p[0], sg.p[1])}`;
  const loPts: P[] = [[0, 0], ...lo.map((s) => s.p)];
  for (let k = lo.length; k >= 1; k--) {
    const sg = lo[k - 1];
    const target = loPts[k - 1];
    d += sg.c ? `Q${T(sg.c[0], sg.c[1])} ${T(target[0], target[1])}` : `L${T(target[0], target[1])}`;
  }
  d += "Z";
  const vein = `M${T(len * 0.06, 0)}Q${T(len * 0.5, wid * 0.12)} ${T(len * 0.84, 0)}`;
  return { outline: d, vein };
}

export function generateBud(seed = 7): BudArt {
  const rnd = rng(seed);
  const track: P[] = [];

  /* ---------- leaves ---------- */
  const single = (
    bx: number,
    by: number,
    ang: number,
    len: number,
    wid: number,
    teeth: number,
    delay: number,
    sway = 3,
  ): BudGroup => {
    const l = leaflet(bx, by, ang, len, wid, teeth, track);
    return {
      origin: [bx, by],
      sway,
      swayDur: 4 + rnd() * 2.5,
      swayDelay: -rnd() * 4,
      strokes: [
        { d: l.outline, fill: true, delay, dur: 0.75 },
        { d: l.vein, fill: false, delay: delay + 0.45, dur: 0.45 },
      ],
    };
  };

  const fan = (
    bx: number,
    by: number,
    ang: number,
    len: number,
    count: number,
    spread: number,
    wid: number,
    teeth: number,
    delay: number,
  ): BudGroup => {
    const items: { u: number }[] = [];
    for (let i = 0; i < count; i++) items.push({ u: count === 1 ? 0 : (i / (count - 1)) * 2 - 1 });
    items.sort((p, q) => Math.abs(q.u) - Math.abs(p.u));
    const strokes: BudStroke[] = [];
    items.forEach(({ u }, j) => {
      const l = len * (1 - 0.46 * Math.pow(Math.abs(u), 1.3));
      const w = wid * (0.78 + 0.22 * (1 - Math.abs(u)));
      const lf = leaflet(bx, by, ang + u * spread, l, w, Math.max(3, Math.round(teeth * (l / len))), track);
      strokes.push({ d: lf.outline, fill: true, delay: delay + j * 0.07, dur: 0.85 });
      strokes.push({ d: lf.vein, fill: false, delay: delay + 0.5 + j * 0.07, dur: 0.45 });
    });
    return { origin: [bx, by], sway: 2.2, swayDur: 5 + rnd() * 2, swayDelay: -rnd() * 4, strokes };
  };

  const back: BudGroup[] = [
    fan(166, 280, 160, 124, 5, 52, 18, 8, 0.05),
    fan(234, 280, 20, 124, 5, 52, 18, 8, 0.12),
    fan(128, 198, 197, 88, 3, 33, 15, 6, 0.25),
    fan(272, 174, -15, 90, 3, 33, 15, 6, 0.3),
    single(154, 112, -127, 80, 15, 6, 0.4),
    single(248, 104, -55, 84, 15, 6, 0.45),
    single(202, 98, -88, 64, 12, 5, 0.5),
  ];

  /* ---------- stem ---------- */
  const stemD = "M191 282C190 306 189 330 190 354Q200 363 210 354C211 330 210 306 209 282";
  track.push([188, 363], [212, 363]);
  const stem: BudGroup = { strokes: [{ d: stemD, fill: true, delay: 0.35, dur: 0.8 }] };

  /* ---------- body (scalloped cloud) ---------- */
  const cx = 200;
  const cy = 190;
  const rx = 86;
  const ry = 108;
  const N = 19;
  const pts: P[] = [];
  for (let i = 0; i < N; i++) {
    const th = -Math.PI / 2 + (i / N) * Math.PI * 2 + (rnd() - 0.5) * 0.16;
    const egg = 1 - 0.14 * Math.sin(th);
    const jr = 1 + (rnd() - 0.5) * 0.13;
    pts.push([cx + rx * Math.cos(th) * egg * jr, cy + ry * Math.sin(th) * jr]);
  }
  let bodyD = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < N; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % N];
    const ch = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const r = ch * (0.52 + rnd() * 0.2);
    bodyD += `A${f(r)} ${f(r)} 0 0 1 ${f(b[0])} ${f(b[1])}`;
    track.push([a[0] + (a[0] - cx) * 0.18, a[1] + (a[1] - cy) * 0.15]);
  }
  bodyD += "Z";
  const body: BudGroup = { strokes: [{ d: bodyD, fill: true, delay: 0.1, dur: 1.5 }] };

  /* ---------- calyx details ---------- */
  const centers: P[] = [];
  const chainPts: P[] = [];
  let tries = 0;
  while (centers.length < 10 && tries < 800) {
    tries++;
    const ang = rnd() * Math.PI * 2;
    const rr = Math.sqrt(rnd());
    const x = cx + Math.cos(ang) * rx * 0.72 * rr;
    const y = cy + Math.sin(ang) * ry * 0.76 * rr;
    if (centers.some((c) => Math.hypot(c[0] - x, c[1] - y) < 40)) continue;
    centers.push([x, y]);
  }
  const detailStrokes: BudStroke[] = [];
  centers.forEach(([x, y], i) => {
    let ux = x - cx;
    let uy = (y - cy) * 0.8;
    const L = Math.hypot(ux, uy);
    if (L < 16) {
      ux = 0;
      uy = -1;
    } else {
      ux /= L;
      uy /= L;
    }
    const rot = (rnd() - 0.5) * 0.8;
    const c = Math.cos(rot);
    const s = Math.sin(rot);
    const vx = ux * c - uy * s;
    const vy = ux * s + uy * c;
    const dx = -vy;
    const dy = vx;
    const k = rnd() < 0.7 ? 2 : 3;
    const r = 5.5 + rnd() * 2.5;
    let px = x - dx * r * k;
    let py = y - dy * r * k;
    let d = `M${f(px)} ${f(py)}`;
    chainPts.push([px, py]);
    for (let j = 0; j < k; j++) {
      chainPts.push([px + dx * r + vx * r, py + dy * r + vy * r]);
      px += dx * 2 * r;
      py += dy * 2 * r;
      chainPts.push([px, py]);
      d += `A${f(r)} ${f(r)} 0 0 1 ${f(px)} ${f(py)}`;
    }
    detailStrokes.push({ d, fill: false, delay: 0.95 + i * 0.05, dur: 0.55 });
  });
  // little pistil curls
  for (let i = 0; i < 3; i++) {
    let x = 0;
    let y = 0;
    for (let k = 0; k < 40; k++) {
      const ang = rnd() * Math.PI * 2;
      const rr = Math.sqrt(rnd());
      x = cx + Math.cos(ang) * rx * 0.62 * rr;
      y = cy + Math.sin(ang) * ry * 0.66 * rr;
      if (!chainPts.some((c) => Math.hypot(c[0] - x, c[1] - y) < 14)) break;
    }
    const a = rnd() * Math.PI * 2;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const T = (px: number, py: number) => `${f(x + px * ca - py * sa)} ${f(y + px * sa + py * ca)}`;
    chainPts.push([x, y]);
    detailStrokes.push({ d: `M${T(0, 0)}Q${T(4, -6)} ${T(8, -1)}T${T(15, -2)}`, fill: false, delay: 1.3 + i * 0.06, dur: 0.4 });
  }
  const details: BudGroup = { strokes: detailStrokes };

  /* ---------- trichome dots ---------- */
  const dots: BudDot[] = [];
  tries = 0;
  while (dots.length < 22 && tries < 1500) {
    tries++;
    const ang = rnd() * Math.PI * 2;
    const rr = Math.sqrt(rnd());
    const x = cx + Math.cos(ang) * rx * 0.8 * rr;
    const y = cy + Math.sin(ang) * ry * 0.82 * rr;
    if (chainPts.some((c) => Math.hypot(c[0] - x, c[1] - y) < 10)) continue;
    if (dots.some((d) => Math.hypot(d.cx - x, d.cy - y) < 13)) continue;
    dots.push({ cx: f(x), cy: f(y), r: f(2 + rnd() * 1.3), delay: 0 });
  }
  dots.sort((a, b) => a.cy - b.cy);
  dots.forEach((d, i) => (d.delay = 1.5 + i * 0.035));

  /* ---------- sugar leaves resting on the bud ---------- */
  const front: BudGroup[] = [
    single(176, 148, -132, 40, 9, 3, 1.35, 4),
    single(232, 214, -36, 38, 9, 3, 1.47, 4),
    single(184, 248, 160, 32, 8, 3, 1.59, 4),
    single(224, 134, -64, 30, 7, 3, 1.71, 4),
  ];

  /* ---------- bounds ---------- */
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of track) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  const pad = 8;
  const viewBox = `${f(minX - pad)} ${f(minY - pad)} ${f(maxX - minX + pad * 2)} ${f(maxY - minY + pad * 2)}`;

  return { viewBox, back, stem, body, details, dots, front };
}
