"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  defaultHeaderVariantFor,
  isHeaderVariantId,
  type HeaderVariantId,
} from "@/lib/header-variants";
import { fieldForPath } from "@/lib/viewport-canvas";
// Use the directory entrypoint explicitly so it cannot collide with the
// top-level `Header.tsx` on case-insensitive filesystems.
import { HEADER_COMPONENTS } from "@/components/header/index";

const STORAGE_KEY = "pholio:header-variant";

/**
 * The route's *starting* polarity, and nothing more.
 *
 * The header samples the paper directly beneath the bar while scrolling
 * (`useFieldPolarity` in components/header/kit.tsx) and flips itself when a
 * page changes field mid-scroll. This function only answers "what is under the
 * bar before the first sample lands", so it exists to prevent one frame of the
 * wrong polarity — not to describe the page.
 *
 * Ink is the default because the document canvas is velvet. Legal documents are
 * the site's cream surfaces: long-form reading is set on paper. The list lives
 * in `lib/viewport-canvas.ts` so the browser chrome and the header open on the
 * same paper. The agency request page opens on velvet and lights to cream
 * while it is used, so it is deliberately not listed: the live sampler follows
 * it.
 */
/**
 * Reads a header direction from `?header=<id>` and remembers it for the tab, so
 * a direction can be walked through the whole site while it is being reviewed.
 * Nothing is persisted for ordinary visitors: with no override, the route's
 * default renders (`defaultHeaderVariantFor`). `?header=reset` clears it.
 *
 * There is deliberately no on-page indicator of which variant is applied —
 * anything pinned to the viewport competes with the header itself.
 */
function useHeaderVariant(): HeaderVariantId {
  const [override, setOverride] = useState<HeaderVariantId | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromQuery = new URLSearchParams(window.location.search).get("header");

    if (fromQuery === "reset") {
      window.sessionStorage.removeItem(STORAGE_KEY);
      setOverride(null);
      return;
    }
    if (isHeaderVariantId(fromQuery)) {
      window.sessionStorage.setItem(STORAGE_KEY, fromQuery);
      setOverride(fromQuery);
      return;
    }

    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (isHeaderVariantId(stored)) {
      setOverride(stored);
    }
  }, [pathname]);

  /* A route's own edition (Studio+) unless a review override is set. */
  return override ?? defaultHeaderVariantFor(pathname);
}

export default function HeaderWrapper() {
  const pathname = usePathname();
  const Header = HEADER_COMPONENTS[useHeaderVariant()];

  return <Header theme={fieldForPath(pathname)} />;
}
