/**
 * Agency access request — the API contract.
 *
 * ⚠️ CROSS-REPO CONTRACT. This mirrors `validateAgencyAccessPayload()` in
 * `pholio-app/src/routes/api/public.js`. The server does the real validation;
 * everything here exists so the client can fail fast and label its fields
 * correctly. When the server's validator changes, change this file too.
 *
 * This is the public site's ONLY write path to the app. It reaches the app
 * through the same-origin `/api/*` rewrite in next.config.ts, so no CORS and no
 * credentials are involved, and it is rate limited server-side (a 60s window,
 * 15/min on serverless, keyed by session user or client IP).
 *
 * ────────────────────────────────────────────────────────────────────────────
 * The page that uses this — `/agency/request-access` — is a HARD DEPENDENCY of
 * pholio-app, not an optional marketing page:
 *
 *   • `GET  /partners` on the app 302s to `${MARKETING_SITE_URL}/agency/request-access`
 *   • `POST /partners` returns 410 Gone with that same URL in the body
 *
 * Until that route exists on this site, both of those hand off to a 404. It is
 * the highest-priority page in the rebuild. See docs/app-integration.md.
 * ────────────────────────────────────────────────────────────────────────────
 *
 * What the endpoint stores: agency and requester metadata only. No roster
 * files, no talent data, no contracts, no billing data, no minor-specific
 * records. Do not widen the payload to carry any of those.
 */

export const AGENCY_ACCESS_ENDPOINT = "/api/public/agency-access-requests";

/** All eleven are required by the server. Omitting one is a 400. */
export interface AgencyAccessRequest {
  agencyName: string;
  /** Bare hosts are accepted; the server prefixes `https://` before parsing. */
  websiteUrl: string;
  primaryMarketCity: string;
  agencyType: string;
  primaryBoards: string[];
  rosterSizeRange: string;
  teamSizeRange: string;
  firstUseCases: string[];
  contactName: string;
  contactEmail: string;
  contactRole: string;

  /* Optional. */
  primaryMarketCountry?: string;
  additionalLocations?: string[];
  currentSystem?: string;
  migrationInterest?: string;
  contactPhone?: string;
  timezone?: string;
  heardFrom?: string;
  notes?: string;
}

/**
 * Server-side length limits, mirrored so a form can set `maxLength` and reject
 * before a round trip. Array fields carry `[maxItems, maxLengthPerItem]`.
 */
export const FIELD_LIMITS = {
  agencyName: 180,
  websiteUrl: 512,
  primaryMarketCity: 120,
  primaryMarketCountry: 120,
  agencyType: 80,
  primaryBoards: [20, 80],
  rosterSizeRange: 40,
  teamSizeRange: 40,
  firstUseCases: [12, 120],
  additionalLocations: [12, 160],
  currentSystem: 120,
  migrationInterest: 20,
  contactName: 160,
  contactEmail: 254,
  contactRole: 120,
  contactPhone: 80,
  timezone: 80,
  heardFrom: 160,
  notes: 500,
} as const;

export const REQUIRED_FIELDS = [
  "agencyName",
  "websiteUrl",
  "primaryMarketCity",
  "agencyType",
  "primaryBoards",
  "rosterSizeRange",
  "teamSizeRange",
  "firstUseCases",
  "contactName",
  "contactEmail",
  "contactRole",
] as const satisfies readonly (keyof AgencyAccessRequest)[];

/**
 * The option vocabularies are defined HERE, on the client, not by the server —
 * the endpoint accepts free strings. That means changing a label changes what
 * lands in the database, and nothing will warn you. Treat edits as data
 * migrations, not copy tweaks.
 */
export const AGENCY_TYPES = [
  "Mother agency",
  "Placement agency",
  "Model management",
  "Talent management",
  "Casting organization",
  "Event producer",
  "Brand or client",
] as const;

export const BOARDS = [
  "Women",
  "Men",
  "Development",
  "Curve",
  "Kids",
  "Classic",
  "Commercial",
  "Talent",
] as const;

export const ROSTER_SIZES = ["1–25", "26–75", "76–150", "151–400", "400+"] as const;

export const TEAM_SIZES = ["1–3", "4–10", "11–25", "26+"] as const;

export const USE_CASES = [
  "Reviewing inbound submissions",
  "Scouting and discovery",
  "Managing an existing roster",
  "Running castings or open calls",
  "Building comp cards and packages",
  "Migrating from another system",
] as const;

/** Field name → message. `"Required"` is the server's marker for a missing field. */
export type AgencyAccessFieldErrors = Partial<
  Record<keyof AgencyAccessRequest, string>
>;

export type AgencyAccessResult =
  | { ok: true; message: string }
  | { ok: false; kind: "validation"; errors: AgencyAccessFieldErrors }
  | { ok: false; kind: "network"; message: string };

/**
 * Submit a request.
 *
 * 201 and 202 are both success. 202 means a request from this email is already
 * open — the server is deliberately idempotent and does NOT disclose that it is
 * a duplicate, so present both outcomes identically. Do not add a "you already
 * applied" state; that would leak which addresses are in the pipeline.
 */
export async function submitAgencyAccessRequest(
  payload: AgencyAccessRequest,
): Promise<AgencyAccessResult> {
  let response: Response;

  try {
    response = await fetch(AGENCY_ACCESS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      ok: false,
      kind: "network",
      message: "We couldn't submit your request just now. Please try again shortly.",
    };
  }

  const body = await response.json().catch(() => null);

  if (response.ok && body?.success) {
    return { ok: true, message: body.data?.message ?? DEFAULT_SUCCESS_MESSAGE };
  }

  if (response.status === 400 && body?.errors) {
    return { ok: false, kind: "validation", errors: body.errors };
  }

  return {
    ok: false,
    kind: "network",
    message: "We couldn't submit your request just now. Please try again shortly.",
  };
}

/** Fallback only — the server supplies this string and its copy wins. */
const DEFAULT_SUCCESS_MESSAGE =
  "Your request has been received. Pholio reviews agency access manually and will email next steps if there is a fit.";
