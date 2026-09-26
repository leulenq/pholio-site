import {
  STUDIO_PLUS_ANNUAL_EQUIVALENT_MONTHLY,
  STUDIO_PLUS_PRICE_ANNUAL,
  STUDIO_PLUS_PRICE_MONTHLY,
  STUDIO_PLUS_TRIAL_DAYS,
  FREE_SIGNUP_URL,
  STUDIO_PLUS_SIGNUP_URL,
  formatMoney,
} from "@/lib/marketing-pricing";

/**
 * Every visible string in the pricing section.
 *
 * Plain commercial register (`pholio-site-language`, site-mechanics §6).
 * Studio+ lists exactly what the app gates today (premium comp-card themes
 * and customization, the Studio+ site, 90-day analytics with CSV export),
 * never reach, review or volume. Agencies is not a tier: it is the other
 * side of the platform, free, and the
 * positioning line's nouns (official link, conforming, organized, exported)
 * and the request-access page's own "Agencies are never charged."
 *
 * Numbers come from `lib/marketing-pricing.ts`, never typed here.
 */

const money = (v: number) => `$${formatMoney(v)}`;

export type Interval = "monthly" | "annual";

export const HEADING = {
  before: "Start ",
  verdict: "free",
  after: ". Add Studio+ when you want more.",
} as const;

export const STUDIO_PRICES: Record<Interval, { price: string; unit: string; billing: string }> = {
  monthly: {
    price: money(STUDIO_PLUS_PRICE_MONTHLY),
    unit: "a month",
    billing: "Billed monthly.",
  },
  annual: {
    price: money(STUDIO_PLUS_ANNUAL_EQUIVALENT_MONTHLY),
    unit: "a month",
    billing: `Billed ${money(STUDIO_PLUS_PRICE_ANNUAL)} a year.`,
  },
};

export const INTERVAL_LABELS: Record<Interval, string> = {
  monthly: "Monthly",
  annual: "Annual",
};

/**
 * The annual total, set beside the annual option so the choice is priced
 * before it is made. The saving is left for the two figures to state.
 */
export const ANNUAL_TOTAL = money(STUDIO_PLUS_PRICE_ANNUAL);

export const PLANS = {
  free: {
    name: "Free",
    audience: "For talent",
    price: "$0",
    billing: "No card, and no fee to apply.",
    cta: { label: "Apply free", href: FREE_SIGNUP_URL },
    lead: null,
    features: [
      "Digitals and book, checked against each agency's requirements",
      "Standard comp card, front and back",
      "Applications on Pholio or through an agency's own process",
      "A record of every application you send",
      "7 days of portfolio analytics",
    ],
  },
  studio: {
    name: "Studio+",
    audience: "For talent",
    cta: { label: `Start ${STUDIO_PLUS_TRIAL_DAYS}-day free trial`, href: STUDIO_PLUS_SIGNUP_URL },
    lead: "Everything in Free, plus:",
    features: [
      "Premium comp-card themes and customization",
      "A site of your own",
      "90 days of portfolio analytics, with CSV export",
    ],
    note: "Nothing an agency sees or receives changes with Studio+.",
  },
  agencies: {
    name: "Agencies",
    audience: "For agencies reviewing talent",
    price: "$0",
    billing: "Agencies are never charged.",
    cta: { label: "Request access", href: "/agency/request-access" },
    lead: null,
    features: [
      "Your official application link",
      "Applications that meet your requirements, organized",
      "Exports to the tools you already use",
      "Every request reviewed by a person",
    ],
  },
} as const;
