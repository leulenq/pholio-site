import type { Metadata } from "next";

import { AiNoticeContent } from "@/components/legal/AiNoticeContent";

export const metadata: Metadata = {
  title: "AI Notice",
  description: "Where Pholio uses AI, what it is used for, and how talent opt in or out.",
};

export default function Page() {
  return <AiNoticeContent />;
}
