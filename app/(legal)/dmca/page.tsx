import type { Metadata } from "next";

import { DmcaContent } from "@/components/legal/DmcaContent";

export const metadata: Metadata = {
  title: "Copyright",
  description: "How to report copyright infringement on Pholio and how counter-notices work.",
};

export default function Page() {
  return <DmcaContent />;
}
