"use client";

/**
 * CAREERS CONTENT — ported from the previous site.
 *
 * `pholio-landing/components/CareersContent.tsx`, replicated on the owner's
 * instruction (2026-09-27). Four sections, in the archive's own order and at
 * its own scale: the values, the perks on white, the open roles by
 * department, and the closing invitation.
 *
 * ── COPY ──────────────────────────────────────────────────────────────────
 * Rewritten 2026-09-30 (`lessons.md` §48.5). The composition is still the
 * replicated page. The words are a hiring proposition for an early company,
 * not the archive sentences and not a filed handbook. The address stays
 * `careers@pholio.studio`, which has to be a mailbox that exists before
 * this page is announced.
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

/** Same treatment as the about wall: grayscale is the site's register. */
const plate = {
  filter: "grayscale(1) contrast(1.05)",
} as const;

const perks = [
  {
    label: "Remote, flexible hours",
    src: "https://images.unsplash.com/photo-1603189343302-e603f7add05a?auto=format&fit=max&w=1200&q=80",
    alt: "A model in a black coat with wide sleeves, against a white studio ground.",
    position: "38% 28%",
  },
  {
    label: "Early equity",
    src: "https://images.unsplash.com/photo-1700150662401-9b96a5fedfbb?auto=format&fit=max&w=1200&q=80",
    alt: "A seated portrait in a knit sweater, photographed from above.",
    position: "42% 30%",
  },
  {
    label: "Laptop and gear",
    src: "https://images.unsplash.com/photo-1760337741510-1a4661e036fa?auto=format&fit=max&w=1200&q=80",
    alt: "Four people standing on a studio backdrop.",
    position: "center",
  },
  {
    label: "A health stipend",
    src: "https://images.unsplash.com/photo-1662532577856-e8ee8b138a8b?auto=format&fit=max&w=1200&q=80",
    alt: "A model in a red suit, photographed from below against a clear sky.",
    position: "center 42%",
  },
  {
    label: "AI tools, paid for",
    src: "https://images.unsplash.com/photo-1590131222139-91ba5992e4ed?auto=format&fit=max&w=1200&q=80",
    alt: "A model in a black hat and turtleneck, against a white ground.",
    position: "center",
  },
  {
    label: "Four weeks of leave",
    src: "https://images.unsplash.com/photo-1610765431323-d88c88a2b2c8?auto=format&fit=max&w=1200&q=80",
    alt: "A model in a black suit, seated on a stool against a round light.",
    position: "center",
  },
  {
    label: "No management layer",
    src: "https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?auto=format&fit=max&w=1200&q=80",
    alt: "A model in a blue suit, seated with both hands at the collar.",
    position: "center 32%",
  },
  {
    label: "Your name on it",
    src: "https://images.unsplash.com/photo-1741605037045-516447152dfa?auto=format&fit=max&w=1200&q=80",
    alt: "A model in a white shirt and tailored trousers, seated on a stool.",
    position: "62% 18%",
  },
];

