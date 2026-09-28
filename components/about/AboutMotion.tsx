"use client";

import { useEffect } from "react";

import { mountAboutMotion } from "./motion";

/** Starts the page's motion engine on the rendered HTML, and stops it on leave. */
export default function AboutMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-about]");
    if (!root) return;
    return mountAboutMotion(root);
  }, []);

  return null;
}
