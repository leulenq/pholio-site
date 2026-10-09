import { cubicBezier } from "framer-motion";

import { READY_SCALE, READY_X, READY_Y } from "@/components/comp-card/motion";
import { APPLY_OVERRUN_VH, APPLY_VH } from "@/components/hero/motion";

/**
 * Tunable keyframes and data for the home stage's application beat, the
 * fourth timeline of the pinned stage: after the comp card, before Studio+.
 *
 * **One thing happens: the destination changes, and the same work takes the
 * shape that destination asks for.** The beat inherits the card the previous
 * chapter handed forward, at rest on the velvet, and treats it as what it is:
 * one piece of her work. Her digitals come up from below and the card
 * recedes among them; that spread is the body of work. Then an agency's name
 * takes the top of the frame and the work re-sorts into that agency's order
 * and count, with what it did not ask for set aside at the margin, and one
 * line under the row says who prepares the files and who sends them. Three
 * agencies that take applications on their own site or by email, which the
 * address says in its second line. The card leaves with the last of them,
 * up and out as itself, and the last destination is Pholio: the digitals
 * gather into one packet, alone, and the packet is sent. The send is the
 * transition: the beat's timeline runs on into the Studio+ beat, and the
 * prints fan out and rise through the room as its light comes up
 * (`components/studio-site/motion.ts`), out through the top of the frame.
 *
 * Every destination is a real entry in the register (`/agencies`), read
 * from the agency's own page. The words under the prints are the agency's
 * own shot names. Nothing else is written on the stage but the small print
 * that says so and that Pholio is not affiliated (`lessons.md` §43).
 *
 * Every stage value is authored twice (`docs/design-language/08-narrow-stage.md`).
 */

export type StageKind = "wide" | "compact";
export type Stage<T> = { readonly wide: T; readonly compact: T };

// ── Curves ────────────────────────────────────────────────────────────────

/** In fast, settling slow: a print sliding into its place. */
export const arrive = cubicBezier(0.22, 1, 0.36, 1);
/** A line leaving the stage: away quickly, no hesitation. */
export const leave = cubicBezier(0.55, 0, 0.8, 0.4);
/** One ease for a move with two authored ends: the card receding. */
export const glide = cubicBezier(0.65, 0, 0.35, 1);

/** The same yield the rest of the stage reads, on the page's weight (`lessons.md` §45.3). */
export const TIMELINE_SPRING = {
  stiffness: 320,
  damping: 42,
  mass: 1,
  restDelta: 0.0002,
  restSpeed: 0.002,
} as const;

// ── Scroll ────────────────────────────────────────────────────────────────

/**
 * The beat, read top to bottom, as [start, end] of its timeline: `t` in
 * 0..1 across `APPLY_VH` plus `APPLY_OVERRUN_VH` of scroll
 * (`components/hero/motion.ts`). The phases are authored against the
 * beat's own scroll; `own` rebases them onto the longer timeline so the
 * Studio+ start falls exactly at `own(1)`.
 */
const own = (t: number) => (t * APPLY_VH) / (APPLY_VH + APPLY_OVERRUN_VH);

export const T = {
  /** The card recedes into the spread; the prints come up from below. */
  gather: [own(0.07), own(0.19)],
  /** The spread becomes the first agency's row. */
  form: [own(0.29), own(0.4)],
  /** The address changes: one agency's shape to the next. */
  moves: [
    [own(0.48), own(0.57)],
    [own(0.64), own(0.73)],
    [own(0.8), own(0.89)],
  ],
  /** Sent: the packet fans out and rises through the lighting room. */
  exit: [own(0.95), 1],
} as const;

/**
 * The opening's two lines, timed per stage: a wide frame holds both at once,
 * one each side of the work; a phone has one band above the work and shows
 * them one after the other.
 */
