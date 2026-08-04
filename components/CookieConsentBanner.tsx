"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { getConsent, setConsent, onConsentChange } from "@/lib/cookie-consent";

const linkClassName =
  "underline decoration-[#C9A55A]/40 underline-offset-2 transition-colors duration-150 hover:text-[#C9A55A]";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) {
      setVisible(true);
    }
    // Withdrawing consent (the "Cookie preferences" control in the footer or on
    // /cookies) deletes the record and re-raises this banner, so withdrawal is
    // no harder than granting.
    return onConsentChange(() => setVisible(!getConsent()));
  }, []);

  const handleAcceptAll = () => {
    setConsent({ analytics: true });
    setVisible(false);
  };

  const handleNecessaryOnly = () => {
    setConsent({ analytics: false });
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.aside
          role="region"
          aria-label="Cookie consent"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 55, damping: 16 }}
          className="fixed inset-x-0 bottom-0 z-[100] border-t border-[#EDE8DD]"
          style={{
            backgroundColor: "#FAF7F2",
            boxShadow: "0 -12px 40px -20px rgba(15, 23, 42, 0.18)",
            paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-5 md:flex-row md:items-center md:justify-between md:gap-8 md:px-8 md:py-6">
            <p
              className="max-w-3xl text-sm leading-relaxed md:text-[15px]"
              style={{
                fontFamily: "var(--font-sans)",
                color: "#4B5563",
              }}
            >
              We use cookies and similar technologies to keep Pholio secure, remember
              your preferences, and understand how our marketing site is used. Read our{" "}
              <Link href="/cookies" className={linkClassName}>
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className={linkClassName}>
                Privacy Policy
              </Link>{" "}
              for details.
            </p>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#050505]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2]"
                style={{
                  fontFamily: "var(--font-sans)",
                  backgroundColor: "#050505",
                  color: "#FFFFFF",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = "#1A1815";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = "#050505";
                }}
              >
                Accept all
              </button>

              <button
                type="button"
                onClick={handleNecessaryOnly}
                className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#050505]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2]"
                style={{
                  fontFamily: "var(--font-sans)",
                  borderColor: "#050505",
                  color: "#050505",
                  backgroundColor: "#FFFFFF",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = "#F5F0E8";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = "#FFFFFF";
                }}
              >
                Necessary only
              </button>

              <Link
                href="/cookies"
                className="inline-flex items-center justify-center rounded-full px-2 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#050505]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2]"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "#64748B",
                  textDecoration: "none",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = "#050505";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = "#64748B";
                }}
              >
                Manage
              </Link>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
