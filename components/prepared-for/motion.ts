import { cubicBezier } from "framer-motion";

/**
 * Tunable keyframes and data for the home page's application beat: the same
 * set of digitals, prepared three times, for three agencies that are not on
 * Pholio.
 *
 * **One thing happens: the address changes, and the set takes the shape that
 * address asks for.** The material never changes. One person, eight plain
 * frames, on the paper the whole time. What changes is which of them are
 * asked for, in what order, under what words, and where the finished set is
 * sent. So the stage holds the eight prints as eight persistent objects; a
 * destination is a name at the top and a line at the foot; and when the
 * name changes, the prints re-sort into that agency's order and count, the
 * ones it does not ask for are set aside at the margin, and the foot says who
 * prepares the files and who sends them.
 *
 * Every destination is a real entry in the register (`/agencies`), read from
 * the agency's own page on the date shown, and every one of them takes
 * applications somewhere other than Pholio. That is the point of the beat.
 * The words under the prints are the agency's own shot names; the file names
 * are what the product's export actually writes
 * (`pholio-app/src/domains/spec-registry/export/export-plan.js`:
 * `<organization>-<slot>.jpg`); the email draft is what the product actually
 * drafts for an email-channel agency (`email-draft.js`), with the lines a
 * profile without published stats would carry.
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

/** The same inertia the home stage reads, so the beat has its weight. */
export const TIMELINE_SPRING = {
  stiffness: 180,
  damping: 32,
  mass: 1,
  restDelta: 0.0002,
  restSpeed: 0.002,
} as const;

// ── Scroll ────────────────────────────────────────────────────────────────

/** The pinned scroll, including the viewport it pins in. */
export const STAGE_VH: Stage<number> = { wide: 520, compact: 480 };

/**
 * Two moves between three holds, as [start, end] of the pinned scroll. A hold
 * is where a destination rests; a move is the address changing. The holds are
 * long on purpose: the composition at rest is the argument, and the move is
 * only how it gets to the next one.
 */
export const MOVES: readonly (readonly [number, number])[] = [
  [0.24, 0.42],
  [0.62, 0.8],
];

/** Within a move, the words leave first and arrive last; the prints re-sort in between. */
export const SWAP = {
  /** The leaving line is gone by this fraction of the move. */
  out: 0.42,
  /** The arriving line starts at this fraction of the move. */
  in: 0.5,
} as const;

/** Prints start their travel one after another, top of the row first. */
export const PRINT_STAGGER = 0.045;

// ── Fields ────────────────────────────────────────────────────────────────

/** The paper the home stage ends on; this section stays on it to its foot. */
export const CREAM = "#FAF7F2";
export const INK = "#0f172a";
export const INK_SOFT = "rgba(15, 23, 42, 0.62)";
export const INK_QUIET = "rgba(15, 23, 42, 0.46)";
export const GOLD_ON_PAPER = "#A8894E";

// ── The frames ────────────────────────────────────────────────────────────

/**
 * One person, one sitting: the eight plain frames an application is made
 * from. Sourced from Unsplash for this beat (`lessons.md` §41). Width and
 * height are the source's, so every print keeps its own proportion at a
 * shared height: a digital is framed, never cropped to a cell.
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

export interface Frame {
  src: string;
  w: number;
  h: number;
  alt: string;
}

export const FRAMES: Record<Role, Frame> = {
  fullLength: { src: "/prepared-for/full-length.jpg", w: 2, h: 3, alt: "Digital, full length" },
  fullLengthProfile: {
    src: "/prepared-for/full-length-profile.jpg",
    w: 2,
    h: 3,
    alt: "Digital, full length, in profile",
  },
  portraitLength: {
    src: "/prepared-for/portrait-length.jpg",
    w: 2,
    h: 3,
    alt: "Digital, portrait length",
  },
  waistUp: { src: "/prepared-for/waist-up.jpg", w: 2, h: 3, alt: "Digital, waist up" },
  closeUp: {
    src: "/prepared-for/close-up.jpg",
    w: 2,
    h: 3,
    alt: "Digital, close up, hair pulled back",
  },
  closeUpProfile: {
    src: "/prepared-for/close-up-profile.jpg",
    w: 2,
    h: 3,
    alt: "Digital, close up, in profile",
  },
  closeUpHairDown: {
    src: "/prepared-for/close-up-hair-down.jpg",
    w: 2,
    h: 3,
    alt: "Digital, close up, hair down",
  },
  personality: { src: "/prepared-for/personality.jpg", w: 2, h: 3, alt: "Digital, personality" },
};

// ── The destinations ──────────────────────────────────────────────────────

export interface Ask {
  role: Role;
  /** The agency's own shot name, from its published page. */
  label: string;
  /** The slot as the export names it: `<organization>-<slot>.jpg`. */
  slot: string;
}

