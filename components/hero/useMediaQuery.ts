"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media query as an external store.
 *
 * `useState` + an effect would work, but it hydrates as a mismatch: the server
 * has no viewport and no motion preference, so a tree branched on the result
 * renders one way on the server and another on the client. `useSyncExternalStore`
 * is the sanctioned shape for this -- React hydrates with the server snapshot
 * and re-renders with the real one, and it keeps the setState-out-of-effects
 * rule in `eslint.config.mjs` satisfied.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  // The server has neither a viewport nor a motion preference.
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
