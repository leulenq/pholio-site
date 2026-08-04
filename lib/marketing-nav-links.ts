/**
 * The public site's information architecture.
 *
 * This is the ONE place a route becomes navigable. The header index reads it,
 * and anything else that needs to link across the site should read it too.
 *
 * `built` is the switch. Every route the site intends to have is declared here
 * from day one so the shape of the site is legible in a single file, but only
 * `built: true` entries render. Ship the page, flip the flag, in the same
 * commit — that is the whole protocol, and it is why the index can never link
 * to a 404.
 *
 * The primary list is not a flat set of pages. TALENT and AGENCIES are audience
 * doors; STUDIO+ is a product tier. The header expresses that difference, so
 * keep `kind` accurate when adding an entry.
 */

export interface NavEntry {
  label: string;
  href: string;
  /** `door` = an audience entrance. `tier` = a product level. */
  kind: "door" | "tier";
  /** Renders only when the route exists. Flip it in the commit that ships it. */
  built: boolean;
}

/** Audience doors and the product tier. The header index's main column. */
export const PRIMARY_NAV: readonly NavEntry[] = [
  { label: "TALENT", href: "/talent", kind: "door", built: false },
  { label: "AGENCIES", href: "/agencies", kind: "door", built: false },
  { label: "STUDIO+", href: "/studio-plus", kind: "tier", built: false },
] as const;

/** Company pages. The header index's clerical column. */
export const SECONDARY_NAV: readonly NavEntry[] = [
  { label: "About", href: "/about", kind: "door", built: false },
  { label: "Careers", href: "/careers", kind: "door", built: false },
  { label: "Contact", href: "/contact", kind: "door", built: false },
  { label: "Press", href: "/press", kind: "door", built: false },
] as const;

/**
 * Legal documents. Built and live — these are the site's only finished pages.
 *
 * Deliberately absent from the header index: nobody navigates to Terms from a
 * masthead. They are reached from a link in context, or from the footer once
 * the footer is designed.
 */
export const LEGAL_NAV: readonly NavEntry[] = [
  { label: "Terms", href: "/terms", kind: "door", built: true },
  { label: "Privacy", href: "/privacy", kind: "door", built: true },
  { label: "Cookies", href: "/cookies", kind: "door", built: true },
  { label: "Copyright", href: "/dmca", kind: "door", built: true },
  { label: "AI notice", href: "/ai-notice", kind: "door", built: true },
  {
    label: "Community guidelines",
    href: "/community-guidelines",
    kind: "door",
    built: true,
  },
  {
    label: "Submission programme",
    href: "/legal/submission-program",
    kind: "door",
    built: true,
  },
  { label: "Take it down", href: "/take-it-down", kind: "door", built: true },
] as const;

export const isBuilt = (entry: NavEntry) => entry.built;
