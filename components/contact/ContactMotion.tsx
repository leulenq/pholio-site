"use client";

import { useEffect } from "react";

import { mountContactMotion } from "./motion";

/** Starts the page's letters and controls on the rendered HTML, and stops them on leave. */
export default function ContactMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-contact]");
    if (!root) return;
    return mountContactMotion(root);
  }, []);

  return null;
}
