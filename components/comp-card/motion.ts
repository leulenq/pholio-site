import { cubicBezier } from "framer-motion";

/**
 * Tunable keyframes for the comp-card beat.
 *
 * Every number the scene moves on lives here, named, in timeline units
 * (`t`, 0..1 across `CARD_VH` of scroll, see `components/hero/motion.ts`).
 *
 * The beat is one object and the story of what it is:
 *
 *   1. From the book, one frame leads.
 *   2. It becomes a card: a real front, and a real back, which is a document.
 *   3. The same book, composed again, is a different card: a new direction.
 *   4. The card goes out into the world: to the agency, and to the casting.
 *
 * Its physical rules:
 *
 *   - Nothing fades. Objects arrive by travelling in from off the stage and
 *     leave by travelling out, or by being covered by something in front of
 *     them (`lessons.md` §17, §18, §26). The only opacity in the scene is on
 *     the small edition labels and on cards already fully hidden behind the
 *     lead, where a fade is invisible and merely releases a layer.
 *   - Type rides the object. "A real front." stands on the side the front
 *     turns away toward and leaves with it; "A real back." arrives from the
 *     side the back turns in from. The closing line comes in beside the card
 *     as it is handed forward.
 *   - One phase, one ease. A property moves across a phase in a single
 *     segment so it never comes to a dead stop between two adjacent
 *     keyframes. Stops are authored, not incidental.
 *   - The lead card is the lead from the first frame. The photograph that
 *     arrives is the card's own photo band; the card stock rises out from
 *     behind it. There is no second element to cross-fade with, so there is
 *     no seam.
 */

export const glide = cubicBezier(0.65, 0, 0.35, 1);

/**
 * The arrival only: in fast, settling slow. The frames are already moving
 * when the beat begins, thrown up by the same scroll that sent her out above
 * them, so they do not start from rest. Starting from rest left the stage
 * empty for a quarter viewport of scroll between her boots and their tops.
 */
export const arrive = cubicBezier(0.22, 1, 0.36, 1);

/**
 * Scroll input is stepped (a wheel notch is ~100px) and the scene is scrubbed
 * 1:1, so the raw timeline moves in jumps. The spring gives the whole scene
 * one shared inertia: it trails the scroll by roughly a tenth of a second and
 * never overshoots (damping ratio ≈ 1.2). Everything in the beat reads the
 * same smoothed value, so nothing detaches from anything else.
 */
export const TIMELINE_SPRING = {
  stiffness: 180,
  damping: 32,
  mass: 1,
  restDelta: 0.0002,
  restSpeed: 0.002,
} as const;

// ── Card geometry ─────────────────────────────────────────────────────────

/** A 5.5 x 8.5 in comp card. */
export const CARD_ASPECT = "5.5 / 8.5";

/**
 * Where the lead edition's photograph begins, as a fraction of the card's
 * height. The Masthead prints its photo into a band that starts 220/1632 down
 * the card and runs to the bottom edge; measured off
 * `ola-editorial-masthead-front.png`. Re-measure if the lead edition changes.
 */
export const MASTHEAD_BAND = 220 / 1632;

/**
 * Room, in px, kept around the front face inside its clip box so the card's
 * shadow survives the clip. Must exceed the shadow's reach in `CARD_SHADOW`.
 */
export const SHADOW_MARGIN = 120;

/** Camera distance for the card's perspective, in px. */
export const CARD_PERSPECTIVE = 1400;

/**
 * The card's thickness, in px. Card stock at this size is about a pixel;
 * three keeps the edge-on moment from being an empty stage. The faces sit
 * at ±half of this; the edge itself is a flat bar behind them, see
 * `GeneratedCard.tsx`.
 */
export const CARD_THICKNESS = 3;
/** The edge is paper seen in shadow, not a lit surface. */
export const CARD_EDGE = "rgba(250, 247, 242, 0.5)";

/**
 * How dark the face goes as it turns away from the light: 0 facing you,
 * this much at edge-on. A card catching less light as it foreshortens is
 * what sells the turn as a solid; a flat rotation reads as a texture swap.
 */
export const TURN_SHADE = 0.42;

// ── Phases ────────────────────────────────────────────────────────────────
//
// Read top to bottom: this is the beat.

