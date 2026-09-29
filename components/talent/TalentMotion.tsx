"use client";

import { useEffect } from "react";

import { mountTalent } from "./motion";

/** Starts the page's motion on the rendered HTML, and stops it on leave. */
export default function TalentMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-talent]");
    if (!root) return;
    return mountTalent(root);
  }, []);

  return null;
}
