import type { PublicSession } from "./types";
import {
  PUBLIC_SESSION_PATH,
  SAME_ORIGIN_HEADER,
  SAME_ORIGIN_VALUE,
} from "./constants";

export async function fetchPublicSession(): Promise<PublicSession> {
  const response = await fetch(PUBLIC_SESSION_PATH, {
    credentials: "include",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    return { authenticated: false };
  }

  return response.json();
}


export async function logoutSession() {
  await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      [SAME_ORIGIN_HEADER]: SAME_ORIGIN_VALUE,
    },
  }).catch(() => {});
}
