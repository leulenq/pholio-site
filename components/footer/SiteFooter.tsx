"use client";

/**
 * THE CLOSING PANEL
 *
 * Not a footer in the strip-at-the-bottom sense. It owns a viewport, the header
 * stands down while it does, and it reads as the last chapter of the site
 * rather than as content tacked on under the last section.
 *
 * The composition is a single decision: **the mark is the subject, everything
 * else is apparatus.** It spans the measure at the top of the panel, the four
 * groups sit beneath it at clerical scale, and the space between them is what
 * does the work. A footer that gives its largest element to a column heading has
 * not decided what it is for.
 *
 * Four groups, in the order a visitor needs them: what you can use, who is
 * behind it, what you are agreeing to, and how to reach a person.
 *
 * Two deliberate departures from `docs/design-language/05-industry-reference.md`,
 * both owner decisions rather than oversights:
 *
 *  - §3.9 refuses an oversized wordmark at the bottom of a page as a
 *    portfolio-template move. Taken as read, and overruled: the brief is a
 *    closing panel, not a footer, and at panel scale the mark is the
 *    composition rather than an ornament on one.
 *  - §5.3 found that no footer in the sample animates on entry. This one does,
 *    once, on one observer, because the panel has to be *arrived at* for the
 *    takeover to feel deliberate instead of abrupt.
 */

import {
  FOOTER_LEGAL_NAV,
  PRIMARY_NAV,
  SECONDARY_NAV,
} from "@/lib/marketing-nav-links";

import {
  AddressLink,
  Arrive,
  ArriveGroup,
  ColumnRule,
  FooterLink,
  FooterMark,
  FooterSurface,
  GroupLabel,
  Hairline,
  SHELL,
  Signature,
  SocialRow,
} from "./kit";
import { CONTACT_EMAIL, LABEL, productLabel } from "./content";

export default function SiteFooter() {
  return (
    <FooterSurface>
      <ArriveGroup
        className={`relative flex h-full flex-1 flex-col justify-between ${SHELL}`}
        style={{ paddingTop: 64, paddingBottom: 36 }}
      >
        {/* The mark. `flex-1` under it pushes the apparatus to the foot of the
            panel, so on a tall viewport the two are held apart by real space
            rather than by a margin someone guessed. */}
        <Arrive>
          <FooterMark />
        </Arrive>

        <div className="flex-1" style={{ minHeight: 24, maxHeight: 64 }} />

        {/* Four groups, three standing rules. The rules are grid items of their
            own so they stretch to the tallest column and stop there. */}
        <Arrive>
          <Hairline />
          <div
            className="grid gap-x-10 gap-y-8 md:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)_1px_minmax(0,1fr)_1px_minmax(0,1.1fr)]"
            style={{ paddingTop: 32, paddingBottom: 16 }}
          >
            <Group label={LABEL.product} entries={PRIMARY_NAV} display />
            <ColumnRule className="hidden md:block" />
            <Group label={LABEL.company} entries={SECONDARY_NAV} />
            <ColumnRule className="hidden md:block" />
            {/* Four standing links, not the whole corpus. The other four
                documents are published and routed; they are reached from the
                context that raises them. See lib/marketing-nav-links.ts. */}
            <Group label={LABEL.legal} entries={FOOTER_LEGAL_NAV} />
            <ColumnRule className="hidden md:block" />

            <div>
              <GroupLabel>{LABEL.contact}</GroupLabel>
              <div style={{ marginTop: 16 }}>
                <AddressLink email={CONTACT_EMAIL} />
              </div>
              <div style={{ marginTop: 20 }}>
                <SocialRow />
              </div>
            </div>
          </div>
        </Arrive>

        <div className="flex-1" style={{ minHeight: 16, maxHeight: 48 }} />

        <Arrive>
          <Hairline />
          <div style={{ paddingTop: 20 }}>
            <Signature />
          </div>
        </Arrive>
      </ArriveGroup>
    </FooterSurface>
  );
}

function Group({
  label,
  entries,
  display = false,
}: {
  label: string;
  entries: readonly { label: string; href: string }[];
  /** The product destinations, in the display voice. */
  display?: boolean;
}) {
  return (
    <div>
      <GroupLabel>{label}</GroupLabel>
      <div className="mt-5 flex flex-col items-start gap-3.5">
        {entries.map((entry) => (
          <FooterLink
            key={entry.href}
            href={entry.href}
            label={display ? productLabel(entry.label) : entry.label}
            tone={display ? "product" : "clerical"}
          />
        ))}
      </div>
    </div>
  );
}
