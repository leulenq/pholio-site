import { cubicBezier } from "framer-motion";

/**
 * Tunables for the page's own weight.
 *
 * The scroll sections author their choreography against scroll position;
 * this file is about how the scroll position itself moves. See
 * `components/scroll-inertia/index.tsx` and `lessons.md` §45.
 */

/**
 * How the page follows a wheel or trackpad gesture.
 *
 * `lerp` is the fraction of the remaining distance the page closes per 60Hz
 * frame, made frame-rate independent by Lenis (`damp`, lambda = lerp * 60).
 * It is an exponential approach, so it cannot overshoot: the page yields
 * behind the input and catches up, with no bounce and no elastic settle.
 *
 *   lerp   time constant   95% settled
 *   0.10   0.17s           0.50s
 *   0.08   0.21s           0.62s
 *   0.06   0.28s           0.83s
 *
 * 0.08 is the weight: heavier than the 0.3–0.5s the Flowty study measured
 * as "weighted rather than mechanically pinned to the wheel"
 * (`docs/design-language/07-reference-flowty.md` §3.3), still short of the
 * point where the page reads as swimming behind the hand.
 *
 * `wheelMultiplier` is left at 1 on purpose. Every beat's pace on the home
 * stage is measured in scroll distance (`lessons.md` §27.1); scaling the
 * wheel would retime all of them at once.
 */
export const PAGE_INERTIA = {
  lerp: 0.08,
  wheelMultiplier: 1,
} as const;

/**
 * Programmatic travel: the page taken to a place by the site itself (a form
 * that scrolls back to its title, the hero's invitation). Motion is arrival,
 * so this is the house ease over a fixed duration rather than a lerp: the
 * page leaves decisively and settles long, and the curve never passes its
 * target.
 */
export const PAGE_TRAVEL = {
  duration: 1.1,
  easing: cubicBezier(0.22, 1, 0.36, 1),
} as const;
