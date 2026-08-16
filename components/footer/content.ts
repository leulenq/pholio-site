/**
 * Every string the footer puts on screen, in one file, so the copy audit
 * (banned-ui §9) can be run by reading one short file cold.
 *
 * The rules that bite hardest here: zero em-dashes, no middle dots as
 * separators, no invented numbers, no atmospheric place-dressing, no emoji.
 */

import { COMPANY_NAME, SUPPORT_EMAIL } from "@/lib/legal-constants";

/** The four groups under the mark. */
export const LABEL = {
  product: "Product",
  company: "Company",
  legal: "Legal",
  contact: "Contact",
} as const;

export const CONTACT_EMAIL = SUPPORT_EMAIL;

export const COOKIE_LABEL = "Cookie preferences";

/**
 * Social channels, the three that matter in this industry.
 *
 * ⚠️ PLACEHOLDERS. `href` is null because Pholio's accounts do not exist yet,
 * and a footer link that goes nowhere is worse than no link. They render as
 * marks rather than links until a handle is filled in here, at which point they
 * become links with no other change. Do not guess a URL: an invented profile
 * address is an invented fact, and this is an audience that checks.
 */
export const SOCIAL: ReadonlyArray<{
  label: string;
  href: string | null;
}> = [
  { label: "Instagram", href: null },
  { label: "LinkedIn", href: null },
  { label: "X", href: null },
];

/**
 * PRIMARY_NAV holds its labels in caps because the header sets them in tracked
 * caps. The footer reads at sentence case.
 */
export function productLabel(label: string): string {
  if (label === "STUDIO+") return "Studio+";
  return label.charAt(0) + label.slice(1).toLowerCase();
}

export function copyright(): string {
  return `© ${new Date().getFullYear()} All rights reserved.`;
}
