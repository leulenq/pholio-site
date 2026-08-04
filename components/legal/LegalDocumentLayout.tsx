"use client";

import { motion } from "framer-motion";

export interface LegalSection {
  title: string;
  content: string[];
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

function renderParagraph(paragraph: string, key: number) {
  if (paragraph.includes("\n")) {
    const [heading, ...rest] = paragraph.split("\n");
    return (
      <div key={key} className="space-y-1.5">
        <p className="font-sans text-base font-semibold text-[#050505]/80">
          {heading}
        </p>
        <p className="font-sans text-base text-[#050505]/65 leading-relaxed font-light">
          {rest.join(" ")}
        </p>
      </div>
    );
  }

  if (paragraph.startsWith("—")) {
    return (
      <div key={key} className="flex gap-3 pl-4">
        <span className="text-[#C9A55A] shrink-0 mt-0.5">—</span>
        <p className="font-sans text-base text-[#050505]/65 leading-relaxed font-light">
          {paragraph.slice(2)}
        </p>
      </div>
    );
  }

  if (
    paragraph.startsWith("(a)") ||
    paragraph.startsWith("(b)") ||
    paragraph.startsWith("(c)") ||
    paragraph.startsWith("(d)") ||
    paragraph.startsWith("(e)") ||
    paragraph.startsWith("(f)") ||
    paragraph.startsWith("(g)")
  ) {
    return (
      <div key={key} className="flex gap-3 pl-4">
        <p className="font-sans text-base text-[#050505]/65 leading-relaxed font-light">
          {paragraph}
        </p>
      </div>
    );
  }

  if (
    paragraph.startsWith("Email:") ||
    paragraph.startsWith("Mailing address:") ||
    paragraph.startsWith("Designated Agent:")
  ) {
    return (
      <p
        key={key}
        className="font-sans text-sm text-[#050505]/50 leading-relaxed pl-4 border-l-2 border-[#C9A55A]/30"
      >
        {paragraph}
      </p>
    );
  }

  if (paragraph === paragraph.toUpperCase() && paragraph.length > 80) {
    return (
      <p
        key={key}
        className="font-sans text-sm text-[#050505]/55 leading-relaxed font-medium tracking-wide p-4 bg-[#050505]/[0.03] rounded-lg border border-[#050505]/[0.06]"
      >
        {paragraph}
      </p>
    );
  }

  return (
    <p
      key={key}
      className="font-sans text-base text-[#050505]/65 leading-relaxed font-light"
    >
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
    <article className="bg-[#FAF7F2] text-[#050505] min-h-mobile-screen pt-40 pb-32 px-6 texture-grain">
      <div className="max-w-3xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-24 border-b border-[#050505]/10 pb-12"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A55A] mb-4 block font-semibold">
            Legal &amp; Compliance
          </span>
          <h1 className="font-editorial text-5xl md:text-7xl mb-6">{title}</h1>
          <div className="flex flex-col gap-1 mt-4">
            <p className="text-sm text-[#050505]/40 font-sans tracking-wide">
              Last Updated: {lastUpdated}
            </p>
            <p className="text-sm text-[#050505]/40 font-sans tracking-wide">
              Effective Date: {effectiveDate}
            </p>
          </div>
          <p className="mt-6 text-base text-[#050505]/60 font-sans leading-relaxed font-light max-w-2xl">
            {subtitle}
          </p>
        </motion.header>

        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20 p-8 border border-[#050505]/10 rounded-2xl bg-white/40 backdrop-blur-sm"
        >
          <h2 className="font-editorial text-xl mb-5 text-[#050505]/80">
            Table of Contents
          </h2>
          <ol className="space-y-2">
            {sections.map((section, i) => (
              <li key={section.title}>
                <a
                  href={`#section-${i + 1}`}
                  className="font-sans text-sm text-[#050505]/60 hover:text-[#C9A55A] transition-colors duration-200 flex items-baseline gap-3"
                >
                  <span className="text-[#C9A55A] font-semibold tabular-nums w-5 shrink-0">
                    {i + 1}.
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
              id={`section-${i + 1}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="group scroll-mt-28"
            >
              <h2 className="font-editorial text-2xl md:text-3xl mb-6 text-[#050505]/90 group-hover:text-[#C9A55A] transition-colors duration-300">
                {i + 1}. {section.title}
              </h2>
              <div className="space-y-4">
                {section.content.map((paragraph, j) =>
                  renderParagraph(paragraph, j)
                )}
              </div>
            </motion.section>
          ))}
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 pt-12 border-t border-[#050505]/10"
        >
          <h3 className="font-editorial text-2xl mb-4">{footerTitle}</h3>
          {footerBody && (
            <p className="font-sans text-[#050505]/60 mb-2 leading-relaxed">
              {footerBody}
            </p>
          )}
          {companyAddress && (
            <p className="font-sans text-[#050505]/40 text-sm mb-8">
              Mailing address: {companyAddress}
            </p>
          )}
          <a
            href={`mailto:${contactEmail}`}
            className="font-editorial text-2xl text-[#C9A55A] hover:underline transition-all underline-offset-8"
          >
            {contactEmail}
          </a>
          <p className="mt-12 text-xs text-[#050505]/30 font-sans">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
            This document does not constitute legal advice. Consult qualified
            legal counsel for advice specific to your circumstances.
          </p>
        </motion.footer>
      </div>
    </article>
  );
}