export const LINES_T: Stage<{
  aIn: readonly [number, number];
  aOut: readonly [number, number];
  bIn: readonly [number, number];
  bOut: readonly [number, number];
}> = {
  wide: { aIn: [0, own(0.07)], aOut: [own(0.27), own(0.33)], bIn: [own(0.15), own(0.22)], bOut: [own(0.28), own(0.34)] },
  compact: { aIn: [0, own(0.07)], aOut: [own(0.14), own(0.19)], bIn: [own(0.19), own(0.25)], bOut: [own(0.28), own(0.34)] },
};

/** Within a move, the words leave first and arrive last; the work re-sorts in between. */
export const SWAP = { out: 0.42, in: 0.5 } as const;

/** Prints start their travel one after another, in row order. */
export const PRINT_STAGGER = 0.04;

// ── Fields ────────────────────────────────────────────────────────────────

export const VELVET = "#050505";
export const CREAM = "#FAF7F2";
export const CREAM_SOFT = "rgba(250, 247, 242, 0.66)";
export const CREAM_QUIET = "rgba(250, 247, 242, 0.46)";
export const GOLD = "#C9A55A";

// ── The frames ────────────────────────────────────────────────────────────

/**
 * One person, one sitting: her eight plain frames, and the card is hers
 * too. Width and height are the source's, so every print keeps its own
 * proportion at a shared height: a digital is framed, never cropped to a
 * cell. The set is the owner's decision for this beat (`lessons.md` §41).
 */
export type Role =
  | "fullLength"
  | "fullLengthProfile"
  | "portraitLength"
  | "waistUp"
  | "closeUp"
  | "closeUpProfile"
  | "closeUpHairDown"
  | "personality";

export const ROLES: readonly Role[] = [
  "fullLength",
  "fullLengthProfile",
  "portraitLength",
  "waistUp",
  "closeUp",
  "closeUpProfile",
  "closeUpHairDown",
  "personality",
];

/** Everything the beat moves: the card and the eight prints. */
export type Piece = Role | "card";
export const PIECES: readonly Piece[] = ["card", ...ROLES];

export interface Frame {
  src: string;
  w: number;
  h: number;
  alt: string;
}

export const FRAMES: Record<Role, Frame> = {
  fullLength: { src: "/prepared-for/full-length.jpg", w: 1200, h: 1810, alt: "Digital, full length" },
  fullLengthProfile: {
    src: "/prepared-for/full-length-profile.jpg",
    w: 1200,
    h: 1810,
    alt: "Digital, full length, in movement",
  },
  portraitLength: {
    src: "/prepared-for/portrait-length.jpg",
    w: 1200,
    h: 1810,
    alt: "Digital, three-quarter",
  },
  waistUp: { src: "/prepared-for/waist-up.jpg", w: 1200, h: 1810, alt: "Digital, waist up" },
  closeUp: { src: "/prepared-for/close-up.jpg", w: 1200, h: 1810, alt: "Digital, headshot" },
  closeUpProfile: {
    src: "/prepared-for/close-up-profile.jpg",
    w: 1200,
    h: 1798,
    alt: "Black and white close portrait",
  },
  closeUpHairDown: {
    src: "/prepared-for/close-up-hair-down.jpg",
    w: 1200,
    h: 1810,
    alt: "Digital, waist up, hands at hips",
  },
  personality: { src: "/prepared-for/personality.jpg", w: 1200, h: 1810, alt: "Digital, personality" },
};

// ── The words ─────────────────────────────────────────────────────────────

/** The opening, in two lines set against the work. `verdict` is the gold word. */
export const LINES = {
  a: { before: "The work\nstays the same.", verdict: "", after: "" },
  b: { before: "The application\n", verdict: "doesn't", after: "." },
} as const;

/** The last destination's name is the mark, not the word typed again (`lessons.md` §14.1). */
export const PHOLIO = {
  before: "Through ",
  mark: "PHOLIO",
} as const;

/** Under every agency: where the words came from, and what Pholio is not. */
export const DISCLOSURE =
  "Requirements as published on each agency's own page. Pholio is not affiliated with any agency named here.";

// ── The destinations ──────────────────────────────────────────────────────

