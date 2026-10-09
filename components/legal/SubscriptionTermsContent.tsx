import { LegalDocumentLayout, type LegalSection } from "./LegalDocumentLayout";
import { COMPANY_NAME, COMPANY_ADDRESS, EFFECTIVE_DATE, LEGAL_EMAIL, SUPPORT_EMAIL } from "@/lib/legal-constants";
import { PHOLIO_APP_ORIGIN } from "@/lib/pholio-app-origin";
import { STUDIO_PLUS_PRICE_MONTHLY, STUDIO_PLUS_PRICE_ANNUAL, STUDIO_PLUS_TRIAL_DAYS, formatMoney } from "@/lib/marketing-pricing";
import { SUPPLEMENTAL_LAST_UPDATED } from "./supplemental-revision";

const billing = `${PHOLIO_APP_ORIGIN}/dashboard/talent/settings/subscription`;
const sections: LegalSection[] = [
  { title: "Scope and Your Purchase", content: [
    `These Subscription Terms supplement the [Terms of Service](/terms) when you purchase Studio+ from Pholio. The offer shown before you authorize payment identifies the plan, billing period, currency, taxes, trial eligibility, first charge and cancellation terms for your purchase. Keep that confirmation for your records.`,
    `Studio+ is optional software for talent. Agency access and applications are free. Payment does not buy preferential agency presentation, greater application reach, search placement, review speed, selection, representation, work or income. Pholio does not represent you or take a commission on your work.`,
    `Availability may depend on your account's eligibility and the jurisdiction in which the paid service is offered. A publicly accessible pricing page is not confirmation that checkout is available everywhere.`
  ] },
  { title: "Price and Billing Period", content: [
    `The standard Studio+ price is US $${formatMoney(STUDIO_PLUS_PRICE_MONTHLY)} per month or US $${formatMoney(STUDIO_PLUS_PRICE_ANNUAL)} per year. The annual plan is charged as an annual amount, not as twelve monthly installments. Any applicable tax or a different expressly disclosed offer must be identified before payment is authorized.`,
    `Choose your billing period before purchase. The checkout total and retained purchase confirmation govern the transaction you authorize. A material difference from the advertised offer must be disclosed and accepted before you are charged; a general Terms acceptance does not authorize an undisclosed price.`,
    `Stripe processes subscription payments. You must use a payment method you are authorized to use and maintain accurate billing information. Pholio does not store your full payment-card number or security code.`
  ] },
  { title: "Free Trial and First Charge", content: [
    `Where the checkout offers the standard trial, it lasts ${STUDIO_PLUS_TRIAL_DAYS} days. The offer must identify when the trial ends, the first paid charge, the billing period and how to cancel before that charge. Trial eligibility and any limitation on repeat trials must be disclosed in the offer.`,
    `If you expressly authorize an automatically renewing trial subscription and do not cancel before the disclosed deadline, it converts to the paid plan you selected. Starting an ordinary Free account does not by itself authorize recurring billing.`,
    `Cancel before the trial conversion deadline if you do not want the first charge. A trial reminder helps you keep track of that deadline but does not replace the checkout disclosure or your cancellation confirmation. Required notices must be given where applicable law requires them.`
  ] },
  { title: "Recurring Authorization and Renewal", content: [
    `A paid subscription renews for the same billing period until cancelled, subject to the terms you accepted and any lawful, properly notified change. Recurring payment requires your express informed authorization; payment cannot be inferred merely from browsing, using Free features, or acknowledging the Privacy Policy.`,
    `The purchase acknowledgment must be retainable and identify the authorized amount and frequency, trial conversion if applicable, and cancellation mechanism. Where a renewal reminder or additional authorization is required by law, those requirements remain applicable.`,
    `You may withdraw recurring-payment authorization by cancelling through the available billing controls or contacting us for assistance. This does not erase a charge already lawfully incurred or an independent obligation established by law.`
  ] },
  { title: "How to Cancel", id: "cancel", content: [
    `Open [Subscription settings](${billing}) in your talent account and use the subscription-management link to reach the Stripe billing portal. Follow the cancellation steps and retain the confirmation and the date on which it takes effect. Cancelling must not require buying another service or giving up a statutory right.`,
    `If billing controls cannot be reached, or a cancellation is not acknowledged, contact ${SUPPORT_EMAIL} with the account email and enough purchase information to identify the subscription. Do not send a full card number, security code, password or identity document. You do not have to resolve an unrelated account issue before asking to stop renewal.`,
    `A cancellation stops future renewal when processed according to the applicable deadline and cancellation terms. Ordinarily paid access continues through the current paid period, unless you request immediate termination, a refund changes that period, or suspension is justified under the Terms. The confirmation should state the actual access end date.`
  ] },
  { title: "Refunds and Mandatory Rights", content: [
    `Unless your offer or applicable law provides otherwise, a lawful subscription charge is not refunded solely because you stop using Studio+ or cancel partway through a paid period. This does not exclude a mandatory refund, cooling-off right, remedy for an unauthorized or incorrect charge, or a remedy for a service that was not supplied as required.`,
    `Contact ${SUPPORT_EMAIL} promptly about a duplicate charge, an undisclosed price, a failed cancellation, or a disputed purchase. We may need limited information to identify and investigate the transaction. You may also use the complaint or payment-dispute rights available under applicable law.`,
    `No provision here prevents you from making a truthful complaint, obtaining independent advice, contacting a regulator or exercising your payment-provider rights.`
  ] },
  { title: "Changes, Failed Payments and Access", content: [
    `A price increase or other material subscription change must be communicated before it applies, with the notice, consent, cancellation and refund protection required by applicable law. An already purchased period is not retrospectively repriced. If you do not want a properly notified future change, cancel before the relevant renewal or other disclosed deadline.`,
    `A failed payment may lead to a payment-update request, payment retries authorized under the applicable payment terms, or loss of paid access. It does not authorize a new undisclosed charge or a change to the free application and agency-access rules.`,
    `After Studio+ ends, features limited to that subscription may no longer be available, including premium editing, the Studio+ site and the longer analytics window. Ending the subscription does not itself delete your account or retract packages already sent. Download any materials or records you wish to retain while the relevant export feature remains available.`
  ] },
  { title: "Account Deletion and Separate Actions", content: [
    `Cancel your subscription separately before deleting your account. The current account-deletion process does not by itself cancel a Stripe subscription. If you have already deleted the account, contact ${SUPPORT_EMAIL} to identify and stop any remaining subscription. Account deletion must not be used to obstruct your cancellation rights.`,
    `Unpublishing a portfolio, withdrawing an application, deleting an account and cancelling billing have different effects. None automatically recalls all recipient downloads, public caches, lawful billing records or provider-held verification records. See the [Privacy Policy](/privacy) and [Submission Notice](/legal/submission-program).`
  ] },
  { title: "Contact and Governing Terms", content: [
    `Billing help and cancellation assistance: ${SUPPORT_EMAIL}. Questions about these terms: ${LEGAL_EMAIL}. Identify the account and the disputed transaction without supplying unnecessary sensitive information.`,
    `The general Terms apply to matters not addressed here. These terms govern the subscription subject matter; a specific purchase disclosure governs the offer you accepted to the extent it lawfully provides more specific terms. Mandatory consumer rights are preserved. This draft does not authorize charging anyone or establish an effective date for an existing subscription.`
  ] },
];

export function SubscriptionTermsContent() {
  return <LegalDocumentLayout title="Subscription Terms" subtitle="Draft for review. Studio+ pricing, trial conversion, recurring billing, cancellation and refunds. These terms are not yet effective." lastUpdated={SUPPLEMENTAL_LAST_UPDATED} effectiveDate={EFFECTIVE_DATE} sections={sections} contactEmail={SUPPORT_EMAIL} footerTitle="Billing and cancellation help" companyName={COMPANY_NAME} companyAddress={COMPANY_ADDRESS} />;
}
