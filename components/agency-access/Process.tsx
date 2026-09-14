"use client";

/**
 * What happens after you submit.
 *
 * Secondary information, so it is collapsed by default: one line the agency
 * can open before sending or after. A native <details> element, which gives
 * the keyboard and the screen reader the disclosure for free; the summary is
 * styled as a line in the page's own register and the marker is the same
 * chevron the choice fields use, turned when open.
 *
 * Inside: four plain sentences and the address to write to. No heading, no
 * rule, no motion.
 */

import { ChevronDown } from "lucide-react";

import { SUPPORT_EMAIL } from "@/lib/legal-constants";

import { PROCESS } from "./content";
import { RuleLink } from "./kit";

export function Process() {
  return (
    <details id={PROCESS.id} className="group scroll-mt-28">
      <summary className="flex w-fit cursor-pointer list-none items-center gap-3 font-sans text-[15px] transition-colors duration-300 hover:text-(--gold) focus-visible:text-(--gold) focus-visible:outline-none [&::-webkit-details-marker]:hidden">
        <span style={{ color: "inherit" }}>{PROCESS.summary}</span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
          className="transition-transform duration-300 group-open:rotate-180"
        />
      </summary>
      <div className="mt-6 max-w-[60ch] space-y-4">
        {PROCESS.steps.map((step) => (
          <p
            key={step}
            className="font-sans text-[15px] font-light leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {step}
          </p>
        ))}
        <p className="pt-2 font-sans text-[15px] font-light leading-relaxed" style={{ color: "var(--muted)" }}>
          {PROCESS.contactBefore}
          <RuleLink href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</RuleLink>
          {PROCESS.contactAfter}
        </p>
      </div>
    </details>
  );
}
