/**
 * Talent launch — where the site's talent CTAs point before and after launch.
 *
 * ⚠️ CROSS-REPO CONTRACT. The app holds talent signup and every talent surface
 * closed until launch (`pholio-app/src/shared/lib/talent-launch.js`) and sends
 * everyone it turns away to `/opening` on this site. Until launch, this site's
 * talent CTAs go to `/opening` too, so a visitor never lands on a door the app
 * will shut.
 *
 * Launch day is two switches, one per repo:
 *   - app: `TALENT_LAUNCH_AT` (opens itself at the set time);
 *   - here: `NEXT_PUBLIC_TALENT_SIGNUP_OPEN=1`, then redeploy. The value is
 *     inlined at build, so it takes a deploy to flip.
 * Between the two, `/opening` reads the app's live status and offers the way
 * in, so the order does not matter.
 *
 * Agency CTAs are untouched: agencies keep using `/agency/request-access`.
 */

export const TALENT_SIGNUP_OPEN = process.env.NEXT_PUBLIC_TALENT_SIGNUP_OPEN === "1";

export const OPENING_PATH = "/opening";

/** Which CTA sent the visitor. Stored with the address; the app accepts only these. */
export type OpeningSource = "talent" | "studio";

/** The app href after launch; the notify page before it. */
export function talentSignupHref(appHref: string, source: OpeningSource = "talent"): string {
  if (TALENT_SIGNUP_OPEN) return appHref;
  return source === "studio" ? `${OPENING_PATH}?for=studio` : OPENING_PATH;
}