export interface Destination {
  id: string;
  /** The register's series id, for `/agencies/<seriesId>`. */
  seriesId: string;
  name: string;
  /** The organization id the export slugs file names with. */
  organization: string;
  /** The date the register last read the agency's page. */
  checked: string;
  channel: "form" | "email";
  asks: readonly Ask[];
  /** Who prepares, who sends, where. One sentence each, at most twenty words. */
  foot: string;
  /** For an email channel: the draft the export writes, as it would read for this set. */
  draft?: readonly string[];
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
    checked: "2026-08-09",
    channel: "form",
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
    foot: "Elite takes applications on its own page. Pholio prepares the files. You upload them there.",
  },
  {
    id: "one",
    seriesId: "one-management:online",
    name: "ONE Management",
    organization: "one-management",
    checked: "2026-08-19",
    channel: "form",
    asks: [
      { role: "fullLength", label: "Full Length", slot: "full-length" },
      { role: "waistUp", label: "Waist Up", slot: "waist-up" },
      { role: "closeUp", label: "Close Up", slot: "close-up" },
      { role: "closeUpProfile", label: "Profile", slot: "profile" },
    ],
    foot: "ONE takes applications on its own page. Pholio prepares the files, each under 600 KB as they ask. You upload them there.",
  },
  {
    id: "muse",
    seriesId: "muse-model-management-nyc:email",
    name: "Muse Model Management",
    organization: "muse-model-management",
    checked: "2026-08-09",
    channel: "email",
    asks: [
      { role: "closeUp", label: "Close ups, hair up", slot: "close-ups-hair-up" },
      { role: "closeUpHairDown", label: "Close ups, hair down", slot: "close-ups-hair-down" },
      { role: "fullLength", label: "Full length", slot: "full-length" },
    ],
    foot: "Muse takes applications by email. Pholio drafts the message. You send it from your own address.",
    draft: [
      "Subject: Model submission",
      "Hello,",
      "Attached are 3 digitals prepared to the requirements Muse Model Management publishes.",
    ],
  },
];

/** The file the export writes for one slot. */
export const fileName = (destination: Destination, ask: Ask) =>
  `${destination.organization}-${ask.slot}.jpg`;

/** The line under every destination: where the words came from, and what Pholio is not. */
export const DISCLOSURE =
  "Requirements as published on each agency's own page, on the date shown. Pholio is not affiliated with any agency named here.";

// ── Layout ────────────────────────────────────────────────────────────────

/**
 * The stage's geometry, in fractions of the frame unless noted.
 *
 * `row` is the band the asked-for prints stand in: its top and the height of
 * a print, in vh, with `gap` between prints in px. `aside` is where the prints
 * an agency does not ask for are set: the first with `visible` of its width on
 * the paper and the rest past the right edge, each further one a `step` in
 * and a `drop` down, behind the one before, at `scale`. `address` is the name at the top; `foot` the band under the
 * row that carries the captions and the line.
 */
export interface Geometry {
  margin: number;
  row: { top: number; height: number; gap: number; rows: number };
  aside: { visible: number; top: number; step: number; scale: number; drop: number };
  address: { top: number; size: string; max: number };
  caption: { gap: number; size: number; lead: number };
  foot: { top: number; size: number; max: number };
  draft: { top: number; size: number };
  disclosure: { size: number };
}

export const GEOMETRY: Stage<Geometry> = {
  wide: {
    margin: 0.06,
    row: { top: 0.31, height: 0.31, gap: 22, rows: 1 },
    aside: { visible: 0.62, top: 0.38, step: 0.028, scale: 0.56, drop: 0.012 },
    address: { top: 0.09, size: "5.4vw", max: 0.84 },
    caption: { gap: 12, size: 12, lead: 1.35 },
    foot: { top: 0.775, size: 17, max: 0.58 },
    draft: { top: 0.72, size: 13 },
    disclosure: { size: 11.5 },
  },
  compact: {
    margin: 0.06,
    row: { top: 0.27, height: 0.18, gap: 10, rows: 2 },
    aside: { visible: 0.62, top: 0.1, step: 0.035, scale: 0.34, drop: 0.014 },
    address: { top: 0.105, size: "8.4vw", max: 0.66 },
    caption: { gap: 8, size: 10.5, lead: 1.3 },
    foot: { top: 0.75, size: 14, max: 0.88 },
    draft: { top: 0.56, size: 11.5 },
    disclosure: { size: 10 },
  },
};

