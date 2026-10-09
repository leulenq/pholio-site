import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";


import HomePageClient from "@/components/HomePageClient";
import HomeNoScript from "@/components/seo/HomeNoScript";

export const metadata = pageMetadata("/");

export default function HomePage() {
  return <>
    <PageStructuredData path="/" />
    <HomePageClient />
    <HomeNoScript />
  </>;
}
