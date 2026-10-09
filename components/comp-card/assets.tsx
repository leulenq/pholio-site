"use client";

import { createContext, useContext } from "react";

/**
 * Whether the comp-card beat's images are allowed to start downloading.
 *
 * These plates are ~7MB and they live inside the home stage's pinned
 * container, which means the browser treats them as in-viewport and fetches
 * them eagerly from the SSR markup — before the hero's own frame sequence and
 * before the page's JS. Measured cold on Fast 4G that delayed the hero's
 * opening frames from 1.8s to 7.9s, and on Slow 4G from 5.0s to 23.2s.
 *
 * The beat itself does not begin until ~63% of an 1130vh stage, so nothing
 * here is needed early. `CompCardLayers` arms this once the hero's opening is
 * in hand; everywhere else (the reduced-motion section, which is below the
 * fold and lazy) the default of `true` keeps behaviour unchanged.
 */
const CompCardAssetsContext = createContext(true);

export const CompCardAssetsProvider = CompCardAssetsContext.Provider;

/** Returns the src once the beat is armed, and `undefined` before that, which
    renders an <img> with no src and therefore issues no request. */
export function useDeferredCardAsset(src: string): string | undefined {
  return useContext(CompCardAssetsContext) ? src : undefined;
}
