import type { Metadata } from "next";

import { TermsContent } from "@/components/legal/TermsContent";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The agreement between you and Pholio Studio, Inc. covering accounts, talent submissions, Recipients, and Studio+.",
};

export default function Page() {
  return <TermsContent />;
}