export interface Ask {
  role: Role;
  /** The agency's own shot name, from its published page. */
  label: string;
  /** The slot as the export names it: `<organization>-<slot>.jpg`. */
  slot: string;
}

export interface Destination {
  id: "elite" | "one" | "muse";
  /** The register's series id, for `/agencies/<seriesId>`. */
  seriesId: string;
  name: string;
  /** The organization id the export slugs file names with. */
  organization: string;
  /**
   * Where the application continues, as the address's second line: the one
   * fact the composition cannot show. "On their own site." is the agency's
   * web form; "By email." its inbox. Both are the register's channel.
   */
  channel: string;
  asks: readonly Ask[];
}

/**
 * Three real entries, chosen because they ask for the most different shapes:
 * six shots, four shots under a hard size cap, three shots by email. Shot
 * names, counts, file rules and channels are the register's
 * (`pholio-app/data/spec-registry/v1/specs/`), verbatim where the agency
 * wrote a name and tidied only where it wrote a sentence.
 */
export const DESTINATIONS: readonly Destination[] = [
  {
    id: "elite",
    seriesId: "elite-models-na:online-general",
    name: "Elite Models",
    organization: "elite-models",
    channel: "On their own site.",
    asks: [
      { role: "fullLength", label: "Full length", slot: "full-length" },
      { role: "fullLengthProfile", label: "Full length profile", slot: "full-length-profile" },
      { role: "portraitLength", label: "Portrait length", slot: "portrait-length" },
      { role: "closeUp", label: "Close up, hair pulled back", slot: "close-up-hair-pulled-back" },
      {
        role: "closeUpProfile",
        label: "Close up profile, hair pulled back",
        slot: "close-up-profile-hair-pulled-back",
      },
      { role: "personality", label: "Personality pic", slot: "personality-pic" },
    ],
  },
  {
    id: "one",
    seriesId: "one-management:online",
    name: "ONE Management",
    organization: "one-management",
    channel: "On their own site.",
    asks: [
      { role: "fullLength", label: "Full Length", slot: "full-length" },
      { role: "waistUp", label: "Waist Up", slot: "waist-up" },
      { role: "closeUp", label: "Close Up", slot: "close-up" },
      { role: "closeUpProfile", label: "Profile", slot: "profile" },
    ],
  },
  {
    id: "muse",
    seriesId: "muse-model-management-nyc:email",
    name: "Muse Model Management",
    organization: "muse-model-management",
    channel: "By email.",
    asks: [
      { role: "closeUp", label: "Close ups, hair up", slot: "close-ups-hair-up" },
      { role: "closeUpHairDown", label: "Close ups, hair down", slot: "close-ups-hair-down" },
      { role: "fullLength", label: "Full length", slot: "full-length" },
    ],
  },
];

/** The file the export writes for one slot. */
export const fileName = (destination: Destination, ask: Ask) =>
  `${destination.organization}-${ask.slot}.jpg`;

// ── Geometry ──────────────────────────────────────────────────────────────

/**
 * The stage's geometry, in fractions of the frame unless noted.
 *
 * `spread` is the body of work: the card and the eight prints in rows,
 * bottom-aligned on the first row so the taller card stands among the
 * prints. `row` is the band an agency's asked-for prints stand in. `aside`
 * is where the rest is set: the first piece with `visible` of its width on
 * the paper and the rest past the right edge, each further one a `step` in
 * and a `drop` down, behind the one before, at `scale`. `stack` is the
 * packet the digitals gather into for Pholio: centred at `cx`, `cy`, each
 * print `step` px behind and below the one before, at `scale` of its row
 * size. `fan` is the send: the prints spread across the frame between
 * `left` and `right` as they rise, at `scale`, the top of the frame `clear`
 * above them at the end. `lines` is the opening's two lines; `address` the name at the top,
 * with `channel` the size of its second line in em of the name; `caption`
 * the agency's shot name under a print.
 */
