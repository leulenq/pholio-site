"use client";

import { useEffect } from "react";

import { mountPressMotion } from "./motion";

/** Starts the kit's motion and controls on the rendered HTML, and stops them on leave. */
export default function PressMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-press]");
    if (!root) return;
    return mountPressMotion(root);
  }, []);

  return null;
}
