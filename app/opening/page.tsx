import type { Metadata } from "next";

import { OpeningPage } from "@/components/opening";

export const metadata: Metadata = {
  title: "Pholio opens to talent on October 31",
  description: "Talent can join Pholio from October 31. Leave your email for one message that day; the address is then deleted.",
};

export default function Opening() {
  return <OpeningPage />;
}
