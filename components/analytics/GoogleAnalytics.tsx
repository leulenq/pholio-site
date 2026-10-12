"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { analyticsAllowed } from "@/lib/cookie-consent";
import { createAnalytics } from "@/public/scripts/google-analytics.mjs";

type Analytics = ReturnType<typeof createAnalytics>;

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const analytics = useRef<Analytics | null>(null);
  useEffect(() => {
    analytics.current = createAnalytics({
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      surface: "site",
      enabled: process.env.NEXT_PUBLIC_GA_ENABLED === "true" &&
        (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_GA_DEBUG === "true"),
      debug: process.env.NEXT_PUBLIC_GA_DEBUG === "true",
      allowed: analyticsAllowed,
    });
    const conversion = () => analytics.current?.event("generate_lead", "agency_access_request");
    window.addEventListener("pholio:agency-access-requested", conversion);
    return () => {
      window.removeEventListener("pholio:agency-access-requested", conversion);
      analytics.current?.destroy();
      analytics.current = null;
    };
  }, []);
  useEffect(() => { if (pathname) analytics.current?.page(pathname); }, [pathname]);
  return null;
}
