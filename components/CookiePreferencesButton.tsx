"use client";

import type { ButtonHTMLAttributes } from "react";
import { clearConsent } from "@/lib/cookie-consent";

/**
 * Withdrawal control. Before this existed, both cookie banners' "Manage" link
 * pointed at /cookies — a static policy page with no controls — so a visitor
 * who accepted had no way back. Clearing the record re-raises the banner, which
 * keeps withdrawal exactly as easy as granting.
 */
export default function CookiePreferencesButton({
  label = "Cookie preferences",
  children,
  onClick,
  ...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement> & { label?: string }) {
  return (
    <button
      type="button"
      {...buttonProps}
      onClick={(event) => {
        clearConsent();
        onClick?.(event);
      }}
    >
      {/* `label` is the plain form. Callers that need the control to wear a
          surface's own type treatment (the footer) pass children instead; the
          behaviour is identical either way, which is the point of having one
          component for it. */}
      {children ?? label}
    </button>
  );
}
