"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PHOLIO_APP_ORIGIN } from "@/lib/pholio-app-origin";
import { dashboardPathForRole } from "./constants";
import { subscribeAuthChanges } from "./broadcast";
import { fetchPublicSession, logoutSession } from "./session-api";
import type { PublicSession } from "./types";

type PholioAuthContextValue = {
  session: PublicSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  dashboardHref: string;
};

const PholioAuthContext = createContext<PholioAuthContextValue | null>(null);

export function PholioAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<PublicSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await fetchPublicSession();
    setSession(data);
    setIsLoading(false);
  }, []);

  /**
   * Sign-out is server-authoritative: POST /api/logout destroys the Express
   * session AND revokes the account's Firebase refresh tokens.
   *
   * This site deliberately does NOT run a Firebase client. Firebase Web SDK
   * persistence is per-origin (IndexedDB), so a `signOut()` here could only ever
   * clear www.pholio.studio's own Firebase state — never app.pholio.studio's.
   * The previous client-side signOut therefore could not make logout stick on
   * the app even when NEXT_PUBLIC_FIREBASE_* were configured: the app's
   * PholioAuthBridge would find a live Firebase user, see no Express session,
   * and silently re-create one. Server-side revocation is what actually closes
   * that loop, and it works regardless of client config.
   */
  const logout = useCallback(async () => {
    await logoutSession();
    setSession({ authenticated: false });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (cancelled) return;
      await refresh();
    };

    load();

    const unsubscribeBroadcast = subscribeAuthChanges(() => {
      if (!cancelled) refresh();
    });

    const onFocus = () => {
      if (!cancelled) refresh();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") onFocus();
    });

    const poll = window.setInterval(() => {
      if (!cancelled) refresh();
    }, 60_000);

    return () => {
      cancelled = true;
      unsubscribeBroadcast();
      window.removeEventListener("focus", onFocus);
      window.clearInterval(poll);
    };
  }, [refresh]);

  const dashboardHref = useMemo(() => {
    const path =
      session?.dashboardPath || dashboardPathForRole(session?.role);
    return `${PHOLIO_APP_ORIGIN}${path}`;
  }, [session?.dashboardPath, session?.role]);

  const value = useMemo<PholioAuthContextValue>(
    () => ({
      session,
      isLoading,
      isAuthenticated: session?.authenticated === true,
      refresh,
      logout,
      dashboardHref,
    }),
    [session, isLoading, refresh, logout, dashboardHref],
  );

  return (
    <PholioAuthContext.Provider value={value}>{children}</PholioAuthContext.Provider>
  );
}

export function usePholioAuth() {
  const ctx = useContext(PholioAuthContext);
  if (!ctx) {
    throw new Error("usePholioAuth must be used within PholioAuthProvider");
  }
  return ctx;
}
