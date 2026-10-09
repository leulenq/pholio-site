import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";

import { StudioPlusPage } from "@/components/studio-plus";

export const metadata = pageMetadata("/studio-plus");

export default function StudioPlus() {
  return <>
    <PageStructuredData path="/studio-plus" />
    <StudioPlusPage />
  </>;
}
