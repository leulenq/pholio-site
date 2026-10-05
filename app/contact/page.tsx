import type { Metadata } from "next";

import { ContactPage } from "@/components/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "How to reach Pholio: the right address for help, agencies, guardians, privacy, copyright, urgent removals and press, and how to tell if a message is really from us.",
};

export default function Contact() {
  return <ContactPage />;
}
