/**
 * The agency requirement register — the API contract.
 *
 * ⚠️ CROSS-REPO CONTRACT. This mirrors the allowlist projection in
 * `pholio-app/src/domains/spec-registry/public-projection.js`. The app decides
 * what is publishable; this file only describes the shape that arrives. When
 * the projection changes, change this file too.
 *
 * WHAT THESE PAGES ARE FOR
 *
 * "How do I apply to ⟨agency⟩" is a real search, and the space currently
 * answering it is filled with liars: one site charges $149 to spray photos at
 * "250+ agencies", another publishes scraped requirements beside a fabricated
 * rating. The binding constraints are genuinely invisible — they live in the
 * form's DOM. An iPhone's default photo format is silently rejected by two of
 * the majors and accepted by a third, and nobody tells models this.
 *
 * So the pages exist to state those constraints plainly, say when each was last
 * checked, and say what an agency does not publish rather than inventing it.
 * That last part is the whole differentiator, and it is why `notPublished`
 * below is rendered as prominently as the requirements themselves.
 *
 * READ-ONLY, UNAUTHENTICATED, AND FETCHED SERVER-SIDE. Nothing here touches a
 * session; there is no talent data in this payload and there must never be.
 */

/** Where the app lives. Server-side only — these pages never fetch from the browser. */
const APP_ORIGIN =
  process.env.APP_BACKEND_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_APP_URL || "https://app.pholio.studio");

/**
 * Half an hour, matching the app's own Cache-Control. The underlying research
 * moves on a cadence of months; the short window is so a *correction* reaches
 * readers the same day, which matters more than freshness of the data itself.
 */
const REVALIDATE_SECONDS = 1800;

export interface RegistryVerification {
  authority: string | null;
  registryName: string | null;
  licenseNumber: string | null;
  status: string | null;
  expiresOn: string | null;
}

export interface AgencySummary {
  seriesId: string;
  organization: { id: string | null; name: string | null };
  office: { name: string } | null;
  market: { label: string | null; city: string | null };
  channel: { type: string | null };
  checked: { reviewedOn: string | null; freshness: string | null };
  verification: RegistryVerification | null;
}

export interface RequirementSlot {
  id: string | null;
  /** Pholio's reading, in the registry's own vocabulary. May be empty. */
  reading: string[];
  /** The agency's own sentence. Outranks the reading when they disagree. */
  sourceLabel: string | null;
  modality: string | null;
  minimum: number | null;
  maximum: number | null;
}

export interface FileRule {
  id: string | null;
  modality: string | null;
  field: string | null;
  operator: string | null;
  /** A scalar for a size cap; an array of MIME types for a format list. */
  value: number | string | string[] | null;
  unit: string | null;
  sourceLabel: string | null;
}

export interface EligibilityRule {
  id: string | null;
  modality: string | null;
  field: string | null;
  operator: string | null;
  value: number | string | null;
  unit: string | null;
  sourceLabel: string | null;
}

export interface AgencyDetail extends AgencySummary {
  revision: number | null;
  channel: { type: string | null; url: string | null };
  requirements: {
    shotCount: { minimum: number | null; maximum: number | null };
    slots: RequirementSlot[];
    /** Constraint rules, same shape as eligibility — not an object of named caps. */
    files: FileRule[];
    eligibility: EligibilityRule[];
  };
  /** What this agency does NOT publish. The reason the page is worth reading. */
  notPublished: { fact: string | null; reason: string | null; note: string | null }[];
  sources: {
    publisher: string | null;
    title: string | null;
    url: string | null;
    retrievedOn: string | null;
    authority: string | null;
  }[];
  checked: {
    observedOn: string | null;
    reviewedOn: string | null;
    nextReviewOn: string | null;
    freshness: string | null;
  };
  disclosure: string | null;
}

/**
 * The register, or null if the app cannot serve it.
 *
 * Null rather than an empty array, deliberately. An empty list would render as
 * "Pholio tracks no agencies", which is a different and false statement, and
 * one that would then sit in the CDN for half an hour. The caller renders an
 * explicit unavailable state instead.
 */
export async function fetchAgencyRegister(): Promise<AgencySummary[] | null> {
  try {
    const response = await fetch(`${APP_ORIGIN}/api/public/registry/agencies`, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { accept: "application/json" },
    });
    if (!response.ok) return null;
    const body = await response.json();
    const agencies = body?.data?.agencies;
    return Array.isArray(agencies) ? agencies : null;
  } catch {
    // A marketing page must not 500 because the app is redeploying.
    return null;
  }
}

/**
 * Normalise a series id that may arrive already URL-encoded.
 *
 * Next hands dynamic route params back in their encoded form, and every series
 * id contains a colon — `img-models-global:online`. Encoding that a second time
 * produces `%253A`, which 404s against the app. Every agency page would have
 * been a 404 in production, and only a build against a request log made it
 * visible; the page still rendered, it just rendered "not found".
 *
 * Decoding first is safe here because a series id is `[a-z0-9-]+:[a-z0-9-]+` by
 * construction and can never legitimately contain a percent sign.
 */
