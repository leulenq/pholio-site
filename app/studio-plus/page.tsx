import type { Metadata } from "next";

import { StudioPlusPage } from "@/components/studio-plus";

export const metadata: Metadata = {
  title: "Studio+",
  description:
    "Studio+ is Pholio's talent subscription: seven premium comp-card themes, a site of your own, and ninety days of portfolio analytics with CSV export. $9.99 a month after a 14-day trial. Nothing an agency sees or receives changes with it.",
};

export default function StudioPlus() {
  return <StudioPlusPage />;
}
