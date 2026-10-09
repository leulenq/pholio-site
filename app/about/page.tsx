import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";

import { AboutPage } from "@/components/about";

export const metadata = pageMetadata("/about");

export default function About() {
  return <>
    <PageStructuredData path="/about" />
    <AboutPage />
  </>;
}
