"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { SiteMarks } from "./motion";

/**
 * The channel between this page and Zofia's page.
 *
 * Her site is a separate document at /ola, framed same-origin with
 * `?embed`. In that mode it runs no smooth-scroll layer and no intro, hides
 * its scrollbar, and speaks two messages:
 *
 *   in   { t: "zn:scroll", y }   set the document's scroll position
 *   in   { t: "zn:intro", p }    scrub the masthead's own intro, 0..1
 *   in   { t: "zn:marks" }       report the marks again
 *   out  { t: "zn:ready", marks } where its scenes begin, sent at boot and
 *                                  on resize (see `SiteMarks`)
 *
 * Origin-checked both ways. Nothing else crosses the boundary: no styles,
 * no DOM, no state. Her page stays her page.
 */
export function useSiteFrame() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [marks, setMarks] = useState<SiteMarks | null>(null);
  const marksRef = useRef<SiteMarks | null>(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data as { t?: string; marks?: SiteMarks } | null;
      if (!data || data.t !== "zn:ready" || !data.marks) return;
      if (ref.current && e.source !== ref.current.contentWindow) return;
      marksRef.current = data.marks;
      setMarks(data.marks);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const post = useCallback((message: object) => {
    ref.current?.contentWindow?.postMessage(message, window.location.origin);
  }, []);

  /** The last position sent, so a settled scroll is not re-sent every frame. */
  const lastY = useRef(-1);
  const scrollTo = useCallback(
    (y: number) => {
      const rounded = Math.round(y);
      if (rounded === lastY.current) return;
      lastY.current = rounded;
      post({ t: "zn:scroll", y: rounded });
    },
    [post],
  );

  const lastIntro = useRef(-1);
  const intro = useCallback(
    (p: number) => {
      const q = Math.round(p * 1000) / 1000;
      if (q === lastIntro.current) return;
      lastIntro.current = q;
      post({ t: "zn:intro", p: q });
    },
    [post],
  );

  const requestMarks = useCallback(() => post({ t: "zn:marks" }), [post]);

  return { ref, marks, marksRef, scrollTo, intro, requestMarks };
}
