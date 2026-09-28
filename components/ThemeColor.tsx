"use client";

import { useEffect } from "react";

import { applyViewportCanvas } from "@/lib/viewport-canvas";

/**
 * Immediate hint for a route that already knows its paper, before the root
 * sampler has measured it. Writes the document canvas, not only `theme-color`:
 * Safari 26 tints the status bar and toolbar from that canvas.
 */
export default function ThemeColor({ color }: { color: string }) {
  useEffect(() => {
    applyViewportCanvas(color);
  }, [color]);

  return null;
}
