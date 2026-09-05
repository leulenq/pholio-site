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
 * Four directions from the comp-card catalog's nine.
 *
 * Editions are the engine's top-level creative unit: named art directions
 * that own composition, image hierarchy, typography, palette, ornament and
 * back program. They are what actually varies between cards. Markets do not:
 * a city is an *intel* concept (`intel/market-resolve.js`, where attention is
 * resolved to New York, Paris, Milan) and has nothing to do with how a card
 * is composed. Labelling cards with cities was the error this replaced.
 *
 * The lead is the engine's own `editorial-masthead` output
 * (`scripts/render-comp-cards.cjs`). The other three are composed by hand
 * (`scripts/comp-card-fronts/render.cjs`) to the catalog's directions, each
 * from a different photograph, on its own field, in its own typographic
 * voice: the engine's fronts for this talent all resolved to the same frame
 * with the name moved around it, which is one direction three times. See
 * `lessons.md` §25. Labels are the shipped catalog's (`editions.js`).
 */
export const CARD_VARIANTS: CardVariant[] = [
  // The lead. This one is also the two-sided card the flip beat turns over
  // (`CompCardFront` / `CompCardBack`), so its front must stay index 0.
  {
    src: "/generated/comp-card/ola-editorial-masthead-front.png",
    edition: "The Masthead",
  },
  // The magazine-cover interlock: the photograph is the whole page and the
  // name, in display grotesque at trim-to-trim scale, is set behind the
  // figure. Nothing else is on the front.
  {
    src: "/generated/comp-card/ola-cover-story-composed.png",
    edition: "The Cover Story",
  },
  // The working commercial card: a full-bleed colour hero over a
  // three-frame strip along the foot.
  {
    src: "/generated/comp-card/ola-strip-composed.png",
    edition: "The Strip",
  },
  // Two frames on a hinge: the studio beauty in black and white beside the
  // full length in colour, an editorial serif name centred beneath.
  {
    src: "/generated/comp-card/ola-diptych-composed.png",
    edition: "The Diptych",
  },
];

/** How many named directions the catalog actually ships. */
export const EDITION_COUNT = 9;
