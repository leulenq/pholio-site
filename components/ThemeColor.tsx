"use client";

import { useEffect } from "react";

/**
 * Keeps Safari / Chrome mobile UI chrome tinted to the page paper.
 * Without this, the document canvas (velvet ink) shows through the
 * translucent browser toolbar as a black band under cream pages.
 */
export default function ThemeColor({ color }: { color: string }) {
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]'
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    const previous = meta.content;
    meta.content = color;
    return () => {
      meta!.content = previous || "#050505";
    };
  }, [color]);

  return null;
}
