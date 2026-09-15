import { cubicBezier } from "framer-motion";

/**
 * Tunable keyframes for the Studio+ beat: the dark room the card was shown in
 * is lit, and the lit room is where Studio+ is.
 *
 * Everything before this on the stage was Pholio doing things with the book:
 * seeing the frame, composing the card, sending it out. This beat changes
 * worlds. The subject becomes Zofia, because what is shown from here is no
 * longer the book on Pholio but a site of one's own, and the site itself is
 * the demonstration.
 *
 * **One thing happens: the dark world becomes the light one.** The room the
 * card was shown in is lit, and that is the whole transition (`lessons.md`
 * §36). There is no second event before or after it — no void, no handover,
 * nothing leaving and nothing arriving — so every frame of it is the same
 * composition at a different exposure.
 *
 * It is one light, and it treats everything in the room the way a light
 * does. What reflects a lot comes up a lot; what reflects little stays dark.
 *
 *   - The ground is paper. It comes up from velvet to cream.
 *   - STUDIO+ is dark cloth and gold, set on that paper, and it has been
 *     there the whole time. In the dark room it is black on
 *     black. As the paper around it is lit, the word is there by contrast:
 *     it does not fade, grow, or travel. The light shows it.
 *   - The card belongs to the dark world, and it goes with it. As the light
 *     starts it leaves the frame the way everything on this stage has left —
 *     travelling on up and out, as itself — and it is out of shot before the
 *     paper is bright enough to show the word. The lit room never holds it,
 *     and nothing is printed on it.
 *
 * Then:
 *
 *   1. The plus opens. Its arms extend until the cross divides the frame.
 *      As they extend the solid gold hollows to a hairline rim, and what is
 *      inside the rim is the first blank page of her site. The rim widens
 *      and turns as it widens, taking the letters from the centre outward,
 *      and inside it her masthead composes. When the rim has left the frame
 *      there is no word and no plus. The visitor is on her page and never
 *      saw it arrive.
 *   2. The walk. This page's scroll drives her page's scroll: masthead,
 *      statement, and along the book.
 *   3. The step back. The site recedes into a window on the stage's own
 *      paper, and one line stands beside it with one link.
 *
 * Every value is in timeline units, `t` in 0..1 across `SITE_VH` of scroll
 * (`components/hero/motion.ts`), and every stage value is authored twice,
 * wide and compact (`docs/design-language/08-narrow-stage.md`).
 */

/** In fast, settling slow. Things thrown up by the scroll. */
export const arrive = cubicBezier(0.22, 1, 0.36, 1);
/**
 * Away. Eases off its rest and keeps accelerating, with no settle at the
 * end: a thing leaving the frame is not arriving anywhere.
 */
export const away = cubicBezier(0.5, 0, 0.88, 0.42);
/** One ease for a move with two authored ends. */
export const glide = cubicBezier(0.65, 0, 0.35, 1);
/** Opening: gathers, then commits. */
export const open = cubicBezier(0.7, 0, 0.3, 1);

/** The same yield as the card beat, on the page's weight, so the two read as one stage (`lessons.md` §45.3). */
export const TIMELINE_SPRING = {
  stiffness: 320,
  damping: 42,
  mass: 1,
  restDelta: 0.0002,
  restSpeed: 0.002,
} as const;

export type StageKind = "wide" | "compact";
export type Stage<T> = { readonly wide: T; readonly compact: T };

// ── Phases ────────────────────────────────────────────────────────────────
//
// Read top to bottom: this is the beat. Pairs are [start, end].

export const T = {
  /** The card leaves the dark world, up and out of the frame. */
  leave: [0.01, 0.13],
  /** The room is lit: velvet to paper, and the word is seen by it. */
  light: [0.025, 0.27],
  /** The plus opens: arms, then the rim widens, turning as it goes. */
  grow: [0.352, 0.648],
  /** Her masthead composes inside the opening. */
  compose: [0.441, 0.707],
  /** Her page scrolls under this page's scroll. */
  walk: [0.736, 0.854],
  /** The step back, into the window. */
  stepBack: [0.854, 0.92],
  /** The line and the link arrive beside it. */
  end: [0.891, 0.972],
} as const;

/**
 * Inside the opening, as fractions of `T.grow`: where the arms finish
 * extending, where the solid has hollowed to its rim, where the rim starts
 * widening, and where the turn runs.
 */
export const OPENING = {
  armsEnd: 0.4,
  hollowEnd: 0.36,
  widenStart: 0.36,
  turn: [0.1, 0.96] as const,
  turnDegrees: 34,
} as const;

