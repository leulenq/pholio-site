import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/seo/StructuredData";

import { CareersHero } from "@/components/careers/CareersHero";
import { CareersContent } from "@/components/careers/CareersContent";

/**
 * /careers — the previous site's composition, replicated 2026-09-27, with
 * the words rewritten 2026-09-30 (`lessons.md` §48.5). See the notes in the
 * two components.
 *
 * The footer is the root layout's, so this route mounts the page's two
 * sections and nothing else.
 */
export const metadata = pageMetadata("/careers");

export default function Careers() {
  return (
    <>
      <PageStructuredData path="/careers" />
    <div className="bg-[#050505]">
      <CareersHero />
      <CareersContent />
    </div>
    </>
  );
}