export interface Geometry {
  margin: number;
  spread: { print: number; card: number; baseline: number; rowGap: number; gap: number; perRow: number };
  row: { top: number; height: number; gap: number; rows: number };
  aside: { visible: number; top: number; step: number; scale: number; drop: number };
  stack: { cx: number; cy: number; step: number; scale: number };
  fan: { left: number; right: number; scale: number; clear: number };
  lines: { top: number; size: string; max: number };
  address: { top: number; size: string; max: number; channel: number };
  caption: { gap: number; size: number; lead: number };
  disclosure: { bottom: number; size: number; max: number };
}

export const GEOMETRY: Stage<Geometry> = {
  wide: {
    margin: 0.06,
    spread: { print: 0.22, card: 0.28, baseline: 0.62, rowGap: 0.04, gap: 20, perRow: 5 },
    row: { top: 0.31, height: 0.31, gap: 22, rows: 1 },
    aside: { visible: 0.62, top: 0.38, step: 0.028, scale: 0.56, drop: 0.012 },
    stack: { cx: 0.5, cy: 0.58, step: 7, scale: 1.1 },
    fan: { left: 0.04, right: 0.96, scale: 1.3, clear: 0.2 },
    lines: { top: 0.08, size: "4.6vw", max: 0.4 },
    address: { top: 0.09, size: "5.4vw", max: 0.84, channel: 0.34 },
    caption: { gap: 12, size: 12, lead: 1.35 },
    disclosure: { bottom: 0.045, size: 11.5, max: 0.3 },
  },
  compact: {
    margin: 0.06,
    spread: { print: 0.13, card: 0.17, baseline: 0.47, rowGap: 0.03, gap: 8, perRow: 3 },
    row: { top: 0.27, height: 0.18, gap: 10, rows: 2 },
    aside: { visible: 0.62, top: 0.1, step: 0.035, scale: 0.34, drop: 0.014 },
    stack: { cx: 0.5, cy: 0.56, step: 5, scale: 1.3 },
    fan: { left: -0.1, right: 1.1, scale: 1.4, clear: 0.2 },
    lines: { top: 0.095, size: "8.4vw", max: 0.9 },
    address: { top: 0.105, size: "8.4vw", max: 0.66, channel: 0.4 },
    caption: { gap: 8, size: 10.5, lead: 1.3 },
    disclosure: { bottom: 0.03, size: 10, max: 1 },
  },
};

/**
 * The card as the previous chapter left it: its rest, read off the comp-card
 * beat's own constants (`READY_X`, `READY_Y`, `READY_SCALE`, and the card's
 * width classes in `components/comp-card/index.tsx`), so the beat picks it
 * up exactly where it lies.
 */
export function cardRest(stage: StageKind, w: number, h: number) {
  const base = w < 640 ? 256 : w < 768 ? 284 : w < 1024 ? 320 : 364;
  const width = base * READY_SCALE[stage][1];
  const height = (width * 8.5) / 5.5;
  const cx = w / 2 + (parseFloat(READY_X[stage]) / 100) * w;
  const cy = h / 2 + READY_Y[stage];
  return { cx, cy, width, height };
}

export interface Placement {
  /** Top-left of the piece's scaled box, in px from the stage's top-left. */
  x: number;
  y: number;
  /** The piece's base size, before `scale`. */
  width: number;
  height: number;
  scale: number;
  z: number;
}

/** The base size of a print: its size in an agency's row. */
export function printBase(role: Role, stage: StageKind, h: number) {
  const g = GEOMETRY[stage];
  const frame = FRAMES[role];
  const height = g.row.height * h;
  return { width: (height * frame.w) / frame.h, height };
}

export type Pose = "rest" | "spread" | "elite" | "one" | "muse" | "pholio" | "sent";

