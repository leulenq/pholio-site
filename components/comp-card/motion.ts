import { cubicBezier } from "framer-motion";

import { LIBRARY, type LibraryItem, type Shot } from "./library";

/**
 * The comp-card chapter: her library, understood, made into her card.
 *
 * One take, one set of objects, her own photographs:
 *
 *   1. The library.   Sixty of her photographs are thrown onto the stage
 *                     from outside the frame until they are all there is.
 *   2. Understood.    Every one of them travels to where she is in it: face
 *                     on face, at one size, so the photographs nest by how
 *                     much of her each one holds. The widest lie underneath,
 *                     the tightest on top. The framing's own word crosses
 *                     behind each ring as it forms, one at a time.
 *   3. Reasoned.      The nest is read from the top down, one photograph at
 *                     a time, her face holding still while the sittings
 *                     change around it. Four are kept, each travelling
 *                     straight to its place on the back. The rest leave.
 *   4. Composed.      The last photograph left is the one the whole nest was
 *                     lying on: the front. Her name comes in behind her. The
 *                     back's paper comes in under the four it kept.
 *   5. One card.      The back folds behind the front, and the card is
 *                     handed forward to where the next chapter picks it up.
 *
 * Its physical rules are the stage's (`lessons.md` §17, §18, §26): nothing
 * fades, nothing scales up from nothing, nothing is half there. Every
 * object arrives from outside the frame and leaves through its edge, or is
 * covered. Pholio never makes a photograph here (§49): every picture on the
 * stage is one she already had.
 *
 * Everything is computed in stage pixels from the viewport, per stage kind
 * (`docs/design-language/08-narrow-stage.md`), and everything reads one
 * spring-smoothed timeline `t`, 0..1 across `CARD_VH` of scroll.
 */

export type StageKind = "wide" | "compact";
type Stage<Type> = Record<StageKind, Type>;

// ── Curves ────────────────────────────────────────────────────────────────

/** In fast, settling slow: something landing. */
export const arrive = cubicBezier(0.22, 1, 0.36, 1);
/** One move with two authored ends. */
export const glide = cubicBezier(0.65, 0, 0.35, 1);
/** Away, accelerating, no hesitation: a print taken off the pile. */
export const away = cubicBezier(0.5, 0, 0.85, 0.4);

/** The stage's shared yield on the page's weight (`lessons.md` §45.3). */
export const TIMELINE_SPRING = {
  stiffness: 320,
  damping: 42,
  mass: 1,
  restDelta: 0.0002,
  restSpeed: 0.002,
} as const;

// ── The beat, top to bottom ───────────────────────────────────────────────

export const T = {
  /** The library is thrown in. Starts as the intelligence's last line has
      left; the last print lands at the end. */
  throw: [0.02, 0.125],
  /** Every print is down and the frame is covered: the hero is released. */
  covered: 0.13,
  /** Every print travels to where she is in it. */
  register: [0.145, 0.265],
  /** The four framing words, one after another. */
  terms: [0.148, 0.345],
  /** The nest is read from the top: taken off, or kept. */
  riffle: [0.31, 0.47],
  /** Her name comes in from the left, behind her. */
  name: [0.465, 0.51],
  /** The back's paper slides in under the four it kept. */
  paper: [0.465, 0.515],
  /** The front straightens and is cut to the card. */
  compose: [0.48, 0.53],
  /** The first card's caption comes up from below. */
  caption: [0.52, 0.56],
  /** The camera travels the filmstrip: five more directions, each held. */
  pan: [0.56, 0.885],
  /** The last back folds behind its front. */
  fold: [0.895, 0.945],
  /** The card is handed forward to its rest. */
  rest: [0.925, 0.985],
} as const;

/** How many directions the filmstrip carries, the composed one included. */
export const DESIGN_COUNT = 6;

// ── The card ──────────────────────────────────────────────────────────────

/** A 5.5 x 8.5 in comp card, width over height. */
export const CARD_ASPECT = 5.5 / 8.5;

/** The card's rest: beside the next chapter's opening line, or above it. */
export const READY_X: Stage<string> = { wide: "12vw", compact: "0vw" };
export const READY_Y: Stage<number> = { wide: -2, compact: -44 };
/** [unused first stop, rest] — the rest is what the next chapter reads. */
export const READY_SCALE: Stage<readonly [number, number]> = {
  wide: [1.04, 1.12],
  compact: [1, 1.04],
};
/** Handed forward, held a little off square. Degrees. */
export const READY_TILT = { rotateY: -6, rotateX: 4 } as const;

