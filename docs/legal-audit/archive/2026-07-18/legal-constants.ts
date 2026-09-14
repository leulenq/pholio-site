export const COMPANY_NAME = "Pholio Studio, Inc.";
// A postal address must not be fabricated in a public legal document. Leave this
// blank until the company's counsel-approved service address is available.
export const COMPANY_ADDRESS = "";
export const GOVERNING_LAW_STATE = "Delaware";
export const ARBITRATION_SEAT = "Delaware";

export const LAST_UPDATED = "July 18, 2026";
export const EFFECTIVE_DATE = "July 18, 2026";

/**
 * The published version of the legal documents in this repo.
 *
 * ⚠️ CROSS-REPO CONTRACT — pholio-app gates user acceptance on this value.
 * `pholio-app/src/shared/lib/legal-versions.js` holds the app's copy, and the
 * app re-prompts every user when its copy changes.
 *
 * When you revise Terms, Privacy, or any incorporated document here:
 *   1. bump this constant, AND
 *   2. bump CURRENT_LEGAL_VERSION in pholio-app to match, AND
 *   3. add a plain-language TERMS_CHANGELOG entry there describing the change.
 *
 * Skipping steps 2–3 is exactly how the 2026-07-18 revision shipped while the
 * app kept recording acceptance against 2026-06-25: no user was re-prompted,
 * and the acceptance audit trail pointed at a version that was no longer served.
 * Editing document content *without* bumping this version has the same effect.
 */
export const CURRENT_LEGAL_VERSION = "2026-07-18";

export const LEGAL_EMAIL = "legal@pholio.studio";
export const PRIVACY_EMAIL = "privacy@pholio.studio";
export const DMCA_EMAIL = "dmca@pholio.studio";
export const SUPPORT_EMAIL = "hello@pholio.studio";
