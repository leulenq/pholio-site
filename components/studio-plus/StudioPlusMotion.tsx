"use client";

import { useEffect } from "react";

import { mountStudioPlus } from "./motion";

/** Starts the film's motion engine on the rendered HTML, and stops it on leave. */
export default function StudioPlusMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-studio-plus]");
    if (!root) return;
    return mountStudioPlus(root);
  }, []);

  return null;
}