/**
 * The header stands down from early in the light, before the field is bright
 * enough for a bar sampled against velvet to be wrong, until the stage
 * unpins into the closing panel, which stands it down itself. Measured
 * against the same 40% line the closing panel uses, via the same hook
 * (`components/header/kit.tsx`, `useFooterTakeover`): a `data-footer-trigger`
 * marker at the top of the stage during the takeover and at its foot
 * otherwise, where it coincides with the closing panel's own trigger once
 * the stage unpins.
 */
export const TAKEOVER = {
  start: 0.05,
  end: 1.01,
} as const;

// ── Fields ────────────────────────────────────────────────────────────────

export const CREAM = "#FAF7F2";
export const INK = "#0f172a";
export const GOLD_ON_PAPER = "#A8894E";
/** Her paper, warmer than the stage's, so the window reads as another sheet. */
export const SITE_PAPER = "#F2EFE9";

// ── The light ─────────────────────────────────────────────────────────────

/**
 * The room's exposure across `T.light`, as a fraction of full light. Every
 * lit thing in the room is its own colour times this — the paper, the
 * cloth, the gold — so they come up together and in proportion, the way one
 * light lights a room, and nothing is ever a mix of two colours. At the dark
 * end the paper at that exposure is the velvet itself (#FAF7F2 × 0.02 is
 * #050505), so the room was the dark stage all along.
 *
 * The stops are a dimmer's: almost nothing for the first third of the
 * travel, then quick through the middle, where a dim room is least worth
 * looking at, then a long settle into the paper. `at` is in fractions of
 * `T.light`.
 */
export const LIGHT = {
  at: [0, 0.38, 0.54, 0.7, 1] as const,
  exposure: [0.02, 0.06, 0.34, 0.9, 1] as const,
} as const;

/** The room's exposure at a point in this beat's timeline. */
export function exposureAt(p: number): number {
  const k = clamp01((p - T.light[0]) / (T.light[1] - T.light[0]));
  const { at, exposure } = LIGHT;
  for (let i = 1; i < at.length; i += 1) {
    if (k <= at[i]) {
      const q = (k - at[i - 1]) / (at[i] - at[i - 1]);
      return lerp(exposure[i - 1], exposure[i], q);
    }
  }
  return exposure[exposure.length - 1];
}

/** Before the room is lit, the lit things in it are not on the stage at all. */
export const inTheRoom = (p: number) => p > T.light[0];

/**
 * The paper, at an exposure. A light brought up on a dimmer warms as it
 * dims, so each channel follows its own curve: blue is held back most at low
 * light and all three meet at the paper. Without it the middle of the travel
 * is a neutral grey, which reads as concrete rather than as a room being lit.
 */
export const WARMTH = { r: 0.9, g: 0.97, b: 1.07, over: [0.02, 0.1] } as const;
export const paperAt = (e: number) => {
  // The dark end stays the velvet exactly: the warmth is phased in as the
  // light is, so the stage above this beat is not tinted by it.
  const w = clamp01((e - WARMTH.over[0]) / (WARMTH.over[1] - WARMTH.over[0]));
  const ch = (v: number, x: number) => Math.round(v * e ** (1 + (x - 1) * w));
  return `rgb(${ch(250, WARMTH.r)}, ${ch(247, WARMTH.g)}, ${ch(242, WARMTH.b)})`;
};

/**
 * The dark room's film grain, as a fraction of `T.light`: it goes while the
 * room is still dim, since on lit paper it reads as dirt rather than film.
 */
export const GRAIN = { from: 0.3, to: 0.7 } as const;

// ── The card's exit ───────────────────────────────────────────────────────

/**
 * How far the whole card layer travels up, in vh, so the card and its shadow
 * clear the top of the frame rather than parking just past it. No scale: it
 * leaves as the object it is.
 */
export const LEAVE: Stage<number> = { wide: -108, compact: -104 };

// ── The mark ──────────────────────────────────────────────────────────────
//
// STUDIO+ in tracked caps of the display serif, the word filled with a navy
// duotone cut from the taffeta of the dress she stands in when her site
// composes, and the plus in gold, the serif's own cross, drawn geometrically
// from the glyph's measurements so that it can open.
//
// The word and the plus are one mark. They are lit together, by the same
// light, and nothing in this beat ever shows one without the other.

export const WORDS = {
  name: "STUDIO",
  /** For readers who do not see the mark move. */
  label: "Studio+",
  tracking: "0.05em",
  /**
   * The face's baseline and its cap midline, as fractions of the em from the
   * top of a line box set with line-height 1. Measured off the face.
   */
  baseline: 0.888,
  capMid: 0.538,
  /**
   * Where the mark stands in the lit room, alone on its paper: the cap
   * midline and the plus's centre line, in vh; the word's size; its right
   * edge, in vw, before the plus.
   */
  axis: { wide: 50, compact: 44 } as Stage<number>,
  size: { wide: "12.4vw", compact: "15.2vw" } as Stage<string>,
  right: { wide: 71.5, compact: 78 } as Stage<number>,
  fill: "/studio-plus/taffeta-navy.webp",
  fillUnder: "#101a33",
} as const;

