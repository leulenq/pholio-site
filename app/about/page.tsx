import type { Metadata } from "next";

import { AboutPageContent } from "@/components/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pholio is building the next standard for creative discovery. Meet the team and read the manifesto.",
};

export default function AboutPage() {
  return (
    <main className="min-h-mobile-screen bg-[#050505]">
      <AboutPageContent />
    </main>
  );
}
