"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  DEFAULT_HEADER_VARIANT,
  isHeaderVariantId,
  type HeaderVariantId,
} from "@/lib/header-variants";
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
 * the site's cream surfaces: long-form reading is set on paper.
 */
const CREAM_ROUTES = [
  "/terms",
  "/privacy",
  "/cookies",
  "/dmca",
  "/ai-notice",
  "/community-guidelines",
  "/take-it-down",
  "/legal",
];

function fieldForRoute(pathname: string | null): "ink" | "cream" {
  if (!pathname) return "ink";
  return CREAM_ROUTES.some((route) => pathname.startsWith(route))
    ? "cream"
    : "ink";
}

/**
 * Reads a header direction from `?header=<id>` and remembers it for the tab, so
 * a direction can be walked through the whole site while it is being reviewed.
 * Nothing is persisted for ordinary visitors: with no override,
 * DEFAULT_HEADER_VARIANT renders. `?header=reset` clears it.
 *
 * There is deliberately no on-page indicator of which variant is applied —
 * anything pinned to the viewport competes with the header itself.
 */
function useHeaderVariant(): HeaderVariantId {
  const [variant, setVariant] = useState<HeaderVariantId>(DEFAULT_HEADER_VARIANT);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromQuery = new URLSearchParams(window.location.search).get("header");

    if (fromQuery === "reset") {
      window.sessionStorage.removeItem(STORAGE_KEY);
      setVariant(DEFAULT_HEADER_VARIANT);
      return;
    }
    if (isHeaderVariantId(fromQuery)) {
      window.sessionStorage.setItem(STORAGE_KEY, fromQuery);
      setVariant(fromQuery);
      return;
    }

    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (isHeaderVariantId(stored)) {
      setVariant(stored);
    }
  }, [pathname]);

  return variant;
}

export default function HeaderWrapper() {
  const pathname = usePathname();
  const Header = HEADER_COMPONENTS[useHeaderVariant()];

  return <Header theme={fieldForRoute(pathname)} />;
}
