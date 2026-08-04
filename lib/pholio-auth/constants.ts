export const PHOLIO_AUTH_CHANNEL = "pholio-auth";
export const PUBLIC_SESSION_PATH = "/api/public/session";

/**
 * Mirrors REQUEST_HEADER / REQUEST_HEADER_VALUE in
 * pholio-app/src/shared/middleware/same-origin-mutation.js. Required on every
 * mutation this site sends to the app API (/api/login, /api/logout).
 */
export const SAME_ORIGIN_HEADER = "X-Pholio-Request";
export const SAME_ORIGIN_VALUE = "same-origin";

/**
 * Fallback only — the app returns `dashboardPath` on /api/public/session and
 * that value wins. Mirrors dashboardPathForRole() in
 * pholio-app/src/routes/api/public.js; keep the two in step.
 */
export function dashboardPathForRole(role?: string) {
  if (role === "AGENCY") return "/dashboard/agency";
  if (role === "TALENT") return "/dashboard/talent";
  return "/dashboard/talent";
}
