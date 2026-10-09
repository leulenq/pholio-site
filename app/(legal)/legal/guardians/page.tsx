import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";
import { GuardianNoticeContent } from "@/components/legal/GuardianNoticeContent";

export const metadata = pageMetadata("/legal/guardians");

export default function Page() {
  return <>
    <PageStructuredData path="/legal/guardians" />
    <GuardianNoticeContent />
  </>;
}
