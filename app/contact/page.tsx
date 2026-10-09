import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";

import { ContactPage } from "@/components/contact";

export const metadata = pageMetadata("/contact");

export default function Contact() {
  return <>
    <PageStructuredData path="/contact" />
    <ContactPage />
  </>;
}
