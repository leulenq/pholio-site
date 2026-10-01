"use client";

import { useEffect } from "react";

import { mountHero } from "./hero";
import { mountTalent } from "./motion";

/** Starts the page's motion on the rendered HTML, and stops it on leave. */
export default function TalentMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-talent]");
    if (!root) return;
    const stopHero = mountHero(root);
    const stopPage = mountTalent(root);
    return () => {
      stopHero();
      stopPage();
    };
  }, []);

  return null;
}
