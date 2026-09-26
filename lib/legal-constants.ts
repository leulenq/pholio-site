// Candidate corpus. Do not deploy or collect acceptance until the publication
// checklist in docs/legal-audit/architecture-and-launch-review.md is complete.
// The operator was not incorporated in the owner record (lessons.md §6).
export const COMPANY_NAME = "Pholio";
export const COMPANY_ADDRESS = "";
export const LAST_UPDATED = "September 15, 2026";
export const EFFECTIVE_DATE = "Not yet effective (publication pending)";
export const LEGAL_PUBLICATION_STATUS = "draft" as const;

// CROSS-REPO CONTRACT: synchronize with pholio-app/src/shared/lib/legal-versions.js
// and its TERMS_CHANGELOG. This is the candidate release version, not evidence
// of historical publication. Effective dates are independent of version IDs.
export const CURRENT_LEGAL_VERSION = "2026-09-15";

export const LEGAL_EMAIL = "legal@pholio.studio";
export const PRIVACY_EMAIL = "privacy@pholio.studio";
export const DMCA_EMAIL = "dmca@pholio.studio";
export const SUPPORT_EMAIL = "hello@pholio.studio";
