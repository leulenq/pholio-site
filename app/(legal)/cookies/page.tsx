import type { Metadata } from "next";

import { CookiesContent } from "@/components/legal/CookiesContent";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Which cookies Pholio sets, what they do, and how to change or withdraw your analytics choice.",
};

export default function CookiesPage() {
  return (
    <>
      <CookiesContent />

      {/*
        `#preferences` is a CROSS-REPO ANCHOR. pholio-app's cookie banner
        (client/src/shared/components/CookieConsentBanner.jsx) sends "Manage" to
        `/cookies#preferences`, and this site's banner sends people here too.
        The id must stay on this section, and this section must keep a real
        control on it: consent has to be as easy to withdraw as it was to give,
        so a policy page with no button on it does not satisfy the obligation.
        Renaming the id breaks the app's banner silently.
      */}
      <section
        id="preferences"
        className="mx-auto w-full max-w-3xl scroll-mt-28 px-6 pb-32"
      >
        <div className="border-t border-[#050505]/12 pt-10">
          <h2 className="font-editorial mb-4 text-2xl text-[#050505]">
            Change your choice
          </h2>
          <p className="mb-7 max-w-2xl font-sans text-base leading-relaxed text-[#050505]/75">
            Your analytics preference is stored in a first-party cookie shared by
            www.pholio.studio and app.pholio.studio, so one choice covers both.
            Clearing it re-opens the consent banner.
          </p>
          <CookiePreferencesButton
            label="Reset cookie preferences"
            className="inline-flex items-center justify-center border border-[#050505] px-6 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#050505] transition-colors duration-200 hover:bg-[#050505] hover:text-[#FAF7F2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#050505]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2]"
            style={{ cursor: "pointer" }}
          />
        </div>
      </section>
    </>
  );
}