export interface Placement {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  z: number;
  /** In the row for this destination (true), or set aside (false). */
  asked: boolean;
}

/**
 * Where every print stands for one destination, in px from the stage's
 * top-left. The asked-for prints fill the row in the agency's order, each at
 * its own proportion; on a narrow stage the row wraps into two. The rest are
 * set aside on the right, in the fixed order of the set, so a print that is
 * not asked for by two agencies in a row does not move between them.
 */
export function placements(
  destination: Destination,
  stage: StageKind,
  w: number,
  h: number,
): Record<Role, Placement> {
  const g = GEOMETRY[stage];
  const height = g.row.height * h;
  const margin = g.margin * w;
  const out = {} as Record<Role, Placement>;

  // The row. Three or fewer prints always stand in one row, whatever the stage.
  const count = destination.asks.length;
  const perRow = count <= 3 ? count : Math.ceil(count / g.row.rows);
  // Under each print: the agency's words, and on a wide stage the file name.
  const captionBand = g.caption.gap + g.caption.size * g.caption.lead * 2 + 6;
  let x = margin;
  let rowIndex = 0;
  destination.asks.forEach((ask, i) => {
    if (i > 0 && i % perRow === 0) {
      rowIndex += 1;
      x = margin;
    }
    const frame = FRAMES[ask.role];
    const width = (height * frame.w) / frame.h;
    out[ask.role] = {
      x,
      y: g.row.top * h + rowIndex * (height + captionBand),
      width,
      height,
      scale: 1,
      z: 10,
      asked: true,
    };
    x += width + g.row.gap;
  });

  // The rest, set aside.
  const askedRoles = new Set(destination.asks.map((a) => a.role));
  const rest = ROLES.filter((role) => !askedRoles.has(role));
  rest.forEach((role, i) => {
    const frame = FRAMES[role];
    const width = (height * frame.w) / frame.h;
    const scaled = width * g.aside.scale;
    out[role] = {
      x: w - scaled * g.aside.visible - i * g.aside.step * w,
      y: g.aside.top * h + i * g.aside.drop * h,
      width,
      height,
      scale: g.aside.scale,
      z: 5 - i,
      asked: false,
    };
  });

  return out;
}

// ── Timeline ──────────────────────────────────────────────────────────────

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The destination index at a point of the scroll, and, if a move is under way,
 * the raw progress of that move.
 */
export function beatAt(p: number): { index: number; move: number | null; t: number } {
  for (let i = MOVES.length - 1; i >= 0; i -= 1) {
    const [start, end] = MOVES[i];
    if (p >= end) return { index: i + 1, move: null, t: 0 };
    if (p > start) return { index: i, move: i, t: (p - start) / (end - start) };
  }
  return { index: 0, move: null, t: 0 };
}

/** A print's own progress through a move, staggered by its order in the row. */
export function printProgress(t: number, order: number, count: number): number {
  const span = 1 - PRINT_STAGGER * Math.max(count - 1, 0);
  return arrive(clamp01((t - PRINT_STAGGER * order) / span));
}

/**
 * How far a destination's words are from their resting place, as a fraction
 * of their own exit distance: 0 at rest, 1 fully out. Positive means "not yet
 * arrived" (waiting past the entry edge), negative means "gone" (past the
 * exit edge). The two never overlap: the old line is out before the new one
 * starts in.
 */
export function wordsOffset(p: number, index: number): number {
  const { index: current, move, t } = beatAt(p);
  if (move === null) return index === current ? 0 : index < current ? -1 : 1;
  // A move from `move` to `move + 1`.
  if (index === move) return -leave(clamp01(t / SWAP.out));
  if (index === move + 1) return 1 - arrive(clamp01((t - SWAP.in) / (1 - SWAP.in)));
  return index < move ? -1 : 1;
}
