import type { Metadata } from "next";

import { CareersHero } from "@/components/careers/CareersHero";
import { CareersContent } from "@/components/careers/CareersContent";

/**
 * /careers — the previous site's Careers page, replicated here on the owner's
 * instruction (2026-09-27). The composition, copy and motion belong to
 * `pholio-landing`; see the notes in the two components for what was carried
 * across verbatim, what is flagged for rewrite, and the one affordance that
 * was repaired.
 *
 * The footer is the root layout's, so this route mounts the page's two
 * sections and nothing else.
 */
export const metadata: Metadata = {
  title: "Careers",
  description:
    "Open roles at Pholio across engineering, design, and strategy, and how to apply.",
};

export default function Careers() {
  return (
    <div className="bg-[#050505]">
      <CareersHero />
      <CareersContent />
    </div>
  );
}
