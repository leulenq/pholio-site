import type { Metadata } from "next";

import HomePageClient from "@/components/HomePageClient";

export const metadata: Metadata = {
  title: "Pholio — Your digitals, right, for every agency",
  description:
    "Pholio is a free professional dossier and application toolkit for models: digitals checked against what each agency needs, and the truth about where you stand.",
};

export default function HomePage() {
  return <HomePageClient />;
}
