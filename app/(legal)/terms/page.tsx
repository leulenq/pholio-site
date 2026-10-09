import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";

import { TermsContent } from "@/components/legal/TermsContent";

export const metadata = pageMetadata("/terms");

export default function Page() {
  return <>
    <PageStructuredData path="/terms" />
    <TermsContent />
  </>;
}
