import type { Metadata } from "next";

import { AboutPage } from "@/components/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pholio is a company for the moment before the meeting. Why it exists, how it decides, who makes it, and the modeling industry it is working toward.",
};

export default function About() {
  return <AboutPage />;
}