export const T = {
  /** Three frames travel up into the stage as she travels out above them. */
  arriveStart: 0,
  arriveEnd: 0.14,
  /** The lead crosses to centre; the other two tuck in behind it. */
  selectStart: 0.08,
  selectEnd: 0.21,
  /**
   * Covered by the lead now, the other two are released. Invisible either
   * way; this only frees their layers.
   */
  supportReleaseStart: 0.23,
  supportReleaseEnd: 0.26,
  /** The card stock rises from behind the photograph, carrying the name. */
  stockStart: 0.22,
  stockEnd: 0.29,
  /** Picked up: it lifts before it turns. */
  liftStart: 0.29,
  /** Turned over; the apex is the edge-on moment. */
  flipStart: 0.33,
  flipApex: 0.43,
  flipEnd: 0.53,
  /** ...and holds on its back, the document side. */
  backHoldEnd: 0.59,
  /** It turns back and is set down, small, in its place in the row. */
  turnBackStart: 0.59,
  turnBackApex: 0.625,
  turnBackEnd: 0.66,
  /** The other directions are dealt out from behind it. */
  dealStart: 0.66,
  dealEnd: 0.8,
  /** The row holds, then gathers back into one book behind the lead... */
  gatherStart: 0.88,
  gatherEnd: 0.95,
  /** ...which is handed forward. */
  end: 1,
} as const;

// ── Stage positions ───────────────────────────────────────────────────────
//
// Horizontal positions are vw offsets from the stage's centre, applied as
// transforms; nothing in this scene animates a layout property.

export type StageKind = "wide" | "compact";
type Stage<Type> = Record<StageKind, Type>;

/** Where the three frames first come to rest: figure, face, length. */
export const ARRIVAL_X: Stage<[string, string, string]> = {
  wide: ["-32vw", "0vw", "32vw"],
  // A fan on a narrow stage: the lead in front, the other two behind it.
  compact: ["0vw", "-22vw", "22vw"],
};

export const ARRIVAL_ROTATE: Stage<[number, number, number]> = {
  wide: [0, 0, 6],
  compact: [0, -7, 7],
};

/** The frames arrive from below the stage, in vh, the further ones less. */
export const ARRIVAL_FROM_VH: [number, number, number] = [100, 92, 96];

/** The row of four: lead, then the three dealt directions. */
export const ROW_X: Stage<[string, string, string, string]> = {
  wide: ["-31vw", "-11vw", "11vw", "31vw"],
  compact: ["-22vw", "22vw", "-22vw", "22vw"],
};

/** Vertical offsets in the row, in px. Two rows on a narrow stage. */
export const ROW_Y: Stage<[number, number, number, number]> = {
  wide: [-4, 4, -4, 4],
  compact: [-122, -122, 152, 152],
};

export const ROW_SCALE: Stage<number> = { wide: 0.62, compact: 0.46 };

/**
 * How each dealt card trails the one before it, in timeline units. The
 * deal is a slide out from under the lead, the top of the deck first; a
 * laid-down turn was tried and the owner preferred this (`lessons.md` §29).
 */
export const DEAL_STAGGER = 0.012;

/** The lead's final position: beside the closing line, or above it. */
export const READY_X: Stage<string> = { wide: "12vw", compact: "0vw" };
/** Raised on a narrow stage so the closing line fits beneath it. */
export const READY_Y: Stage<number> = { wide: -2, compact: -44 };
/** Picked back up at the gather, then brought forward to the reader. */
export const READY_SCALE: Stage<readonly [number, number]> = {
  wide: [1.04, 1.12],
  compact: [1, 1.04],
};
/**
 * Handed forward, it is held a little off square, the way a card is passed
 * across a table rather than displayed on a wall. Degrees, applied only
 * once the other three are fully behind it.
 */
export const READY_TILT = { rotateY: -6, rotateX: 4 } as const;

// ── The flip ──────────────────────────────────────────────────────────────
//
// A card turned over in the hand is lifted toward you, tips back a little
// as it turns, and is set down again. The rotation alone reads as a
// mechanism; the arc is what makes it a hand.

