"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import type { HeaderVariantId } from "@/lib/header-variants";
import type { HeaderVariantProps } from "./kit";

/* Client-only: the header samples the DOM (field polarity, scroll) on mount.
   next/dynamic requires the options to be an inline object literal. */
const VariantIndex = dynamic(() => import("./VariantIndex"), { ssr: false });
const VariantStudioPlus = dynamic(() => import("./VariantStudioPlus"), {
  ssr: false,
});

/**
 * One header, and its Studio+ edition. The variant indirection is how a
 * redesign gets reviewed on the live site (`?header=<id>`) without a branch
 * deploy, and how a route carries its own edition by default
 * (`defaultHeaderVariantFor` in lib/header-variants.ts).
 */
export const HEADER_COMPONENTS: Record<
  HeaderVariantId,
  ComponentType<HeaderVariantProps>
> = {
  index: VariantIndex,
  "studio-plus": VariantStudioPlus,
};

export type { HeaderVariantProps };
