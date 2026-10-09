import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";
import { AgencyTermsContent } from "@/components/legal/AgencyTermsContent";

export const metadata = pageMetadata("/legal/agency-terms");

export default function Page() {
  return <>
    <PageStructuredData path="/legal/agency-terms" />
    <AgencyTermsContent />
  </>;
}