/** The card is raised before the flip so it clears the bottom caption. */
export const FLIP_Y = -80;
/** Height and size at the edge-on apex, then back down. */
export const FLIP_APEX_Y = -110;
export const FLIP_SCALE = [1.02, 1.06] as const;
/** How far it tips back at the apex, in degrees. */
export const FLIP_TILT = 7;
/** The turn back is set down as it goes, so its arc is smaller. */
export const TURN_BACK_TILT = 4;
export const TURN_BACK_LIFT = -20;

// ── Captions ──────────────────────────────────────────────────────────────
//
// Type travels, and it travels with the object. Each caption has a place on
// the stage and a side it comes from and goes back to. The two halves of
// the front/back line stand on opposite sides of the card and change over
// as it turns: the front's half leaves the way the front face is turning,
// the back's half arrives from the side the back face turns in from.

export const CAPTION_TRAVEL_VH = 30;
/**
 * Sideways travel for a line standing beside the card: enough to carry a
 * 30rem block past the stage's edge at the narrowest wide width (768px).
 */
export const CAPTION_TRAVEL_VW = 72;
/** Sideways travel for a full-width line above or below it: past the far
    edge of the stage, whatever its width. */
export const CAPTION_TRAVEL_FULL_VW = 110;

/**
 * "beside-left" / "beside-right" hug the card: they are set against its
 * edge rather than the stage's, because they belong to the object, not to
 * the frame. "left" is the stage's own left margin.
 */
export type CaptionPlace = "top" | "bottom" | "left" | "right" | "beside-left" | "beside-right";
export type CaptionTravel = "up" | "down" | "left" | "right";

export type Caption = {
  key: string;
  /** Three parts: before the verdict word, the verdict word, after. A
      "\n" in a part is an authored line break. Headlines only: no support
      line under any of them, the artifact does the rest (`lessons.md` §29). */
  head: readonly [string, string, string];
  place: Stage<CaptionPlace>;
  travel: Stage<CaptionTravel>;
  /** In from range[0] to range[1]; out from range[2] to range[3]. Equal
      last two values hold. */
  range: readonly [number, number, number, number];
};

export const CAPTIONS: readonly Caption[] = [
  {
    key: "selection",
    head: ["The frame that ", "leads", "."],
    place: { wide: "bottom", compact: "bottom" },
    travel: { wide: "down", compact: "down" },
    // After the frames have arrived: they travel up through the caption's
    // place on their way in.
    range: [0.11, 0.16, 0.24, 0.28],
  },
  {
    // No verdict word of its own: the line's one gold word is "back".
    key: "front",
    head: ["A real front.", "", ""],
    place: { wide: "beside-left", compact: "bottom" },
    travel: { wide: "left", compact: "left" },
    // In as the stock finishes rising; out with the front, through the
    // first half of the turn.
    range: [0.27, 0.32, T.flipStart, T.flipApex],
  },
  {
    key: "back",
    head: ["A real ", "back", "."],
    place: { wide: "beside-right", compact: "bottom" },
    travel: { wide: "right", compact: "right" },
    // In with the back, through the second half of the turn; out before
    // the card is turned again.
    range: [T.flipApex, T.flipEnd, T.turnBackStart, 0.64],
  },
  {
    // Editions are directions, and "New direction" is the product's own
    // gesture: the same book, composed again, is a different card. Not a
    // count: the catalog's size is not the idea (`lessons.md` §28).
    key: "direction",
    head: ["Same book. New ", "direction", "."],
    place: { wide: "top", compact: "top" },
    travel: { wide: "up", compact: "up" },
    range: [0.64, 0.7, 0.84, 0.88],
  },
  {
    // The close is the artifact's two real uses, and nothing about what
    // follows them: it goes to the agency inside the application, and it
    // is the thing left with the client at a casting (lexicon, "comp
    // card"). Two lines by design, one use each; "\n" is a line break.
    key: "uses",
    head: ["Sent to the agency.\nLeft at the ", "casting", "."],
    place: { wide: "left", compact: "bottom" },
    travel: { wide: "left", compact: "down" },
    range: [0.91, 0.97, 1, 1],
  },
];

/** The small edition labels under the row. Metadata, not display copy. */
export const LABEL_RANGE = [0.81, 0.85, 0.86, 0.89] as const;
