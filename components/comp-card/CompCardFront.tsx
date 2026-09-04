import { useDeferredCardAsset } from "./assets";

const FRONT_OUTPUT = "/generated/comp-card/ola-editorial-masthead-front.png";

/**
 * Page one of the real two-sided card emitted by pholio-app's composed
 * comp-card engine, edition `editorial-masthead` (The Masthead).
 * Regenerate with `node scripts/render-comp-cards.cjs`.
 */
export default function CompCardFront() {
  const src = useDeferredCardAsset(FRONT_OUTPUT);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      loading="lazy"
      decoding="async"
      alt="Comp card, front"
      className="block h-full w-full object-cover"
      draggable={false}
    />
  );
}
