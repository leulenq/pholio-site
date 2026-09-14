import type { Metadata } from "next";

import { AgencyAccessPage } from "@/components/agency-access";

export const metadata: Metadata = {
  title: "Request agency access",
  description:
    "Request access to Pholio for your agency. Every request is reviewed by a person. Agencies are never charged.",
};

/* The page's browser chrome colour follows its paper, which changes while the
   request is drawn up, so <ThemeColor /> lives inside the client component. */
export default function Page() {
  return <AgencyAccessPage />;
}
