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
  /**
   * Legal entries only: whether the footer links this document.
   *
   * Every document in the corpus is published, routed and crawlable whether or
   * not this is true. The flag decides one thing: whether the footer, which
   * appears on every page of the site, carries a standing link to it. A
   * document without one is still reached the way most legal documents are
   * actually reached, from a link in the context that raises it.
   */
  inFooter?: boolean;
}

/** Audience doors and the product tier. The header index's main column. */
export const PRIMARY_NAV: readonly NavEntry[] = [
  { label: "TALENT", href: "/talent", kind: "door", built: true },
  { label: "AGENCIES", href: "/agencies", kind: "door", built: false },
  { label: "STUDIO+", href: "/studio-plus", kind: "tier", built: false },
] as const;

/** Company pages. The header index's clerical column. */
export const SECONDARY_NAV: readonly NavEntry[] = [
  { label: "About", href: "/about", kind: "door", built: true },
  { label: "Careers", href: "/careers", kind: "door", built: false },
  { label: "Contact", href: "/contact", kind: "door", built: false },
  { label: "Press", href: "/press", kind: "door", built: false },
] as const;

/**
 * Legal documents. Built and live — these are the site's only finished pages.
 *
 * Deliberately absent from the header index: nobody navigates to Terms from a
 * masthead.
 *
 * `inFooter` is the standing-link list, and it is deliberately short. Eight
 * entries made the footer's legal column its longest by a wide margin on every
 * page of the site, which put the most weight on the least interesting thing in
 * it. The four that stay are the ones a visitor looks for without being sent:
 * the contract, what happens to their data, the cookie record they can withdraw,
 * and how to report someone else's material. The four that go are reached from
 * the context that raises them, which is how they are actually read:
 *
 *   AI notice            → linked from Terms and Privacy
 *   Community guidelines → linked from Terms, and from the app on posting
 *   Submission programme → linked from the submission flow
 *   Take it down         → linked from Copyright, and from any reporting path
 *
 * Removing a link here does not unpublish anything. Every route below stays
 * live and crawlable.
 */
export const LEGAL_NAV: readonly NavEntry[] = [
  { label: "Terms", href: "/terms", kind: "door", built: true, inFooter: true },
  {
    label: "Privacy",
    href: "/privacy",
    kind: "door",
    built: true,
    inFooter: true,
  },
  {
    label: "Cookies",
    href: "/cookies",
    kind: "door",
    built: true,
    inFooter: true,
  },
  {
    label: "Copyright",
    href: "/dmca",
    kind: "door",
    built: true,
    inFooter: true,
  },
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

/** The legal documents the footer carries a standing link to. */
export const FOOTER_LEGAL_NAV = LEGAL_NAV.filter((entry) => entry.inFooter);

export const isBuilt = (entry: NavEntry) => entry.built;
