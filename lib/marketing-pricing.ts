import { PHOLIO_APP_ORIGIN } from "@/lib/pholio-app-origin";
import { talentSignupHref } from "@/lib/talent-launch";

export const STUDIO_PLUS_PRICE_MONTHLY = 9.99;
export const STUDIO_PLUS_PRICE_ANNUAL = 95.88;
export const STUDIO_PLUS_ANNUAL_EQUIVALENT_MONTHLY = 7.99;
export const STUDIO_PLUS_TRIAL_DAYS = 14;

/* Before launch these resolve to /opening (lib/talent-launch.ts). */
export const FREE_SIGNUP_URL = talentSignupHref(`${PHOLIO_APP_ORIGIN}/signup`);
export const FREE_ONBOARDING_URL = talentSignupHref(`${PHOLIO_APP_ORIGIN}/onboarding`);
export const STUDIO_PLUS_SIGNUP_URL = talentSignupHref(
  `${PHOLIO_APP_ORIGIN}/signup?plan=studio`,
  "studio",
);

export function formatMoney(value: number) {
  return value.toFixed(value % 1 === 0 ? 0 : 2);
}
