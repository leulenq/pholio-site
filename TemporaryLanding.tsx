"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import ThemeColor from "@/components/ThemeColor";
import { Wordmark, GoldSweep, GOLD } from "@/components/header/kit";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
  { href: "/community-guidelines", label: "Community Guidelines" },
  { href: "/dmca", label: "DMCA" },
  { href: "/ai-notice", label: "AI Notice" },
];

/**
 * The holding surface. One physical composition, no sections: the wordmark and
 * the gold sweep (both the literal pholio-app talent-system pieces, not
 * lookalikes) anchor the field, a single verdict headline carries the "launching
 * soon" beat, one plain sentence states the site isn't open yet, and the legal
 * baseline stays reachable underneath. Everything else is restraint — a held
 * gold field and grain, no gradients, no loop.
 */
export default function TemporaryLanding() {
  const reduceMotion = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: reduceMotion ? 0 : delay,
      duration: 0.8,
      ease: EASE,
    },
  });

  return (
    <main className="fixed inset-0 flex h-mobile-screen min-h-mobile-screen items-center justify-center overflow-hidden bg-[#050505] px-6 text-[#FAF7F2]">
      <ThemeColor color="#050505" />

      {/* Restrained field: a held gold glow behind the mark and grain over it.
          Static — no breathing loop, no shimmer. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.05]"
        style={{
          width: 900,
          height: 900,
          background: `radial-gradient(circle, ${GOLD} 0%, transparent 60%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
        }}
      />

      <section className="relative flex flex-col items-center text-center">
        <motion.div {...rise(0.1)}>
          <Wordmark size="clamp(2.75rem, 9vw, 5.5rem)" className="block" />
        </motion.div>

        <motion.div
          className="mt-7 w-full max-w-[200px]"
          initial={{ opacity: 0, scaleX: reduceMotion ? 1 : 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{
            delay: reduceMotion ? 0 : 0.55,
            duration: 0.9,
            ease: EASE,
          }}
        >
          <GoldSweep />
        </motion.div>

        <motion.p
          {...rise(0.85)}
          className="mt-10 font-editorial text-3xl tracking-[-0.02em] text-[#FAF7F2] sm:text-4xl md:text-[2.75rem]"
        >
          Access is{" "}
          <span className="font-editorial-italic" style={{ color: GOLD }}>
            arriving
          </span>
          .
        </motion.p>

        <motion.p
          {...rise(1.05)}
          className="mt-4 max-w-xs text-sm text-[#FAF7F2]/50"
        >
          Not yet open to the public.
        </motion.p>

        <motion.nav
          aria-label="Legal pages"
          {...rise(1.3)}
          className="mt-16 flex max-w-xl flex-wrap items-center justify-center gap-x-5 gap-y-3"
        >
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#FAF7F2]/42 transition-colors duration-300 hover:text-[#C9A55A] focus:outline-none focus-visible:text-[#C9A55A]"
            >
              {link.label}
            </Link>
          ))}
        </motion.nav>
      </section>
    </main>
  );
}
