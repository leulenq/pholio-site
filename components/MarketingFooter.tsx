"use client";

/**
 * Sitewide footer mount used by the /talent flow.
 *
 * In pholio-landing this was a shim onto a variant-based footer system.
 * pholio-site has one SiteFooter, so this preserves the component name and
 * `theme` prop while routing to the site's existing closing panel.
 */

import SiteFooter from "@/components/footer/SiteFooter";

export interface MarketingFooterProps {
  theme?: "light" | "dark";
}

export default function MarketingFooter({ theme = "light" }: MarketingFooterProps) {
  void theme;
  return <SiteFooter />;
}