/**
 * Where the card lies at the end of the chapter, in stage px. The
 * application beat picks it up from exactly here (`components/prepared-for`).
 */
export function cardRest(stage: StageKind, w: number, h: number) {
  const base = w < 640 ? 256 : w < 768 ? 284 : w < 1024 ? 320 : 364;
  const width = base * READY_SCALE[stage][1];
  const height = width / CARD_ASPECT;
  const cx = w / 2 + (parseFloat(READY_X[stage]) / 100) * w;
  const cy = h / 2 + READY_Y[stage];
  return { cx, cy, width, height };
}

/**
 * The back, as fractions of the card's width: a document with pictures in
 * it (`lessons.md` §24). Four portrait cells in one flat grid on a uniform
 * paper margin, then the stats, then the mark and her address.
 */
export const BACK = {
  margin: 28 / 528,
  gutter: 14 / 528,
  cellW: 229 / 528,
  cellH: 327 / 528,
  statsTop: 715 / 528,
  markTop: 766 / 528,
} as const;

/** The four kept, by cell: top left, top right, bottom left, bottom right.
    Beauty, profile, editorial half body, three-quarter on location. Each
    is framed by a landmark (her face at `fy` of the cell), never centre-
    cropped, so the eye lines of the top row agree. */
export const KEPT = [
  { id: "t29xtYbNvLQ", fy: 0.44, zoom: 1 },
  { id: "dMhwMXAvPao", fy: 0.44, zoom: 1 },
  { id: "RZq30SQCTW8", fy: 0.27, zoom: 0.86 },
  { id: "lcOK0Q-72is", fy: 0.2, zoom: 0.92 },
] as const;

/** The frame that leads: the front. The nest lies on it. */
export const HERO_ID = "T6QKnkoltks";

/** The frames the card is made from ship larger, with the figure matte. */
export const cardSrc = (id: string) => `/home/card/${id}.webp`;
export const HERO_FIGURE = `/home/card/${HERO_ID}-figure.webp`;

export const librarySrc = (item: LibraryItem) =>
  KEPT.some((k) => k.id === item.id) || item.id === HERO_ID
    ? cardSrc(item.id)
    : item.lg
      ? `/home/library-lg/${item.id}.webp`
      : `/home/library/${item.id}.webp`;

// ── The words ─────────────────────────────────────────────────────────────

/**
 * pholio-app's own frame taxonomy labels (`frame-taxonomy.js`), widest
 * first, the order the rings form in. Each crosses behind the nest at its
 * own height, climbing her as the framing tightens.
 */
export const TERMS: readonly { label: string; shots: Shot[]; y: number }[] = [
  { label: "Full length", shots: ["full_length"], y: 0.74 },
  { label: "Three-quarter", shots: ["three_quarter", "detail"], y: 0.6 },
  { label: "Half body", shots: ["half_body", "profile", "back"], y: 0.46 },
  { label: "Headshot", shots: ["headshot"], y: 0.32 },
];

/** Term i's window inside `T.terms`: in, held, out, overlapping its
    neighbours only while they are at opposite edges of the frame. */
export function termWindow(i: number): [number, number, number, number] {
  const [a, b] = T.terms;
  const span = (b - a) / (TERMS.length - 0.25);
  const s = a + i * span;
  const e = s + span * 1.25;
  return [s, s + span * 0.42, e - span * 0.36, e];
}

// ── Geometry ──────────────────────────────────────────────────────────────

/** A pose: centre in stage px, scale on the base box, rotation in degrees. */
export type Pose = { x: number; y: number; s: number; r: number };

/** Clip insets as fractions of the box: top, right, bottom, left. */
export type Inset = [number, number, number, number];

export type PrintPlan = {
  item: LibraryItem;
  /** Stacking order in the nest, bottom to top. */
  z: number;
  /** Base box: the photograph's size in the nest. */
  bw: number;
  bh: number;
  off: Pose;
  wall: Pose;
  nest: Pose;
  throwAt: [number, number];
  registerAt: [number, number];
  fate:
    | { kind: "flick"; at: [number, number]; to: Pose }
    | { kind: "keep"; at: [number, number]; to: Pose; crop: Inset }
    | { kind: "hero"; to: Pose; crop: Inset };
};

