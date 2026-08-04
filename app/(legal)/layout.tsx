import type { ReactNode } from "react";

import ThemeColor from "@/components/ThemeColor";

/**
 * The legal corpus shares one field: cream paper, full viewport height, browser
 * chrome tinted to match. A route group `(legal)` keeps that shared shell in
 * one file without adding a `/legal` segment to any URL — the published paths
 * (`/terms`, `/privacy`, …) are unchanged, and pholio-app links to them
 * directly.
 *
 * Documents themselves render through components/legal/LegalDocumentLayout.
 */
export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-mobile-screen bg-cream">
      <ThemeColor color="#FAF7F2" />
      {children}
    </main>
  );
}