export function CareersContent() {
  const departments = [
    {
      name: "Engineering",
      roles: [
        {
          title: "Product Engineer",
          note: "The book, the comp card, the conforming export, and the inbox an agency actually uses.",
        },
        {
          title: "Machine Learning Engineer",
          note: "Read the photograph, never the face. Off until a person turns it on, and said so in the product.",
        },
      ],
    },
    {
      name: "Design",
      roles: [
        {
          title: "Product Designer",
          note: "Talent is staging a book. An agency is clearing a pile. Design both, and do not average them.",
        },
        {
          title: "Editorial Designer",
          note: "The comp card editions, the type, and a photographic standard strict enough for this industry.",
        },
      ],
    },
    {
      name: "Industry",
      roles: [
        {
          title: "Agency Relations",
          note: "Learn how a booker actually takes applications, then turn that into a spec we can publish and keep true.",
        },
      ],
    },
  ];

  return (
    <div className="bg-[#050505] text-white">
      {/* ── VALUES ────────────────────────────────────────────────── */}
      <section className="border-b border-white/5 px-6 py-32">
        <div className="mx-auto max-w-4xl">
          <RevealSection>
            <h2 className="mb-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A55A]">
              How we work
            </h2>
            <h3 className="mb-16 font-editorial text-5xl leading-tight md:text-7xl">
              A small team, the{" "}
              <span className="font-editorial-italic italic">whole</span>{" "}
              product in reach.
            </h3>
            <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
              {[
                {
                  title: "A surface of your own",
                  desc: "You hold something specific: the book, the card, the export, the inbox, the site. You decide it, you ship it, and you are the person who answers for it.",
                },
                {
                  title: "Taste is the job",
                  desc: "Agencies and talent look at this the way they look at a photograph. Type, a PDF, and a form are judged with the pictures, not after them.",
                },
                {
                  title: "The line we do not cross",
                  desc: "Pholio does not represent talent, does not charge agencies, and does not sell being seen. The product and the page both have to survive that.",
                },
                {
                  title: "Remote, with a shared day",
                  desc: "There is no office. There is a stretch of hours where we are actually together, and the rest of the day is yours to place.",
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
              What we offer
            </h2>
            <h3 className="mb-8 font-editorial text-5xl md:text-6xl">
              The terms of a{" "}
              <span className="font-editorial-italic italic">young</span>{" "}
              company.
            </h3>
            <p className="mx-auto max-w-xl font-sans text-lg font-light leading-relaxed text-[#050505]/60">
              Early equity, talked through before you join. The rest is meant
              to be enough to work well, while the company is still small.
            </p>
          </RevealSection>

          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {perks.map((perk, i) => (
              <RevealSection
                key={perk.label}
                /* The archive's cell is `aspect-square` at every width. On a
                   phone that box is ~155px across and the longest labels
                   ("Equity for All Employees", "AI Tooling Subscriptions")
                   overflow it and print outside the border. The square is
                   kept from `sm` up, where the archive's composition
                   actually lives; below it the cell grows to its content. */
                className="relative flex min-h-[10rem] flex-col justify-between overflow-hidden border border-[#050505]/5 p-5 sm:aspect-square sm:min-h-0 sm:p-8"
              >
                <img
                  src={perk.src}
                  alt={perk.alt}
                  loading="lazy"
                  style={{ ...plate, objectPosition: perk.position }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.82) 34%, rgba(0,0,0,0.08) 52%, rgba(0,0,0,0.62) 100%)",
                  }}
                />
                <div className="relative text-[10px] font-semibold text-[#C9A55A]">
                  0{i + 1}
                </div>
                <div className="relative font-editorial text-base leading-tight break-words text-white sm:text-2xl">
                  {perk.label}
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
              Open roles
            </h2>
            <h3 className="mb-12 font-editorial text-5xl md:text-7xl">
              Five{" "}
              <span className="font-editorial-italic italic text-[#C9A55A]">
                open
              </span>{" "}
              roles.
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
                        key={role.title}
                        href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(role.title)}`}
                        className="group flex cursor-pointer items-center justify-between gap-8 border-b border-white/5 pb-8 no-underline last:border-0 last:pb-0"
                      >
                        <span className="flex min-w-0 flex-col gap-3 transition-transform duration-500 group-hover:translate-x-4">
                          <span className="font-editorial text-2xl text-white md:text-3xl">
                            {role.title}
                          </span>
                          <span className="max-w-xl font-sans text-base font-light leading-relaxed text-white/50">
                            {role.note}
                          </span>
                        </span>
                        <div className="h-[1px] w-12 shrink-0 origin-right scale-x-0 bg-[#C9A55A] transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
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
            If your work is missing from the list, write and say what you would own.
          </div>
          <a
            href={`mailto:${CAREERS_EMAIL}`}
            className="text-[10px] uppercase tracking-[0.4em] text-white transition-colors duration-300 hover:text-[#C9A55A]"
          >
            Write to us &rarr;
          </a>
        </RevealSection>
      </section>
    </div>
  );
}
