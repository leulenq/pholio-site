"use client";

import { useState } from "react";

import Preloader from "@/components/Preloader";
import { LEGAL_NAV } from "@/lib/marketing-nav-links";
import { GoldSweep, Wordmark } from "@/components/header/kit";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SCAFFOLDING. This is not a design.
 *
 * The site root exists because pholio-app depends on it: `POST /api/logout`
 * returns this origin as its redirect, and every transactional email footer
 * links here. A 404 at `/` is a broken product, so this holding page stands in
 * until the real home page is built.
 *
 * It is deliberately plain — a wordmark, one line, the legal corpus. Do not
 * grow it into a landing page and do not treat its layout as a starting point.
 * Delete the whole file when the real `/` lands.
 *
 * Note the header does not appear here, and that is correct: the header reveals
 * once a hero section has left the viewport, and this page has no hero and does
 * not scroll. See `homeHeaderRevealed()` in components/header/kit.tsx.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function HomePage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setLoaded(true)} />

      <main
        className="texture-grain relative flex min-h-mobile-screen flex-col justify-between px-6 py-14 md:px-12"
        style={{
          backgroundColor: "#050505",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.7s var(--ease-arrival)",
        }}
      >
        <Wordmark size={24} color="#C9A55A" />

        <div className="max-w-xl">
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "rgba(250,247,242,0.92)",
            }}
          >
            A verified book for talent, and a way for agencies to find the people
            in it.
          </p>
        </div>

        <div>
          <GoldSweep style={{ marginBottom: 24 }} />
          <nav className="flex flex-wrap gap-x-7 gap-y-3">
            {LEGAL_NAV.map((entry) => (
              <a
                key={entry.href}
                href={entry.href}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(250,247,242,0.55)",
                  textDecoration: "none",
                }}
              >
                {entry.label}
              </a>
            ))}
          </nav>
        </div>
      </main>
    </>
  );
}
