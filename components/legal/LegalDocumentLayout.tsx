"use client";

import { motion } from "framer-motion";

/**
 * The reading surface for every legal document.
 *
 * ⚠️ This file is CHROME. The words live in the `*Content.tsx` files and are
 * versioned by `CURRENT_LEGAL_VERSION` in lib/legal-constants.ts — editing a
 * sentence there is a compliance event that re-prompts every user and requires
 * a matching bump in pholio-app. Editing layout here is not. Keep that line
 * clean: change how it reads, never what it says.
 *
 * Design notes, because a legal page is still a designed page:
 *
 *  - It is the site's only long-form reading surface, so it is the one place
 *    the type scale is a real scale rather than the header's two hard registers.
 *  - No eyebrow above the H1. The document's title is the label.
 *  - Every resting value clears 4.5:1 on cream. This layout previously ran body
 *    copy at 65% and the copyright line at 30% — roughly 2:1, unreadable —
 *    which is exactly the failure the contrast rule exists to catch.
 *  - Hairlines are 1px and neutral. A 2px gold side-stripe reads as an alert
 *    component, and coloured stripes wider than 1px are banned outright.
 */

export interface LegalSection {
  title: string;
  content: string[];
  /**
   * Stable anchor, when something outside this repo links to the section.
   *
   * pholio-app deep-links `/terms#agency-workspace-use`,
   * `/terms#agency-fair-decision-making` and `/privacy#agency-data-processing`
   * from its agency acceptance gate. Set `id` on the matching section to make
   * those links land. Defaults to `section-{n}`, which the table of contents
   * uses, so ordinal links keep working either way.
   */
  id?: string;
}

export interface LegalDocumentLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  effectiveDate: string;
  sections: LegalSection[];
  contactEmail: string;
  footerTitle: string;
  footerBody?: string;
  companyName: string;
  companyAddress?: string;
}

const sectionId = (section: LegalSection, i: number) =>
  section.id ?? `section-${i + 1}`;

const BODY = "font-sans text-base leading-relaxed text-[#050505]/75";

function renderParagraph(paragraph: string, key: number) {
  /* A paragraph that carries its own sub-heading on the first line. */
  if (paragraph.includes("\n")) {
    const [heading, ...rest] = paragraph.split("\n");
    return (
      <div key={key} className="space-y-1.5">
        <p className="font-sans text-base font-semibold text-[#050505]">
          {heading}
        </p>
        <p className={BODY}>{rest.join(" ")}</p>
      </div>
    );
  }

  /* Dashed list item. The marker is gold; the rule against gold surfaces is
     about fills, and a single glyph is not a fill. */
  if (paragraph.startsWith("—")) {
    return (
      <div key={key} className="flex gap-3 pl-4">
        <span className="mt-0.5 shrink-0 text-[#A8894E]" aria-hidden>
          —
        </span>
        <p className={BODY}>{paragraph.slice(2)}</p>
      </div>
    );
  }

  /* Lettered sub-clause: (a), (b), (c)… */
  if (/^\([a-g]\)/.test(paragraph)) {
    return (
      <div key={key} className="flex gap-3 pl-4">
        <p className={BODY}>{paragraph}</p>
      </div>
    );
  }

  /* Contact block. A 1px neutral rule, not a coloured stripe. */
  if (
    paragraph.startsWith("Email:") ||
    paragraph.startsWith("Mailing address:") ||
    paragraph.startsWith("Designated Agent:")
  ) {
    return (
      <p
        key={key}
        className="border-l border-[#050505]/20 pl-4 font-sans text-sm leading-relaxed text-[#050505]/70"
      >
        {paragraph}
      </p>
    );
  }

  /* Statutorily conspicuous text — arbitration, warranty disclaimers. It is set
     in caps in the source because the law wants it noticed, so it gets a real
     surface: warm paper, a hairline, square corners. */
  if (paragraph === paragraph.toUpperCase() && paragraph.length > 80) {
    return (
      <p
        key={key}
        className="border border-[#050505]/12 bg-[#F5F0E8] p-5 font-sans text-sm font-medium leading-relaxed tracking-wide text-[#050505]/85"
      >
        {paragraph}
      </p>
    );
  }

  return (
    <p key={key} className={BODY}>
      {paragraph}
    </p>
  );
}

export function LegalDocumentLayout({
  title,
  subtitle,
  lastUpdated,
  effectiveDate,
  sections,
  contactEmail,
  footerTitle,
  footerBody,
  companyName,
  companyAddress,
}: LegalDocumentLayoutProps) {
  return (
    <article className="texture-grain min-h-mobile-screen bg-[#FAF7F2] px-6 pb-32 pt-40 text-[#050505]">
      <div className="mx-auto max-w-3xl">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 border-b border-[#050505]/12 pb-12"
        >
          {/* No eyebrow. The title is the label. */}
          <h1 className="font-editorial text-5xl md:text-7xl">{title}</h1>

          <p className="mt-7 max-w-2xl font-sans text-base leading-relaxed text-[#050505]/75">
            {subtitle}
          </p>

          {/* Dates are clerical data, so they are set in the clerical voice. */}
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#050505]/60">
            <div className="flex gap-2">
              <dt>Last updated</dt>
              <dd className="text-[#050505]/85">{lastUpdated}</dd>
            </div>
            <div className="flex gap-2">
              <dt>Effective</dt>
              <dd className="text-[#050505]/85">{effectiveDate}</dd>
            </div>
          </dl>
        </motion.header>

        <motion.nav
          aria-label="Table of contents"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 border-y border-[#050505]/12 py-8"
        >
          <h2 className="mb-5 font-mono text-[10px] uppercase tracking-[0.26em] text-[#050505]/60">
            Contents
          </h2>
          <ol className="space-y-2.5">
            {sections.map((section, i) => (
              <li key={section.title}>
                <a
                  href={`#${sectionId(section, i)}`}
                  className="flex items-baseline gap-3 font-sans text-sm text-[#050505]/80 transition-colors duration-200 hover:text-[#A8894E]"
                >
                  <span className="w-6 shrink-0 font-mono text-xs tabular-nums text-[#050505]/55">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{section.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </motion.nav>

        <div className="space-y-20">
          {sections.map((section, i) => (
            <motion.section
              key={section.title}
              id={sectionId(section, i)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="scroll-mt-28"
            >
              <h2 className="font-editorial mb-6 text-2xl text-[#050505] md:text-3xl">
                <span className="mr-3 font-mono text-sm tabular-nums text-[#A8894E]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.content.map((paragraph, j) =>
                  renderParagraph(paragraph, j),
                )}
              </div>
            </motion.section>
          ))}
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-32 border-t border-[#050505]/12 pt-12"
        >
          <h2 className="font-editorial mb-4 text-2xl">{footerTitle}</h2>
          {footerBody && (
            <p className="mb-2 font-sans leading-relaxed text-[#050505]/75">
              {footerBody}
            </p>
          )}
          {companyAddress && (
            <p className="mb-8 font-sans text-sm text-[#050505]/70">
              Mailing address: {companyAddress}
            </p>
          )}
          <a
            href={`mailto:${contactEmail}`}
            className="font-editorial text-2xl text-[#A8894E] underline-offset-8 hover:underline"
          >
            {contactEmail}
          </a>
          <p className="mt-12 font-sans text-xs leading-relaxed text-[#050505]/60">
            © {new Date().getFullYear()} {companyName}. All rights reserved. This
            document does not constitute legal advice. Consult qualified legal
            counsel for advice specific to your circumstances.
          </p>
        </motion.footer>
      </div>
    </article>
  );
}
