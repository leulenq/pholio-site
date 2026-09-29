/**
 * Header variants.
 *
 * "The Index" (components/header/VariantIndex.tsx) is the site's header. It is
 * one of the four surfaces carried across from the previous site intact.
 *
 * "The Studio+ header" (components/header/VariantStudioPlus.tsx) is the Index
 * carried into /studio-plus, and renders there by route
 * (`defaultHeaderVariantFor`). It is not a second design of the header: same
 * marks, same index, no paper over the film, and a running title.
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
  {
    id: "studio-plus",
    index: "02",
    name: "The Studio+ header",
    thesis:
      "The Index inside Studio+'s film. The same marks and index; once the overture's title has left the frame, Studio+ runs beside the wordmark as the page's running head.",
    structure: "No bar · two corner marks and a running title, full-screen drawer",
    behaviour:
      "Never lays paper or the gold sweep across the film: the title scrim over dark frames, bare over light ones. Polarity is sampled live.",
    cta: "Unchanged from the Index. The page carries its own action at the finale.",
    tradeoff:
      "Over the page's flowing sections the marks sit on moving type with only the scrim behind them, which the Index would have papered over.",
  },
] as const;

export type HeaderVariantId = (typeof HEADER_VARIANTS)[number]["id"];

/** What the live site renders when no `?header=` override is set. */
export const DEFAULT_HEADER_VARIANT: HeaderVariantId = "index";

/** Routes that carry their own header by default. An override still wins. */
const ROUTE_HEADER_VARIANTS: Record<string, HeaderVariantId> = {
  "/studio-plus": "studio-plus",
};

export function defaultHeaderVariantFor(
  pathname: string | null,
): HeaderVariantId {
  return (pathname && ROUTE_HEADER_VARIANTS[pathname]) || DEFAULT_HEADER_VARIANT;
}

export function isHeaderVariantId(
  value: string | null | undefined,
): value is HeaderVariantId {
  return !!value && HEADER_VARIANTS.some((variant) => variant.id === value);
}
