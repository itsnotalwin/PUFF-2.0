import type { EdgeShape } from "@/lib/liquid";

export const INK = "#0b0b0b";
export const CREAM = "#f3f1ec";

/** Hero floor: ink rising with tall round-headed fingers at the sides */
export const HERO_EDGE: EdgeShape = {
  height: 320,
  base: 112,
  waves: [
    { amp: 14, len: 720, speed: 0.45 },
    { amp: 7, len: 300, speed: -0.7, phase: 1.3 },
  ],
  lobes: [
    { x: 0.5, w: 300, h: -48, vary: 0.12, speed: 0.5 },
    { x: 0.21, w: 110, h: 56, speed: 0.7, phase: 0.4 },
    { x: 0.79, w: 120, h: 64, speed: 0.6, phase: 2.1 },
    { x: 0.35, w: 70, h: 22, speed: 0.9, phase: 1.1 },
    { x: 0.66, w: 70, h: 26, speed: 0.8, phase: 3.0 },
  ],
  drips: [
    { x: 0.045, w: 52, neck: 24, bulb: 36, len: 168, speed: 0.55, vary: 0.12 },
    { x: 0.955, w: 56, neck: 26, bulb: 40, len: 178, speed: 0.5, vary: 0.12, phase: 1.7 },
    { x: 0.135, w: 26, neck: 10, bulb: 16, len: 78, speed: 0.9, phase: 0.8 },
    { x: 0.87, w: 28, neck: 11, bulb: 17, len: 86, speed: 0.8, phase: 2.5 },
    { x: 0.42, w: 22, neck: 8, bulb: 13, len: 40, speed: 1.1, phase: 1.9 },
    { x: 0.585, w: 22, neck: 8, bulb: 12, len: 36, speed: 1.0, phase: 0.2 },
  ],
  dots: [
    { x: 0.1, y: 150, r: 15, bob: 9, speed: 0.8 },
    { x: 0.905, y: 160, r: 19, bob: 10, speed: 0.6, phase: 1 },
    { x: 0.3, y: 105, r: 7, bob: 7, speed: 1.1, phase: 2 },
    { x: 0.72, y: 120, r: 9, bob: 8, speed: 0.9, phase: 0.6 },
  ],
};

/** Bottom of the menu: cream rising into ink with cream bubbles (like the poster) */
export const MENU_EDGE: EdgeShape = {
  height: 270,
  base: 95,
  waves: [
    { amp: 12, len: 640, speed: 0.5 },
    { amp: 6, len: 280, speed: -0.8, phase: 2 },
  ],
  lobes: [
    { x: 0.3, w: 140, h: 40, speed: 0.6 },
    { x: 0.7, w: 160, h: 34, speed: 0.5, phase: 1.4 },
    { x: 0.52, w: 90, h: -20, speed: 0.7 },
  ],
  drips: [
    { x: 0.075, w: 42, neck: 18, bulb: 28, len: 140, speed: 0.6, vary: 0.14 },
    { x: 0.18, w: 24, neck: 9, bulb: 14, len: 60, speed: 0.9, phase: 1 },
    { x: 0.46, w: 26, neck: 10, bulb: 15, len: 70, speed: 0.8, phase: 2.2 },
    { x: 0.84, w: 30, neck: 12, bulb: 19, len: 95, speed: 0.7, phase: 0.6 },
    { x: 0.94, w: 44, neck: 20, bulb: 30, len: 150, speed: 0.55, phase: 2.8 },
  ],
  dots: [
    { x: 0.035, y: 138, r: 14, bob: 9 },
    { x: 0.13, y: 108, r: 9, bob: 7, phase: 1.5 },
    { x: 0.6, y: 120, r: 11, bob: 8, phase: 0.7 },
    { x: 0.89, y: 140, r: 13, bob: 9, phase: 2.2 },
  ],
};

/** Cream dripping into the ink calculator section */
export const CREAM_DRIPS: EdgeShape = {
  height: 230,
  base: 60,
  waves: [
    { amp: 10, len: 560, speed: 0.5 },
    { amp: 5, len: 240, speed: -0.9, phase: 1 },
  ],
  lobes: [
    { x: 0.25, w: 120, h: 22 },
    { x: 0.66, w: 140, h: 28, phase: 1.2 },
  ],
  drips: [
    { x: 0.07, w: 26, neck: 8, bulb: 13, len: 70, speed: 0.8 },
    { x: 0.16, w: 32, neck: 10, bulb: 16, len: 110, detach: true, period: 5.2 },
    { x: 0.31, w: 22, neck: 7, bulb: 11, len: 50, speed: 1.0, phase: 2 },
    { x: 0.43, w: 34, neck: 11, bulb: 17, len: 130, detach: true, period: 6.4, phase: 2.3 },
    { x: 0.55, w: 20, neck: 6, bulb: 10, len: 45, speed: 1.1, phase: 1 },
    { x: 0.71, w: 30, neck: 10, bulb: 15, len: 100, detach: true, period: 4.8, phase: 1.1 },
    { x: 0.83, w: 22, neck: 7, bulb: 11, len: 60, speed: 0.9, phase: 0.4 },
    { x: 0.93, w: 30, neck: 10, bulb: 15, len: 95, detach: true, period: 5.8, phase: 3.4 },
  ],
  holes: [
    { x: 0.36, y: -28, r: 8 },
    { x: 0.6, y: -24, r: 10, phase: 1 },
  ],
  dots: [
    { x: 0.25, y: 120, r: 7, bob: 10, phase: 0.4 },
    { x: 0.78, y: 140, r: 9, bob: 12, phase: 2 },
  ],
};

