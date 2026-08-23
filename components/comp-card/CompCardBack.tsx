const BACK_OUTPUT = "/generated/comp-card/ola-house-classic-back.png";

/**
 * Page two of the real two-sided card emitted by pholio-app's composed
 * comp-card engine, edition `house-classic` (The Standard).
 * Regenerate with `node scripts/render-comp-cards.cjs`.
 *
 * The stats block prints only the fields the profile actually carries. It is
 * currently thin because the model's measurements have not been supplied; the
 * engine omits what it does not have rather than inventing it, which is the
 * behaviour to preserve.
 */
export default function CompCardBack() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={BACK_OUTPUT}
      alt="Comp card, back"
      className="block h-full w-full object-cover"
      draggable={false}
    />
  );
}
