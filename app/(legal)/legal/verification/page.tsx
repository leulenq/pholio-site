import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";
import { VerificationNoticeContent } from "@/components/legal/VerificationNoticeContent";

export const metadata = pageMetadata("/legal/verification");

export default function Page() {
  return <>
    <PageStructuredData path="/legal/verification" />
    <VerificationNoticeContent />
  </>;
}
