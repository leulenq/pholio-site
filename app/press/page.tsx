import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";

import { PressPage } from "@/components/press";

export const metadata = pageMetadata("/press");

export default function Press() {
  return <>
    <PageStructuredData path="/press" />
    <PressPage />
  </>;
}
