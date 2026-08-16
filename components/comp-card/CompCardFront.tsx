const FRONT_OUTPUT = "/generated/comp-card/ola-house-classic-front.png";

/**
 * Page one of the real two-sided card emitted by pholio-app's composed
 * comp-card engine, edition `house-classic` (The Standard).
 * Regenerate with `node scripts/render-comp-cards.cjs`.
 */
export default function CompCardFront() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={FRONT_OUTPUT}
      alt="Comp card, front"
      className="block h-full w-full object-cover"
      draggable={false}
    />
  );
}
