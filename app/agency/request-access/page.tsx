import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";

import { AgencyAccessPage } from "@/components/agency-access";

export const metadata = pageMetadata("/agency/request-access");

/* The page's browser chrome colour follows its paper, which changes while the
   request is drawn up, so <ThemeColor /> lives inside the client component. */
export default function Page() {
  return <>
    <PageStructuredData path="/agency/request-access" />
    <AgencyAccessPage />
  </>;
}
