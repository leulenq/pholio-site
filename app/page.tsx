import type { Metadata } from "next";

import { PHOLIO_TITLE, PHOLIO_DESCRIPTION } from "@/lib/brand";

import HomePageClient from "@/components/HomePageClient";

export const metadata: Metadata = {
  title: { absolute: PHOLIO_TITLE },
  description: PHOLIO_DESCRIPTION,
  openGraph: {
    title: PHOLIO_TITLE,
    description: PHOLIO_DESCRIPTION,
    siteName: "Pholio",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: PHOLIO_TITLE,
    description: PHOLIO_DESCRIPTION,
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
