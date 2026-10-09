import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";

import { CommunityGuidelinesContent } from "@/components/legal/CommunityGuidelinesContent";

export const metadata = pageMetadata("/community-guidelines");

export default function Page() {
  return <>
    <PageStructuredData path="/community-guidelines" />
    <CommunityGuidelinesContent />
  </>;
}
