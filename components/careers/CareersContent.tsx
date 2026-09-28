"use client";

/**
 * CAREERS CONTENT — ported from the previous site.
 *
 * `pholio-landing/components/CareersContent.tsx`, replicated on the owner's
 * instruction (2026-09-27). Four sections, in the archive's own order and at
 * its own scale: the values, the perks on white, the open roles by
 * department, and the closing invitation.
 *
 * ── STRINGS THE OWNER HAS FLAGGED FOR REWRITE ─────────────────────────────
 * The eight perks below are the archive's, carried across verbatim so the
 * composition is right. They are employment promises (equity, sabbaticals, a
 * stipend, a wellness fund) published by a company that is not incorporated
 * yet, and the owner is rewriting them: "Replicate the block, I'll rewrite
 * the eight later." Do not treat them as settled copy, and do not quietly
 * soften them either. The five open roles are likewise the archive's and are
 * unconfirmed.
 *
 * ── TWO STRINGS KEPT AGAINST STANDING DECISIONS, BY THE OWNER ─────────────
 * "We're always scouting for visionaries" keeps the word `scouting`, which
 * `lessons.md` §23 retired sitewide: `get scouted` is the shared vocabulary
 * of the predatory talent platforms in the product plan's competitor
 * research, and it sits adjacent to the language California's advance-fee
 * statute regulates (Lab. Code §1702.1). The address stays
 * `careers@pholio.studio` rather than the site's `hello@pholio.studio`, so
 * it needs to be a mailbox that exists before this page is announced. Both
 * were confirmed verbatim by the owner on 2026-09-27.
 *
 * ── THE ONE THING THAT IS NOT VERBATIM ────────────────────────────────────
 * In the archive a role row was a `div` with `cursor-pointer` and no
 * destination: it looked clickable and did nothing, and a keyboard never
 * reached it. Each row is now the same markup inside an anchor to
 * `careers@pholio.studio` with the role in the subject line. Appearance,
 * hover and spacing are unchanged; the affordance the archive already
 * advertised now works.
 */

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  /* The archive animated every section regardless of the visitor's motion
     preference, and framer drives transforms in JS, so the stylesheet's
     reduced-motion backstop never reached it. The composition is unchanged
     for everyone else: with the preference set, the same section arrives at
     its finished state instead of travelling into it. */
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** The archive's address. See the header note: this mailbox has to exist. */
const CAREERS_EMAIL = "careers@pholio.studio";

