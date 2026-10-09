import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";

import { AiNoticeContent } from "@/components/legal/AiNoticeContent";

export const metadata = pageMetadata("/ai-notice");

export default function Page() {
  return <>
    <PageStructuredData path="/ai-notice" />
    <AiNoticeContent />
  </>;
}