export type Scene = {
  prints: PrintPlan[];
  /** Her face's point in the nest, and its height. */
  face: { x: number; y: number; f: number };
  /** The spread: the front's centre, the card's size. */
  front: { x: number; y: number };
  back: { x: number; y: number };
  card: { w: number; h: number };
  /** The rest the card is handed forward to. */
  rest: { x: number; y: number; s: number };
  /** Distance between two spreads on the filmstrip. */
  pitch: number;
};

/** A small seeded random, so every visitor sees the same throw. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const GEOMETRY = {
  wide: {
    /** Height of a print on the wall, of the frame. */
    wallH: 0.31,
    cols: 10,
    rows: 6,
    /** The hero's height in the nest, over the card's height. */
    nestOverCard: 1,
  },
  compact: {
    wallH: 0.17,
    cols: 6,
    rows: 10,
    nestOverCard: 1.62,
  },
} as const;

function cropFor(aspect: number, cellAspect: number, cx: number, cy: number, fy: number, zoom: number): Inset {
  // Fractions of the photograph the cell keeps.
  let ch = zoom;
  let cw = (cellAspect * ch) / aspect;
  if (cw > 1) {
    cw = 1;
    ch = aspect / cellAspect;
  }
  const left = Math.min(Math.max(cx - cw / 2, 0), 1 - cw);
  const top = Math.min(Math.max(cy - fy * ch, 0), 1 - ch);
  return [top, 1 - left - cw, 1 - top - ch, left];
}

/** Where a box must stand so that its cropped part fills a target rect. */
function poseForCrop(bw: number, bh: number, crop: Inset, cx: number, cy: number, width: number): Pose {
  const [t, r, b, l] = crop;
  const cw = (1 - l - r) * bw;
  const s = width / cw;
  const ox = ((l + (1 - r)) / 2 - 0.5) * bw * s;
  const oy = ((t + (1 - b)) / 2 - 0.5) * bh * s;
  return { x: cx - ox, y: cy - oy, s, r: 0 };
}