export const PLUS = {
  /** Measured off the face at 200px: ink 85 wide, stroke 5, centre 0.36em above the baseline. */
  halfLen: 0.2125,
  halfThick: 0.0125,
  /** Its centre, in em of the mark, from the mark's right edge. */
  after: 0.34,
  rim: 1.5,
  reach: 0.62,
} as const;


// ── The site, and the close ───────────────────────────────────────────────
//
// The last frame is a cover. Her live site is the image; "A site of her
// own." is its masthead, set on one line at a size that reads at a glance,
// and sized so the sentence runs exactly the width of her site — the two
// share one measure, so the line and the page are one object. The line
// stands on the site's top edge. The Studio+ cross is pinned to the site's
// bottom-right corner, half on her page and half on the paper, anchoring the
// action without marketing text. The eye goes title, her page, the cross: the
// reading diagonal of a cover, and the action belongs to the page it opens.
// The cover fills the frame.

/** The line's typographic pieces. `own` is the verdict word. */
export const CLOSE = {
  before: "A site of her ",
  verdict: "own",
  after: ".",
  label: "A site of her own.",
  open: "Open Zofia's site",
  wide: {
    /** Her site's width, as a fraction of the frame's, before the height cap. */
    site: 0.72,
    /** Its left edge, as a fraction of the frame's width. */
    left: 0.055,
    /** Room above the line, as a fraction of the frame's height. */
    top: 0.07,
    /** The least room under her site, as a fraction of the frame's height. */
    bottom: 0.05,
    /** Space between the line's baseline and her site, in em of the line. */
    gap: 0.3,
    /** The action's size, as a fraction of the frame's width, with a floor. */
    action: 0.0125,
    /** Where the words sit against the cross: carrying her site's bottom edge on into the open side. */
    words: "along" as const,
  },
  compact: {
    site: 0.82,
    left: 0.07,
    top: 0.055,
    bottom: 0.08,
    gap: 0.3,
    action: 0.038,
    words: "under" as const,
  },
} as const;

/** Measured off Noto Serif Display, in em. */
export const FACE = {
  capHeight: 0.714,
  /** Top of a line box set with line-height 1, down to the baseline. */
  baseline: 0.888,
} as const;

export type CloseLayout = {
  window: { scale: number; x: number; y: number; w: number; h: number };
  title: { size: number; x: number; baseline: number };
  action: { size: number; corner: { x: number; y: number }; words: "along" | "under" };
};

/**
 * `titleEm` is the set line's width in em, measured off the face in the page
 * (it depends on word spacing and the italic, so it is read, not assumed).
 * Her site is as large as the frame allows: its width is authored, and capped
 * where the line above and the room below would otherwise run off the frame.
 */
export function closeLayout(stage: StageKind, w: number, h: number, titleEm: number): CloseLayout {
  const c = CLOSE[stage];
  const lineRise = (FACE.capHeight + c.gap) * (w / titleEm);
  const fits = (h * (1 - c.top - c.bottom)) / (lineRise + h);
  const scale = Math.min(c.site, fits);
  const winW = scale * w;
  const winH = scale * h;
  const size = winW / titleEm;
  const winX = c.left * w;
  const baseline = c.top * h + FACE.capHeight * size;
  const winY = baseline + c.gap * size;
  const action = Math.max(stage === "compact" ? 14 : 15, c.action * w);
  return {
    window: { scale, x: winX, y: winY, w: winW, h: winH },
    title: { size, x: winX, baseline },
    action: { size: action, corner: { x: winX + winW, y: winY + winH }, words: c.words },
  };
}

// ── The walk ──────────────────────────────────────────────────────────────

export const DRIVE_STOPS = [0, 0.2, 0.32, 0.42, 1] as const;

export type SiteMarks = {
  hero: number;
  statement: number;
  book: number;
  bookRun: number;
  height: number;
  wide: boolean;
};

export function driveTargets(m: SiteMarks): number[] {
  const bookWalk = m.wide ? m.bookRun * 0.62 : m.hero * 2.4;
  return [0, m.hero * 0.98, m.statement + m.hero * 0.28, m.book, m.book + bookWalk];
}

// ── Geometry ──────────────────────────────────────────────────────────────

export function plusPoints(cx: number, cy: number, l: number, t: number, deg: number): [number, number][] {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const raw: [number, number][] = [
    [-l, -t], [-t, -t], [-t, -l], [t, -l], [t, -t], [l, -t],
    [l, t], [t, t], [t, l], [-t, l], [-t, t], [-l, t],
  ];
  return raw.map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]);
}

export function polygon(points: [number, number][]): string {
  return `polygon(${points.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(", ")})`;
}

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
