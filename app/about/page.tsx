import type { Metadata } from "next";

import { AboutPage } from "@/components/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Pholio exists, what it will not do, and who makes it. Applying is free, the receiving side is never charged, and nothing an agency sees or receives changes with anyone's plan.",
};

export default function About() {
  return (
    <div className="min-h-mobile-screen bg-[#050505]">
      <AboutPage />
    </div>
  );
}