/** Ink dripping into the cream FAQ section */
export const INK_DRIPS: EdgeShape = {
  height: 240,
  base: 56,
  waves: [
    { amp: 9, len: 600, speed: 0.55, phase: 2 },
    { amp: 5, len: 230, speed: -0.8 },
  ],
  lobes: [
    { x: 0.18, w: 130, h: 26, phase: 0.5 },
    { x: 0.56, w: 150, h: 20, phase: 2 },
    { x: 0.86, w: 110, h: 24, phase: 1 },
  ],
  drips: [
    { x: 0.05, w: 24, neck: 7, bulb: 12, len: 60, speed: 0.9 },
    { x: 0.12, w: 34, neck: 11, bulb: 17, len: 125, detach: true, period: 5.6, phase: 0.6 },
    { x: 0.27, w: 22, neck: 7, bulb: 11, len: 55, speed: 1.0, phase: 1.3 },
    { x: 0.37, w: 30, neck: 10, bulb: 15, len: 100, detach: true, period: 6.2, phase: 3.1 },
    { x: 0.5, w: 22, neck: 7, bulb: 10, len: 48, speed: 1.1, phase: 2.2 },
    { x: 0.64, w: 34, neck: 11, bulb: 17, len: 135, detach: true, period: 5, phase: 1.7 },
    { x: 0.77, w: 22, neck: 7, bulb: 11, len: 58, speed: 0.95, phase: 0.3 },
    { x: 0.9, w: 30, neck: 10, bulb: 15, len: 105, detach: true, period: 6.8, phase: 4.2 },
  ],
  holes: [
    { x: 0.22, y: -26, r: 8 },
    { x: 0.7, y: -22, r: 10, phase: 2 },
  ],
  dots: [{ x: 0.45, y: 150, r: 6, bob: 10, phase: 1.2 }],
};

/** Footer: ink rising again with fingers + floating drops */
export const FOOTER_EDGE: EdgeShape = {
  height: 300,
  base: 100,
  waves: [
    { amp: 13, len: 680, speed: 0.4, phase: 2 },
    { amp: 6, len: 260, speed: -0.75 },
  ],
  lobes: [
    { x: 0.32, w: 150, h: 46, speed: 0.6, phase: 1 },
    { x: 0.62, w: 120, h: 30, speed: 0.7 },
    { x: 0.5, w: 60, h: -14 },
  ],
  drips: [
    { x: 0.07, w: 46, neck: 21, bulb: 32, len: 150, speed: 0.5, vary: 0.13 },
    { x: 0.17, w: 24, neck: 9, bulb: 14, len: 64, speed: 0.9, phase: 2 },
    { x: 0.47, w: 26, neck: 10, bulb: 15, len: 72, speed: 0.8, phase: 1.1 },
    { x: 0.8, w: 30, neck: 12, bulb: 19, len: 100, speed: 0.7, phase: 0.5 },
    { x: 0.93, w: 50, neck: 23, bulb: 36, len: 172, speed: 0.55, phase: 2.6 },
  ],
  dots: [
    { x: 0.12, y: 140, r: 13, bob: 9, phase: 0.3 },
    { x: 0.4, y: 112, r: 7, bob: 7, phase: 1.6 },
    { x: 0.86, y: 150, r: 16, bob: 10, phase: 2.4 },
  ],
};

/** Gate curtain top edge while draining */
export const GATE_EDGE: EdgeShape = {
  height: 240,
  base: 50,
  waves: [
    { amp: 16, len: 520, speed: 1.4 },
    { amp: 8, len: 220, speed: -1.8, phase: 1 },
  ],
  lobes: [
    { x: 0.3, w: 140, h: 50, speed: 1.5 },
    { x: 0.72, w: 160, h: 60, speed: 1.2, phase: 2 },
  ],
  drips: [
    { x: 0.1, w: 40, neck: 16, bulb: 26, len: 150, speed: 1.6 },
    { x: 0.5, w: 34, neck: 13, bulb: 22, len: 110, speed: 1.9, phase: 1 },
    { x: 0.88, w: 44, neck: 18, bulb: 30, len: 170, speed: 1.4, phase: 2.2 },
  ],
  dots: [
    { x: 0.2, y: 150, r: 12, bob: 14, speed: 2 },
    { x: 0.64, y: 170, r: 16, bob: 16, speed: 1.6, phase: 1 },
  ],
};
