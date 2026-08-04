import type { Metadata } from "next";

import { SubmissionProgramNoticeContent } from "@/components/legal/SubmissionProgramNoticeContent";

export const metadata: Metadata = {
  title: "Talent Submission and Opportunity Notice",
  description:
    "How submissions to agencies, casting organizations, event producers, brands, and other Recipients work — including limits, retention, and withdrawal.",
};

export default function SubmissionProgramNoticePage() {
  return <SubmissionProgramNoticeContent />;
}
