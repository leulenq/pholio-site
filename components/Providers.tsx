"use client";

import type { ReactNode } from "react";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { PholioAuthProvider } from "@/lib/pholio-auth/PholioAuthProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <PholioAuthProvider>
      {children}
      <CookieConsentBanner />
    </PholioAuthProvider>
  );
}
