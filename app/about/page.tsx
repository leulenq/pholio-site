import type { Metadata } from "next";

import { AboutPage } from "@/components/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pholio is a free toolkit for applying to agencies, and a free intake link for the agencies that receive them. Where it stands, what it makes, and who makes it.",
};

export default function About() {
  return (
    <div className="min-h-mobile-screen bg-[#050505]">
      <AboutPage />
    </div>
  );
}
