import type { Metadata } from "next";

import { PrivacyContent } from "@/components/legal/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Pholio collects, why, who processes it, and the choices you have.",
};

export default function Page() {
  return <PrivacyContent />;
}
