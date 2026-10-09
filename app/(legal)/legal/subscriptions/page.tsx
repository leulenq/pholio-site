import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";
import { SubscriptionTermsContent } from "@/components/legal/SubscriptionTermsContent";

export const metadata = pageMetadata("/legal/subscriptions");

export default function Page() {
  return <>
    <PageStructuredData path="/legal/subscriptions" />
    <SubscriptionTermsContent />
  </>;
}
