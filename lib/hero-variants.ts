/**
 * /talent hero variants.
 *
 * Four prototype directions built to be compared live, mirroring the
 * pattern already used for the header (`lib/header-variants.ts`) and the
 * footer (`lib/footer-variants.ts`): build several, look at them in the
 * browser, retire the losers and document why.
 *
 * Flip between them with `?hero=<id>`; `?hero=reset` clears the override.
 *
 * Rules every direction holds to, so the comparison is about composition
 * and message rather than compliance:
 *   - No eyebrow or kicker. No scroll cue. No proof/KPI strip.
 *   - Max three text elements: headline, one sentence, one action.
 *   - Headline max two lines, sentence max 20 words.
 *   - Exactly one italic-gold word per headline. Never two.
 *   - Zero em-dashes anywhere in visible copy.
 *   - One CTA label across the whole page ("Apply free", same as the
 *     header) so there is never a second label for the same intent.
 *   - Palette is ink / cream / gold only. Square corners, never a pill.
 *   - Real photography, brand-treated (grayscale, warm grain). No
 *     decorative SVG, no fake product chrome.
 */
export const HERO_VARIANTS = [
  {
    id: "room",
    index: "01",
    name: "The Room",
    thesis:
      "The industry's real barrier is not talent, it is the door. Says the outcome in four words and lets the type be the whole design.",
    copy: "Get in the room.",
    field: "Velvet ink, one portrait bled off the right edge as a field",
    structure: "Manifesto. Display type left, image as atmosphere not subject.",
    tradeoff:
      "The most confident and the most abstract. Communicates feeling instantly, product slowly.",
  },
  {
    id: "access",
    index: "02",
    name: "Access",
    thesis:
      "Names the thing talent actually believes about their own career and takes their side. The most emotionally sharp line of the four.",
    copy: "Talent was never the hard part. Access was.",
    field: "Cream type bay against a full-height portrait",
    structure: "Asymmetric split, 54/46. The agency-website archetype.",
    tradeoff:
      "Strongest empathy, longest headline. Needs the split to carry the scale the type gives up.",
  },
  {
    id: "artifact",
    index: "03",
    name: "The Artifact",
    thesis:
      "Leads with the object an agency actually receives. The only direction where the product is visible in the first frame.",
    copy: "This is what arrives before you do.",
    field: "Cream, the composed comp card presented as a physical object",
    structure: "Object hero. Type left, artifact right, real cast shadow.",
    tradeoff:
      "Most concrete and most differentiated. Trades some emotional lift for proof.",
  },
  {
    id: "titlecard",
    index: "04",
    name: "Title Card",
    thesis:
      "The moment before recognition. Full-bleed face, type set low like a film title, which is the register talent already aspires to.",
    copy: "They're already looking.",
    field: "Full-bleed portrait under an ink scrim",
    structure: "Cinematic. Type bottom-left, image is the whole frame.",
    tradeoff:
      "Most arresting and most dependent on the photograph being excellent.",
  },
] as const;

export type HeroVariantId = (typeof HERO_VARIANTS)[number]["id"];

/** What /talent renders when no `?hero=` override is set. */
export const DEFAULT_HERO_VARIANT: HeroVariantId = "room";

export function isHeroVariantId(
  value: string | null | undefined,
): value is HeroVariantId {
  return !!value && HERO_VARIANTS.some((variant) => variant.id === value);
}