/** Where every piece stands in one pose. */
export function placements(pose: Pose, stage: StageKind, w: number, h: number): Record<Piece, Placement> {
  const g = GEOMETRY[stage];
  const margin = g.margin * w;
  const rest = cardRest(stage, w, h);
  const out = {} as Record<Piece, Placement>;
  const cardAtRest: Placement = {
    x: rest.cx - rest.width / 2,
    y: rest.cy - rest.height / 2,
    width: rest.width,
    height: rest.height,
    scale: 1,
    z: 0,
  };

  // The card, gone: straight up from where the last agency set it aside,
  // out through the top of the frame, as itself.
  const asideH = g.row.height * h * g.aside.scale;
  const cardAway: Placement = {
    ...cardAtRest,
    x: w - ((rest.width * asideH) / rest.height) * g.aside.visible,
    y: -asideH - 0.1 * h,
    scale: asideH / rest.height,
  };

  if (pose === "pholio") {
    // The packet: every print gathered into one pile, alone on the stage.
    // The first print is on top.
    const st = g.stack;
    ROLES.forEach((role, i) => {
      const base = printBase(role, stage, h);
      out[role] = {
        x: st.cx * w - (base.width * st.scale) / 2 + i * st.step,
        y: st.cy * h - (base.height * st.scale) / 2 + i * st.step,
        width: base.width,
        height: base.height,
        scale: st.scale,
        z: 12 - i,
      };
    });
    out.card = cardAway;
    return out;
  }

  if (pose === "spread" || pose === "rest" || pose === "sent") {
    // The body of work. Rows of `perRow` pieces, the card first; the first
    // row is bottom-aligned on a baseline so the taller card stands in it.
    const printH = g.spread.print * h;
    const cardH = g.spread.card * h;
    let x = margin;
    let row = 0;
    let index = 0;
    const rowTop = (r: number) =>
      r === 0 ? g.spread.baseline * h - printH : g.spread.baseline * h + r * (printH + g.spread.rowGap * h) - printH;
    PIECES.forEach((piece) => {
      if (index > 0 && index % g.spread.perRow === 0) {
        row += 1;
        x = margin;
      }
      if (piece === "card") {
        const width = (cardH * 5.5) / 8.5;
        out.card = {
          x,
          y: g.spread.baseline * h - cardH,
          width: rest.width,
          height: rest.height,
          scale: cardH / rest.height,
          z: 6,
        };
        x += width + g.spread.gap;
      } else {
        const base = printBase(piece, stage, h);
        const scale = printH / base.height;
        out[piece] = { x, y: rowTop(row), width: base.width, height: base.height, scale, z: 6 };
        x += base.width * scale + g.spread.gap;
      }
      index += 1;
    });
    if (pose === "rest") {
      // Below the stage before they arrive, at their spread x; the card at rest.
      ROLES.forEach((role) => {
        out[role] = { ...out[role], y: h + 0.06 * h };
      });
      out.card = cardAtRest;
    }
    if (pose === "sent") {
      // Sent: the packet fans out across the frame as it rises, each print
      // a little larger as it comes toward the lens, and out through the top.
      const fan = g.fan;
      const n = ROLES.length;
      ROLES.forEach((role, i) => {
        const base = printBase(role, stage, h);
        const cx = (fan.left + ((fan.right - fan.left) * (i + 0.5)) / n) * w;
        out[role] = {
          x: cx - (base.width * fan.scale) / 2,
          y: -base.height * fan.scale - fan.clear * h,
          width: base.width,
          height: base.height,
          scale: fan.scale,
          z: 12 - i,
        };
      });
      out.card = cardAway;
    }
    return out;
  }

  // An agency's row, and the rest set aside.
  const destination = DESTINATIONS.find((d) => d.id === pose)!;
  const rowH = g.row.height * h;
  const count = destination.asks.length;
  const perRow = count <= 3 ? count : Math.ceil(count / g.row.rows);
  const captionBand = g.caption.gap + g.caption.size * g.caption.lead * 2 + 6;
  let x = margin;
  let rowIndex = 0;
  destination.asks.forEach((ask, i) => {
    if (i > 0 && i % perRow === 0) {
      rowIndex += 1;
      x = margin;
    }
    const base = printBase(ask.role, stage, h);
    out[ask.role] = {
      x,
      y: g.row.top * h + rowIndex * (rowH + captionBand),
      width: base.width,
      height: base.height,
      scale: 1,
      z: 10,
    };
    x += base.width + g.row.gap;
  });

  const asked = new Set<Piece>(destination.asks.map((a) => a.role));
  PIECES.filter((piece) => !asked.has(piece)).forEach((piece, i) => {
    const base = piece === "card" ? { width: rest.width, height: rest.height } : printBase(piece, stage, h);
    const scale = asideH / base.height;
    const scaled = base.width * scale;
    out[piece] = {
      x: w - scaled * g.aside.visible - i * g.aside.step * w,
      y: g.aside.top * h + i * g.aside.drop * h,
      width: base.width,
      height: base.height,
      scale,
      z: 5 - i,
    };
  });

  return out;
}

