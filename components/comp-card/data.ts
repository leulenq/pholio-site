export type SourceFrame = {
  src: string;
  objectPosition: string;
  filter?: string;
};

export type CardVariant = {
  src: string;
  /** The edition's label, read from pholio-app's shipped catalog. */
  edition: string;
};

/**
 * The three frames the capture beat selects from.
 *
 * An editorial standing frame, a second look in a different wardrobe and
 * location, and a full length. Between them they carry the range a booker
 * scans for.
 *
 * The lead is the editorial standing frame, locked as the card's hero via the
 * engine's own `locks.heroId`. A comp-card front is a body shot with the name
 * set into it, not a tight headshot; ranking chose the headshot and it made
 * every edition read as the same flat card.
 *
 * No filter. The comp-card engine's "Never" list opens with photo
 * manipulation, and these frames become the cards; desaturating them on the
 * way in would misrepresent what the product emits. See `lessons.md` §19.
 */
export const SOURCE_FRAMES: SourceFrame[] = [
  // The lead. Also the card's locked hero, so the plate and the card it turns
  // into are the same photograph at the same crop.
  {
    src: "/generated/comp-card/source/ola-editorial-standing.jpg",
    objectPosition: "50% 38%",
  },
  // A second look, different wardrobe and location from the other two: the
  // range a booker scans for isn't one outfit shot three ways.
  {
    src: "/generated/comp-card/source/ola-night-street.jpg",
    objectPosition: "50% 42%",
  },
  {
    src: "/generated/comp-card/source/ola-full-length.jpg",
    objectPosition: "50% 46%",
  },
];

/**
 * Four of the nine editions in the comp-card catalog, rendered through the
 * real engine by `scripts/render-comp-cards.cjs`.
 *
 * Editions are the engine's top-level creative unit: named art directions
 * that own composition, image hierarchy, typography, palette, ornament and
 * back program. They are what actually varies between cards. Markets do not:
 * a city is an *intel* concept (`intel/market-resolve.js`, where attention is
 * resolved to New York, Paris, Milan) and has nothing to do with how a card
 * is composed. Labelling cards with cities was the error this replaced.
 *
 * Labels come from the shipped catalog rather than the spec, which has
 * already drifted from it once.
 */
export const CARD_VARIANTS: CardVariant[] = [
  {
    src: "/generated/comp-card/ola-house-classic-front.png",
    edition: "The Standard",
  },
  {
    src: "/generated/comp-card/ola-gallery-monograph-front.png",
    edition: "The Monograph",
  },
  {
    src: "/generated/comp-card/ola-editorial-masthead-front.png",
    edition: "The Masthead",
  },
  {
    src: "/generated/comp-card/ola-ink-noir-front.png",
    edition: "The Night Edition",
  },
];

/** How many named directions the catalog actually ships. */
export const EDITION_COUNT = 9;
