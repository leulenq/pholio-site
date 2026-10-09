import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";

import { TakeItDownContent } from "@/components/legal/TakeItDownContent";

export const metadata = pageMetadata("/take-it-down");

export default function Page() {
  return <>
    <PageStructuredData path="/take-it-down" />
    <TakeItDownContent />
  </>;
}
