import type { Metadata } from "next";

import { TakeItDownContent } from "@/components/legal/TakeItDownContent";

export const metadata: Metadata = {
  title: "Take It Down",
  description: "Report non-consensual intimate imagery for removal within 48 hours.",
};

export default function Page() {
  return <TakeItDownContent />;
}
