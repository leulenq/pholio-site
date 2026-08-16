"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

import { EASES } from "./motion";

/**
 * The two curves the section moves on.
 *
 * This is the entire GSAP surface area. No timelines, no ScrollTrigger, no
 * SplitText, no DOM mutation: `CustomEase` compiles an SVG path into a plain
 * `(t) => t` function, which Framer's `useTransform` takes directly. The
 * library is here because a multi-segment curve says something a single
 * `cubic-bezier()` cannot, and because that curve is the part of the motion
 * nobody should notice (`lessons.md` §17.5).
 */

gsap.registerPlugin(CustomEase);

export const settle = CustomEase.create("pholioSettle", EASES.settle);
export const leave = CustomEase.create("pholioLeave", EASES.leave);
