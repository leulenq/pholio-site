"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import type { HeaderVariantId } from "@/lib/header-variants";
import type { HeaderVariantProps } from "./kit";

/* Client-only: the header samples the DOM (field polarity, scroll) on mount.
   next/dynamic requires the options to be an inline object literal. */
const VariantIndex = dynamic(() => import("./VariantIndex"), { ssr: false });

/**
 * One header. The variant indirection is kept because it is how a redesign gets
 * reviewed on the live site (`?header=<id>`) without a branch deploy — add a
 * second entry here and in lib/header-variants.ts when that day comes.
 */
export const HEADER_COMPONENTS: Record<
  HeaderVariantId,
  ComponentType<HeaderVariantProps>
> = {
  index: VariantIndex,
};

export type { HeaderVariantProps };
