import type { Metadata } from "next";

import { PressPage } from "@/components/press";

export const metadata: Metadata = {
  title: "Press",
  description:
    "Pholio's press kit: what Pholio is and is not, the facts, releases, the people, and the wordmark. Press: press@pholio.studio.",
};

export default function Press() {
  return <PressPage />;
}
