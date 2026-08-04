/**
 * Header variants.
 *
 * "The Index" (components/header/VariantIndex.tsx) is the site's header and the
 * only one that exists. It is one of the four surfaces carried across from the
 * previous site intact — see docs/design-language/preserved-surfaces.md for
 * what it is and why it survived the reset.
 *
 * This registry exists so a future redesign can be walked through the live site
 * with `?header=<id>` while it is being reviewed, instead of shipping a branch
 * deploy. Add an entry here and in components/header/index.tsx to use it.
 */
export const HEADER_VARIANTS = [
  {
    id: "index",
    index: "01",
    name: "The Index",
    thesis:
      "Maximum restraint at rest, maximum brand on demand. At rest only a wordmark and an INDEX trigger; open, a full-height editorial index.",
    structure: "No bar · two corner marks, full-screen drawer",
    behaviour:
      "Geometry never changes on scroll — only the paper under the band fades in. Polarity is sampled live from whatever section the bar is crossing.",
    cta: "An entry inside the index, weighted by colour at full strength — never by scale.",
    tradeoff:
      "Buys scroll-driven scenes total silence, and pays for it in desktop nav discoverability: one click before anyone sees the destinations.",
  },
] as const;

export type HeaderVariantId = (typeof HEADER_VARIANTS)[number]["id"];

/** What the live site renders when no `?header=` override is set. */
export const DEFAULT_HEADER_VARIANT: HeaderVariantId = "index";

export function isHeaderVariantId(
  value: string | null | undefined,
): value is HeaderVariantId {
  return !!value && HEADER_VARIANTS.some((variant) => variant.id === value);
}
