"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  applyViewportCanvas,
  canvasForPath,
  canonicalCanvasColor,
} from "@/lib/viewport-canvas";

const OPAQUE_SKIP = new Set(["rgba(0, 0, 0, 0)", "transparent"]);

/**
 * Phones and tablets, plus a desktop window dragged down to the narrow
 * stage. A wide fine-pointer display has no browser-chrome bands, and the
 * 4px edge samples would be a visible hairline there.
 */
const MOBILE_CHROME = "(pointer: coarse), (max-width: 1024px)";

function effectiveOpacity(el: HTMLElement): number {
  let value = 1;
  let node: HTMLElement | null = el;
  while (node && node !== document.body) {
    const own = Number(window.getComputedStyle(node).opacity);
    if (Number.isFinite(own)) value *= own;
    if (value === 0) return 0;
    node = node.parentElement;
  }
  return value;
}

/**
 * First opaque paper at this viewport Y, ignoring the edge samples
 * themselves. Transparent fixed chrome (the resting header) falls through
 * to the page underneath.
 */
function sampleAt(y: number): string | null {
  const width = window.innerWidth;
  const xs = [24, width / 2, Math.max(24, width - 24)];

  for (const x of xs) {
    const stack = document.elementsFromPoint(x, y);
    for (const el of stack) {
      if (!(el instanceof HTMLElement)) continue;
      if (el.dataset.viewportSentinel !== undefined) continue;
      if (el === document.body || el === document.documentElement) continue;
      const bg = window.getComputedStyle(el).backgroundColor;
      if (OPAQUE_SKIP.has(bg)) continue;
      const match = bg.match(
        /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+%?))?\)/,
      );
      if (!match) continue;
      const rawAlpha = match[4];
      const alpha = rawAlpha === undefined
        ? 1
        : rawAlpha.endsWith("%")
          ? Number(rawAlpha) / 100
          : Number(rawAlpha);
      if (alpha * effectiveOpacity(el) < 0.85) continue;
      return canonicalCanvasColor(
        `rgb(${match[1]}, ${match[2]}, ${match[3]})`,
      );
    }
  }
  return null;
}

function sampleEdges(): { top: string; bottom: string } {
  const fallback = canonicalCanvasColor(canvasForPath(window.location.pathname))!;
  const topY = 1;
  const bottomY = Math.max(topY + 1, window.innerHeight - 1);
  const top = sampleAt(topY) ?? fallback;
  const bottom = sampleAt(bottomY) ?? top;
  return { top, bottom };
}

/**
 * Keeps the document canvas, and two edge samples Safari 26 reads as the
 * status-bar and toolbar tint, equal to the paper actually at those edges.
 *
 * The samples are 4px because that is the strip WebKit requires before it
 * will read a fixed element. They sit in the safe area the system chrome
 * already covers, and they are `pointer-events: none`. On a wide fine
 * pointer they are hidden in CSS.
 */
export default function ViewportCanvas() {
  const pathname = usePathname();
  const [edges, setEdges] = useState<{ top: string; bottom: string } | null>(null);

  useEffect(() => {
    applyViewportCanvas(canvasForPath(pathname));

    const mobile = window.matchMedia(MOBILE_CHROME);
    let frame = 0;
    let observer: MutationObserver | null = null;

    const paint = () => {
      const next = sampleEdges();
      applyViewportCanvas(next.top);
      setEdges((current) =>
        current?.top === next.top && current?.bottom === next.bottom
          ? current
          : next,
      );
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };

    const watch = () => {
      observer?.disconnect();
      observer = null;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
      if (!mobile.matches) return;

      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      window.visualViewport?.addEventListener("resize", schedule);
      window.visualViewport?.addEventListener("scroll", schedule);
      observer = new MutationObserver((records) => {
        const own = records.every(
          (record) =>
            record.target instanceof Element &&
            record.target.hasAttribute("data-viewport-sentinel"),
        );
        if (!own) schedule();
      });
      observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    };

    schedule();
    watch();
    mobile.addEventListener("change", watch);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      mobile.removeEventListener("change", watch);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
    };
  }, [pathname]);

  return (
    <>
      <div
        data-viewport-sentinel="top"
        aria-hidden
        style={edges ? { backgroundColor: edges.top } : undefined}
      />
      <div
        data-viewport-sentinel="bottom"
        aria-hidden
        style={edges ? { backgroundColor: edges.bottom } : undefined}
      />
    </>
  );
}
