import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";

import { PrivacyContent } from "@/components/legal/PrivacyContent";

export const metadata = pageMetadata("/privacy");

export default function Page() {
  return <>
    <PageStructuredData path="/privacy" />
    <PrivacyContent />
  </>;
}