function normalizeSeriesId(seriesId: string): string {
  return seriesId.includes("%") ? decodeURIComponent(seriesId) : seriesId;
}

/** One agency's published requirements, or null when absent, delisted or unavailable. */
export async function fetchAgency(seriesId: string): Promise<AgencyDetail | null> {
  try {
    const response = await fetch(
      `${APP_ORIGIN}/api/public/registry/agencies/${encodeURIComponent(normalizeSeriesId(seriesId))}`,
      { next: { revalidate: REVALIDATE_SECONDS }, headers: { accept: "application/json" } },
    );
    if (!response.ok) return null;
    const body = await response.json();
    return body?.data ?? null;
  } catch {
    return null;
  }
}

/* ── presentation helpers ────────────────────────────────────────────────── */

const CHANNEL_WORDS: Record<string, string> = {
  official_form: "an online form",
  official_email: "email",
  official_instagram: "Instagram",
};

/** How submissions reach this agency, in a sentence fragment. */
export function channelPhrase(type: string | null): string {
  if (!type) return "a channel Pholio has not recorded";
  return CHANNEL_WORDS[type] || type.replace(/_/g, " ");
}

/**
 * "3 MB", "500 KB" — file caps are the constraint people actually trip on.
 *
 * DECIMAL, not binary, and that is not a rounding preference. These values were
 * read off sentences agencies wrote: "File sizes must be less than 3MB",
 * "Images cannot be over 30 MB" — and they mean 3,000,000 and 30,000,000. Doing
 * the binary conversion renders "28.6 MB" directly beside a quote saying 30,
 * which makes Pholio look wrong about the one number on the page a reader might
 * act on. Matching the source's own units is the whole job here.
 */
export function formatBytes(bytes: number | null): string | null {
  if (!bytes || bytes <= 0) return null;
  if (bytes >= 1_000_000) {
    const mb = bytes / 1_000_000;
    return `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB`;
  }
  return `${Math.round(bytes / 1000)} KB`;
}

/**
 * An eligibility rule as a sentence, when Pholio can write one honestly.
 *
 * Height arrives in centimetres because that is what the registry stores, but
 * an American reader applying to a New York agency thinks in feet and inches,
 * and a requirement someone has to convert is a requirement they may misjudge.
 * Both are shown.
 */
export function eligibilityPhrase(rule: EligibilityRule): string | null {
  if (rule.field !== "applicant.height_cm" || typeof rule.value !== "number") return null;
  const totalInches = rule.value / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  const imperial = `${feet}′${inches}″`;
  const cm = `${Math.round(rule.value)} cm`;
  const direction = rule.operator === "gte" ? "at least" : rule.operator === "lte" ? "up to" : "";
  return `Height ${direction} ${imperial} (${cm})`.replace(/\s+/g, " ").trim();
}

/** Modality in the reader's terms: what happens if they do not meet it. */
export function modalityPhrase(modality: string | null): string | null {
  if (modality === "required") return "Required";
  if (modality === "requested") return "Asked for";
  if (modality === "preferred") return "Preferred, not required";
  return null;
}

/**
 * A file constraint as a sentence.
 *
 * This is the quiet killer the whole page exists for: an iPhone shoots HEIC by
 * default, and several of these forms reject it without explaining why. So the
 * format rule is rendered as extensions people recognise rather than MIME
 * types, and HEIC's presence or absence is the fact worth reading.
 */
export function fileRulePhrase(rule: FileRule): string | null {
  if (rule.field === "file.size_bytes" && typeof rule.value === "number") {
    const size = formatBytes(rule.value);
    if (!size) return null;
    const bound = rule.operator === "lt" ? "under" : "up to";
    return `Each file ${bound} ${size}`;
  }
  if (rule.field === "file.mime_type" && Array.isArray(rule.value)) {
    const extensions = rule.value
      .map((mime) => mime.split("/")[1]?.toUpperCase())
      .filter(Boolean);
    if (extensions.length === 0) return null;
    return `Accepted formats: ${extensions.join(", ")}`;
  }
  return null;
}

/** Does this agency accept what an iPhone shoots by default? */
export function heicNote(rules: FileRule[]): string | null {
  const formatRule = rules.find(
    (r) => r.field === "file.mime_type" && Array.isArray(r.value),
  );
  if (!formatRule || !Array.isArray(formatRule.value)) return null;
  return formatRule.value.includes("image/heic")
    ? "HEIC is accepted, so photos straight from an iPhone are fine."
    : "HEIC is not accepted. Photos straight from an iPhone need converting to JPEG first — this is the most common silent rejection.";
}
