/**
 * Launch notify list — the API contract behind `/opening`.
 *
 * ⚠️ CROSS-REPO CONTRACT. Mirrors `POST /api/public/launch-notifications` and
 * `GET /api/public/talent-launch` in `pholio-app/src/routes/api/public.js`.
 * Reached through the same-origin `/api/*` rewrite in next.config.ts, rate
 * limited server-side like the agency request.
 *
 * What the app stores: the address and which CTA sent it, nothing else. No
 * email is sent on submission. On launch day
 * `pholio-app/scripts/send-launch-notifications.js` sends one email to each
 * address and deletes it. `/opening` promises exactly that; keep the two true
 * together.
 *
 * 201 and 202 are both success. 202 means the address is already listed; the
 * server does not say so, and neither may the page.
 */

import type { OpeningSource } from "./talent-launch";

export const LAUNCH_NOTIFY_ENDPOINT = "/api/public/launch-notifications";
export const TALENT_LAUNCH_STATUS_ENDPOINT = "/api/public/talent-launch";

/** Mirrors the server's own check, so the page can fail fast. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const EMAIL_MAX_LENGTH = 254;

export type LaunchNotifyResult =
  | { ok: true }
  | { ok: false; kind: "validation" | "network" };

export async function submitLaunchNotify(
  email: string,
  source: OpeningSource,
): Promise<LaunchNotifyResult> {
  let response: Response;
  try {
    response = await fetch(LAUNCH_NOTIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, source }),
    });
  } catch {
    return { ok: false, kind: "network" };
  }
  const body = await response.json().catch(() => null);
  if (response.ok && body?.success) return { ok: true };
  if (response.status === 400) return { ok: false, kind: "validation" };
  return { ok: false, kind: "network" };
}

export interface TalentLaunchStatus {
  open: boolean;
  launchAt: string | null;
}

/** The app's live gate. Null when unreachable; the page then keeps its form. */
export async function fetchTalentLaunchStatus(): Promise<TalentLaunchStatus | null> {
  try {
    const response = await fetch(TALENT_LAUNCH_STATUS_ENDPOINT, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const body = await response.json();
    return body?.success ? { open: body.data.open === true, launchAt: body.data.launchAt ?? null } : null;
  } catch {
    return null;
  }
}
