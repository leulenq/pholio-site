import type { Metadata } from "next";

import { CommunityGuidelinesContent } from "@/components/legal/CommunityGuidelinesContent";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description: "What is expected of talent, agencies, and other Recipients on Pholio.",
};

export default function Page() {
  return <CommunityGuidelinesContent />;
}
