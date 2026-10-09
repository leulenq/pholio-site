import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";

import { TalentPage } from "@/components/talent";

export const metadata = pageMetadata("/talent");

export default function Talent() {
  return <>
    <PageStructuredData path="/talent" />
    <TalentPage />
  </>;
}