export function buildScene(stage: StageKind, w: number, h: number): Scene {
  const g = GEOMETRY[stage];
  const rest = cardRest(stage, w, h);

  // The spread: front and back side by side, one sheet before it is cut.
  const cardW = stage === "wide" ? rest.width : Math.min(rest.width, (w - 32) / 2);
  const cardH = cardW / CARD_ASPECT;
  const spreadY = rest.cy;
  const front = { x: w / 2 - cardW / 2, y: spreadY };
  const back = { x: w / 2 + cardW / 2, y: spreadY };

  // The nest is laid on the hero. On a wide stage the hero lies exactly
  // where the front will be; on a narrow one it lies larger, at the centre.
  const hero = LIBRARY.find((i) => i.id === HERO_ID)!;
  const heroBH = cardH * g.nestOverCard;
  const heroCX = stage === "wide" ? front.x : w / 2;
  const heroCY = stage === "wide" ? front.y : h * 0.5;
  const [hfx, hfy, hfh] = hero.face!;
  const f = heroBH * hfh;
  const face = {
    x: heroCX + (hfx - 0.5) * heroBH * hero.aspect,
    y: heroCY + (hfy - 0.5) * heroBH,
    f,
  };

  // The wall: a jittered grid a little larger than the frame, its cells
  // dealt in a fixed shuffle so every sitting is spread across it.
  const cells = Array.from({ length: g.cols * g.rows }, (_, i) => i);
  for (let i = cells.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand(i + 7) * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  const wallH = g.wallH * h;
  const spanX = w * 1.06;
  const spanY = h * 1.08;

  const n = LIBRARY.length;
  const [t0, t1] = T.throw;
  const FLIGHT = 0.042;
  const [r0, r1] = T.register;
  const REG = 0.075;

  // The riffle: top of the nest first. A kept print takes a longer slot,
  // so the reading pauses on it.
  const order = LIBRARY.map((_, i) => i).reverse().filter((i) => LIBRARY[i].id !== HERO_ID);
  const KEEP_UNITS = 5;
  const units = order.reduce((u, i) => u + (KEPT.some((k) => k.id === LIBRARY[i].id) ? KEEP_UNITS : 1), 0);
  const [q0, q1] = T.riffle;
  const unit = (q1 - q0 - 0.05) / units;
  const slots = new Map<number, number>();
  let u = 0;
  for (const i of order) {
    slots.set(i, q0 + u * unit);
    u += KEPT.some((k) => k.id === LIBRARY[i].id) ? KEEP_UNITS : 1;
  }

  const cellW = BACK.cellW * cardW;
  const cellH = BACK.cellH * cardW;
  const cellAspect = BACK.cellW / BACK.cellH;
  const cellCentre = (k: number) => {
    const col = k % 2;
    const row = Math.floor(k / 2);
    const left = back.x - cardW / 2 + BACK.margin * cardW + col * (cellW + BACK.gutter * cardW);
    const top = back.y - cardH / 2 + BACK.margin * cardW + row * (cellH + BACK.gutter * cardW);
    return { x: left + cellW / 2, y: top + cellH / 2 };
  };

  const prints: PrintPlan[] = LIBRARY.map((item, z) => {
    // Base box: the photograph at the nest's one face size.
    let bh: number;
    let nest: Pose;
    const jitter = item.id === HERO_ID ? -1.2 : (rand(z * 3 + 1) - 0.5) * 3.2;
    if (item.face) {
      const [cx, cy, fh] = item.face;
      bh = f / fh;
      const bw = bh * item.aspect;
      nest = { x: face.x + (0.5 - cx) * bw, y: face.y + (0.5 - cy) * bh, s: 1, r: jitter };
    } else {
      const [px, py, ph] = item.place!;
      bh = ph * f;
      nest = { x: face.x + px * f, y: face.y + py * f, s: 1, r: jitter * 2 };
    }
    const bw = bh * item.aspect;

    // On the wall.
    const cell = cells[z % cells.length];
    const col = cell % g.cols;
    const row = Math.floor(cell / g.cols);
    const wall: Pose = {
      x: (w - spanX) / 2 + ((col + 0.5) / g.cols) * spanX + (rand(z + 101) - 0.5) * 0.25 * (spanX / g.cols),
      y: (h - spanY) / 2 + ((row + 0.5) / g.rows) * spanY + (rand(z + 202) - 0.5) * 0.25 * (spanY / g.rows),
      s: wallH / bh,
      r: (rand(z + 303) - 0.5) * 11,
    };

    // Thrown from outside the frame, along the line from the centre.
    let dx = wall.x - w / 2;
    let dy = wall.y - h / 2;
    const len = Math.hypot(dx, dy);
    if (len < 40) {
      const a = rand(z + 404) * Math.PI * 2;
      dx = Math.cos(a);
      dy = Math.sin(a);
    } else {
      dx /= len;
      dy /= len;
    }
    const reach = Math.max(w, h) * 1.15;
    const off: Pose = {
      x: wall.x + dx * reach,
      y: wall.y + dy * reach,
      s: wall.s * 1.4,
      r: wall.r + dx * 28,
    };

    const k = z / (n - 1);
    const ts = t0 + (t1 - t0 - FLIGHT) * Math.pow(k, 0.62);
    const throwAt: [number, number] = [ts, ts + FLIGHT];
    const rs = r0 + (r1 - r0 - REG) * k;
    const registerAt: [number, number] = [rs, rs + REG];

    let fate: PrintPlan["fate"];
    const kept = KEPT.findIndex((kp) => kp.id === item.id);
    if (item.id === HERO_ID) {
      const crop: Inset = [0, (1 - CARD_ASPECT / item.aspect) / 2, 0, (1 - CARD_ASPECT / item.aspect) / 2];
      fate = { kind: "hero", crop, to: poseForCrop(bw, bh, crop, front.x, front.y, cardW) };
    } else if (kept >= 0) {
      const kp = KEPT[kept];
      const [cx, cy] = item.face!;
      const crop = cropFor(item.aspect, cellAspect, cx, cy, kp.fy, kp.zoom);
      const c = cellCentre(kept);
      const at = slots.get(z)!;
      fate = { kind: "keep", at: [at, at + unit * KEEP_UNITS + 0.02], crop, to: poseForCrop(bw, bh, crop, c.x, c.y, cellW) };
    } else {
      // Taken off the pile: up and out through the top of the frame,
      // to whichever side it lies.
      const side = nest.x + (rand(z + 505) - 0.5) * bw * 0.6 < face.x ? -1 : 1;
      const at = slots.get(z)!;
      fate = {
        kind: "flick",
        at: [at, at + 0.04],
        to: {
          x: nest.x + side * (w * 0.28 + bw * 0.3),
          y: -bh * 0.62 - h * 0.12,
          s: 1.04,
          r: nest.r + side * (10 + rand(z + 606) * 14),
        },
      };
    }

    return { item, z, bw, bh, off, wall, nest, throwAt, registerAt, fate };
  });

  return {
    prints,
    face,
    front,
    back,
    card: { w: cardW, h: cardH },
    rest: { x: rest.cx, y: rest.cy, s: rest.width / cardW },
    pitch: (w + cardW * 2) / 2 + w * 0.06,
  };
}

// ── Interpolation ─────────────────────────────────────────────────────────

export function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Progress of `t` through [a, b], eased. */
export function phase(t: number, [a, b]: readonly [number, number], ease: (v: number) => number = glide) {
  return ease(clamp01((t - a) / (b - a)));
}

export function mix(a: number, b: number, p: number) {
  return a + (b - a) * p;
}

export function mixPose(a: Pose, b: Pose, p: number): Pose {
  return { x: mix(a.x, b.x, p), y: mix(a.y, b.y, p), s: mix(a.s, b.s, p), r: mix(a.r, b.r, p) };
}

/** A print's own pose at `t`, before the fold and the hand-forward. */
export function printPose(plan: PrintPlan, t: number): Pose {
  let pose = mixPose(plan.off, plan.wall, phase(t, plan.throwAt, arrive));
  pose = mixPose(pose, plan.nest, phase(t, plan.registerAt, glide));
  const fate = plan.fate;
  if (fate.kind === "flick") return mixPose(pose, fate.to, phase(t, fate.at, away));
  if (fate.kind === "keep") return mixPose(pose, fate.to, phase(t, fate.at, glide));
  return mixPose(pose, fate.to, phase(t, T.compose, glide));
}

/** How much of the cell crop a print has taken on at `t`. */
export function cropAt(plan: PrintPlan, t: number): Inset {
  const fate = plan.fate;
  if (fate.kind === "flick") return [0, 0, 0, 0];
  const p = fate.kind === "keep" ? phase(t, fate.at, glide) : phase(t, T.compose, glide);
  return fate.crop.map((v) => v * p) as Inset;
}

/** How far the filmstrip has travelled at `t`, px: one pitch per step,
    each step a single move and a hold. */
export function panAt(scene: Scene, t: number) {
  const [a, b] = T.pan;
  const steps = DESIGN_COUNT - 1;
  const step = (b - a) / steps;
  let x = 0;
  for (let k = 0; k < steps; k += 1) {
    const s = a + k * step;
    x += phase(t, [s, s + step * 0.58], glide);
  }
  return x * scene.pitch;
}

/** Perspective for the fold and the hand-forward, px. */
export const PERSPECTIVE = 1600;

/**
 * The hand-forward: the whole spread carried from where it was made to the
 * card's rest, held off square. Applied before every card element's own
 * transform, with transform-origin at the stage's top left.
 */
export function restTransform(scene: Scene, t: number) {
  const p = phase(t, T.rest, glide);
  if (p <= 0) return "";
  const { front, rest } = scene;
  const x = mix(front.x, rest.x, p);
  const y = mix(front.y, rest.y, p);
  const s = mix(1, rest.s, p);
  return `translate(${x}px, ${y}px) perspective(${PERSPECTIVE}px) rotateX(${READY_TILT.rotateX * p}deg) rotateY(${READY_TILT.rotateY * p}deg) scale(${s}) translate(${-front.x}px, ${-front.y}px) `;
}

/** The fold: the back turns on the hinge it shares with the front, away
    from you, and lies behind it. */
export function foldTransform(scene: Scene, t: number) {
  const p = phase(t, T.fold, glide);
  if (p <= 0) return "";
  const hx = scene.front.x + scene.card.w / 2;
  const hy = scene.front.y;
  return `translate(${hx}px, ${hy}px) perspective(${PERSPECTIVE}px) rotateY(${180 * p}deg) translate(${-hx}px, ${-hy}px) `;
}

export function poseTransform(pose: Pose, bw: number, bh: number) {
  return `translate(${pose.x}px, ${pose.y}px) rotate(${pose.r}deg) scale(${pose.s}) translate(${-bw / 2}px, ${-bh / 2}px)`;
}
