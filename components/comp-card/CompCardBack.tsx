import { useDeferredCardAsset } from "./assets";

const BACK_OUTPUT =
  "/generated/comp-card/ola-editorial-masthead-back-composed.png";

/**
 * Page two of the card the home scene flips, composed by hand rather than by
 * the engine: four photographs in a flat 2x2 grid of portrait cells, each one
 * framed against a landmark in the frame instead of centre-cropped, over a
 * quiet stats band at the foot. Same talent record and same photographs as the
 * front; the front stays the composed engine's `editorial-masthead` output, so
 * both sides carry one display voice.
 *
 * Regenerate with `node scripts/comp-card-back/render.cjs`.
 *
 * The stats print only the fields the talent record actually carries — the
 * template is built for the full agency order (height, bust, waist, hips,
 * dress, shoes, hair, eyes) and prints the non-null prefix of it, today just
 * hair and eyes. Nothing is invented and no placeholder stands in for a
 * missing measurement; the band reserves the leading either way, so the
 * layout does not move when the record is completed.
 */
export default function CompCardBack() {
  const src = useDeferredCardAsset(BACK_OUTPUT);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      loading="lazy"
      decoding="async"
      alt="Comp card, back"
      className="block h-full w-full object-cover"
      draggable={false}
    />
  );
}
