import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";

import { DmcaContent } from "@/components/legal/DmcaContent";

export const metadata = pageMetadata("/dmca");

export default function Page() {
  return <>
    <PageStructuredData path="/dmca" />
    <DmcaContent />
  </>;
}
