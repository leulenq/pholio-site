import type { Metadata } from "next";

import { TalentPage } from "@/components/talent";

export const metadata: Metadata = {
  title: "Talent",
  description:
    "Your digitals, stats, book, comp card and every submission, kept in one place and kept current. Applying is free, and agencies are never charged.",
  openGraph: {
    title: "Talent | Pholio",
    description:
      "Your digitals, stats, book, comp card and every submission, kept in one place and kept current.",
    url: "https://www.pholio.studio/talent",
    siteName: "Pholio",
    type: "website",
  },
};

export default function Talent() {
  return <TalentPage />;
}
