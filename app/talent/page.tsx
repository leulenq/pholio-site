import type { Metadata } from "next";

import { TalentPage } from "@/components/talent";

export const metadata: Metadata = {
  title: "Talent",
  description:
    "Pholio keeps your digitals, book and comp card current, and prepares them the way each agency asks. Applying is free, and agencies are never charged.",
  openGraph: {
    title: "Talent | Pholio",
    description:
      "Shoot your digitals once. Pholio keeps your digitals, book and comp card current, and prepares them the way each agency asks.",
    url: "https://www.pholio.studio/talent",
    siteName: "Pholio",
    type: "website",
  },
};

export default function Talent() {
  return <TalentPage />;
}