// ── Timeline ──────────────────────────────────────────────────────────────

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** The pieces' journey: which pose becomes which, over which stretch. */
export const SEGMENTS: readonly { from: Pose; to: Pose; range: readonly [number, number] }[] = [
  { from: "rest", to: "spread", range: T.gather },
  { from: "spread", to: "elite", range: T.form },
  { from: "elite", to: "one", range: T.moves[0] },
  { from: "one", to: "muse", range: T.moves[1] },
  { from: "muse", to: "pholio", range: T.moves[2] },
  { from: "pholio", to: "sent", range: T.exit },
];

/** Where the pieces are at a point of the beat: a pose, or a move between two. */
export function poseAt(p: number): { from: Pose; to: Pose; t: number } {
  for (let i = SEGMENTS.length - 1; i >= 0; i -= 1) {
    const s = SEGMENTS[i];
    if (p >= s.range[1]) return { from: s.to, to: s.to, t: 0 };
    if (p > s.range[0]) return { from: s.from, to: s.to, t: (p - s.range[0]) / (s.range[1] - s.range[0]) };
  }
  return { from: "rest", to: "rest", t: 0 };
}

/** Away: eases off its rest and keeps going. A thing sent is not arriving anywhere. */
export const away = cubicBezier(0.5, 0, 0.88, 0.42);

/** A piece's own progress through a move, staggered by its order. */
export function pieceProgress(t: number, order: number, count: number, ease = arrive): number {
  const span = 1 - PRINT_STAGGER * Math.max(count - 1, 0);
  return ease(clamp01((t - PRINT_STAGGER * order) / span));
}

/**
 * How far a group of words is from its resting place, as a fraction of its
 * own travel: 0 at rest, 1 waiting past the entry edge, -1 gone past the
 * exit edge. `inRange` brings it in over its second half; `outRange` takes
 * it out over its first half, so the old words are out before the new ones
 * start in.
 */
export function wordsOffset(
  p: number,
  inRange: readonly [number, number],
  outRange: readonly [number, number],
): number {
  if (p >= outRange[0]) {
    const span = (outRange[1] - outRange[0]) * SWAP.out;
    return -leave(clamp01((p - outRange[0]) / span));
  }
  const start = inRange[0] + (inRange[1] - inRange[0]) * SWAP.in;
  if (p <= start) return 1;
  return 1 - arrive(clamp01((p - start) / (inRange[1] - start)));
}

/** The opening's lines come and go on their own ranges, both through the top of the frame. */
export function lineOffset(p: number, inRange: readonly [number, number], outRange: readonly [number, number]) {
  if (p >= outRange[0]) return -leave(clamp01((p - outRange[0]) / (outRange[1] - outRange[0])));
  if (p <= inRange[0]) return 1;
  return 1 - arrive(clamp01((p - inRange[0]) / (inRange[1] - inRange[0])));
}

/** The words of each destination, in order: the three agencies, then Pholio. */
export const WORDS_IN: readonly (readonly [number, number])[] = [T.form, T.moves[0], T.moves[1], T.moves[2]];
export const WORDS_OUT: readonly (readonly [number, number])[] = [T.moves[0], T.moves[1], T.moves[2], T.exit];