export function CareersContent() {
  const departments = [
    {
      name: "Engineering",
      roles: ["Full Stack Engineer (Core)", "AI Integration Specialist"],
    },
    {
      name: "Design",
      roles: ["Product Designer (Agency Experience)"],
    },
    {
      name: "Strategy",
      roles: ["Curation Lead", "Agency Relations Manager"],
    },
  ];

  return (
    <div className="bg-[#050505] text-white">
      {/* ── VALUES ────────────────────────────────────────────────── */}
      <section className="border-b border-white/5 px-6 py-32">
        <div className="mx-auto max-w-4xl">
          <RevealSection>
            <h2 className="mb-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A55A]">
              Our Values
            </h2>
            <h3 className="mb-16 font-editorial text-5xl leading-tight md:text-7xl">
              A Culture of{" "}
              <span className="font-editorial-italic italic">Relentless</span>{" "}
              Craft.
            </h3>
            <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
              {[
                {
                  title: "Taste First",
                  desc: "We believe code and pixels should be as beautiful as the talent we represent. We value aesthetic precision as much as technical robustness.",
                },
                {
                  title: "Radical Ownership",
                  desc: "Every member of the Pholio collective is an architect of the vision. We empower individuals to own their domain entirely.",
                },
                {
                  title: "Verifiable Excellence",
                  desc: "Accuracy is our currency. We build for a future where digital reputation is backed by undeniable proof.",
                },
                {
                  title: "Global Context",
                  desc: "We are remote-first and world-aware. We build tools that scale human connection across every border.",
                },
              ].map((value) => (
                <div key={value.title} className="flex flex-col">
                  <h4 className="mb-4 font-editorial text-2xl text-white">
                    {value.title}
                  </h4>
                  <p className="font-sans text-lg font-light leading-relaxed text-white/50">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── PERKS ─────────────────────────────────────────────── */}
      <section className="texture-grain bg-white px-6 py-32 text-[#050505]">
        <div className="mx-auto max-w-6xl">
          <RevealSection className="mb-24 text-center">
            <h2 className="mb-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A55A]">
              The Pholio Life
            </h2>
            <h3 className="mb-8 font-editorial text-5xl md:text-6xl">
              Exceptional Support for{" "}
              <span className="font-editorial-italic italic">Exceptional</span>{" "}
              Minds.
            </h3>
          </RevealSection>

          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              "Remote-First Culture",
              "Premium Studio Stipend",
              "Equity for All Employees",
              "Unlimited Sabbaticals",
              "Annual Global Offsites",
              "Biolight Workspace Kit",
              "Health & Wellness Fund",
              "AI Tooling Subscriptions",
            ].map((perk, i) => (
              <RevealSection
                key={perk}
                /* The archive's cell is `aspect-square` at every width. On a
                   phone that box is ~155px across and the longest labels
                   ("Equity for All Employees", "AI Tooling Subscriptions")
                   overflow it and print outside the border. The square is
                   kept from `sm` up, where the archive's composition
                   actually lives; below it the cell grows to its content. */
                className="flex min-h-[10rem] flex-col justify-between border border-[#050505]/5 p-5 sm:aspect-square sm:min-h-0 sm:p-8"
              >
                <div className="text-[10px] font-semibold text-[#C9A55A]">
                  0{i + 1}
                </div>
                <div className="font-editorial text-base leading-tight break-words sm:text-2xl">
                  {perk}
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPEN ROLES ─────────────────────────────────────────────── */}
      <section className="bg-[#050505] px-6 py-40">
        <div className="mx-auto max-w-5xl">
          <RevealSection className="mb-24">
            <h2 className="mb-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A55A]">
              Join Us
            </h2>
            <h3 className="mb-12 font-editorial text-5xl md:text-7xl">
              Ready to leave a{" "}
              <span className="font-editorial-italic italic text-[#C9A55A]">
                legacy?
              </span>
            </h3>
          </RevealSection>

          <div className="space-y-1 bg-white/5">
            {departments.map((dept) => (
              <RevealSection
                key={dept.name}
                className="border-b border-white/5 bg-[#050505] p-8 last:border-0 md:p-12"
              >
                <div className="flex flex-col justify-between gap-12 md:flex-row md:items-start">
                  <div className="w-1/3">
                    <h4 className="font-editorial text-3xl text-[#C9A55A]">
                      {dept.name}
                    </h4>
                  </div>
                  <div className="w-full space-y-8">
                    {dept.roles.map((role) => (
                      <a
                        key={role}
                        href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(role)}`}
                        className="group flex cursor-pointer items-center justify-between border-b border-white/5 pb-8 no-underline last:border-0 last:pb-0"
                      >
                        <span className="font-editorial text-2xl text-white transition-transform duration-500 group-hover:translate-x-4 md:text-3xl">
                          {role}
                        </span>
                        <div className="h-[1px] w-12 origin-right scale-x-0 bg-[#C9A55A] transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                      </a>
                    ))}
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 px-6 py-40 text-center">
        <RevealSection>
          <div className="mx-auto mb-12 max-w-4xl font-editorial-italic text-4xl italic leading-tight text-[#C9A55A] md:text-6xl">
            Don&apos;t see your role? We&apos;re always scouting for visionaries.
          </div>
          <a
            href={`mailto:${CAREERS_EMAIL}`}
            className="text-[10px] uppercase tracking-[0.4em] text-white transition-colors duration-300 hover:text-[#C9A55A]"
          >
            Send a spec application &rarr;
          </a>
        </RevealSection>
      </section>
    </div>
  );
}
