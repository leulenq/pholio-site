"use client";

import { Suspense } from "react";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import type { ReactNode } from "react";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { PholioAuthProvider } from "@/lib/pholio-auth/PholioAuthProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <PholioAuthProvider>
      {children}
      <CookieConsentBanner />
      <Suspense fallback={null}><GoogleAnalytics /></Suspense>
    </PholioAuthProvider>
  );
}
