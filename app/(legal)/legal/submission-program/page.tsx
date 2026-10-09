import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";

import { SubmissionProgramNoticeContent } from "@/components/legal/SubmissionProgramNoticeContent";

export const metadata = pageMetadata("/legal/submission-program");

export default function SubmissionProgramNoticePage() {
  return <>
    <PageStructuredData path="/legal/submission-program" />
    <SubmissionProgramNoticeContent />
  </>;
}
