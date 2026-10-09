import { LegalDocumentLayout, type LegalSection } from "./LegalDocumentLayout";
import { COMPANY_NAME, COMPANY_ADDRESS, EFFECTIVE_DATE, PRIVACY_EMAIL, SUPPORT_EMAIL } from "@/lib/legal-constants";
import { SUPPLEMENTAL_LAST_UPDATED } from "./supplemental-revision";

const sections: LegalSection[] = [
  { title: "What This Notice Covers", content: [
    "This notice explains Pholio's document-and-selfie verification flow. Read it with the [Privacy Policy](/privacy) and the notice presented immediately before a verification session. These checks are separate from paying for Studio+, applying to an agency, or consenting to a particular opportunity.",
    "New talent accounts are for adults aged 18 or older. Where Pholio requires this verification for a feature, it is intended to check an identity document, compare its photograph with a selfie, and compare the date of birth returned by the provider with your profile. It does not establish your professional suitability or guarantee that every person using Pholio has been verified.",
    "A verification result is not a promise of selection, employment, safety, representation, a background check or a recipient's reliability. A provider may make a mistake; a result must be considered within the limited purpose of the check."
  ] },
  { title: "Provider and Verification Steps", content: [
    "Pholio currently uses Stripe Identity for this flow. You are directed to the provider's verification interface to submit an identity document and a matching selfie. The provider may ask you to repeat a capture when the image or document cannot be assessed.",
    "Stripe's processing is described in its own [Privacy Policy](https://stripe.com/privacy) and the notice shown in the verification interface. Read those notices before proceeding. Stripe's responsibilities for processing it performs for Pholio and processing it performs for its own purposes can differ.",
    "The current Pholio flow requires the document-and-matching-selfie check. This notice does not say that Pholio performs every check available in Stripe Identity, or that a different provider or method is already available."
  ] },
  { title: "Document, Selfie and Biometric Processing", id: "biometrics", content: [
    "Document-to-selfie face matching can involve biometric processing. Do not treat a photograph-only description as a complete explanation of that processing. The contextual notice must identify the information collected, the specific purpose, who processes it, and the applicable storage and deletion terms before the check begins.",
    "Where applicable law requires a written release or other specific consent, that consent must be obtained separately before the relevant collection or processing. General acceptance of the Terms, a subscription purchase, or publication of a portfolio does not supply that consent.",
    "This draft is not itself a biometric release or a complete jurisdiction-specific retention policy. The relevant release and retention schedule must be available at the point of collection before a flow requiring them is enabled. You may decline to start the check; that can prevent use of a feature that genuinely requires verification, but does not authorize collection without the required consent."
  ] },
  { title: "Information Pholio Receives", content: [
    "Pholio records a verification-session reference, verification status, the consent version and timestamp, and relevant completion, failure and redaction status. The completion check compares the provider-returned date of birth with the date in your profile and checks whether it establishes an age of at least 18.",
    "The application does not need a public copy of your identity document or selfie to show a verification status. Do not upload an identity document to your portfolio, application package or ordinary support email. A verification result must not make your document, selfie or date of birth public by default.",
    "A recipient's receipt of an application does not give that recipient access to your verification documents. Any additional disclosure of verification information requires an identified purpose, legal basis and appropriate notice."
  ] },
  { title: "Results, Errors and Support", content: [
    "A completed provider check alone does not necessarily satisfy Pholio's age check. A date-of-birth mismatch or a result that does not establish adulthood can prevent the application from marking the check as verified. An incomplete or failed session can also require another attempt or support assistance.",
    `If you believe a result or profile date is incorrect, contact ${SUPPORT_EMAIL}. Identify the account and describe the problem; do not attach an identity document, selfie, full card number or password to an ordinary email. Support must provide an appropriate secure method if additional sensitive evidence is necessary.`,
    "Verification must not be used as a substitute for fair consideration of an application. A provider result does not authorize Pholio or a recipient to infer health, ethnicity, gender identity, criminal history or other unrelated characteristics."
  ] },
  { title: "Retention and Redaction", id: "retention", content: [
    "After a completed session is successfully processed, the application requests redaction of that Stripe Identity session. Redaction is an asynchronous provider operation. A request is not proof that redaction has finished, and an unsuccessful request must not be described as completed deletion.",
    "Limited status and consent records can remain necessary to administer the feature, document the check, address errors and comply with applicable obligations. The Privacy Policy governs the purposes and retention criteria for Pholio's records. A provider may retain separate records under its own obligations and privacy terms.",
    "Cancelling billing, unpublishing a portfolio or deleting a Pholio account does not itself establish that all verification records have been redacted. Contact the privacy address about verification deletion or access. Where biometric law requires a publicly available fixed retention schedule and destruction deadline, that schedule must be supplied before collection; this notice does not replace it with an invented universal deadline."
  ] },
  { title: "Adult-Context Information Is Separate", content: [
    "Optional information about adult-context work or boundaries is separate from identity verification. Saving that information does not automatically authorize sharing it with recipients or taking part in a particular job. Sharing controls and any specific opportunity consent must be respected.",
    "Being over 18, having a verified account, or applying to an opportunity is not consent to nudity, intimate content, a digital replica, a particular use of an image, or any change to a person's stated boundaries. Those matters require their own clear agreement where relevant."
  ] },
  { title: "Your Choices and Contact", content: [
    `Privacy, access, correction, deletion and consent questions: ${PRIVACY_EMAIL}. Verification-flow assistance: ${SUPPORT_EMAIL}. Available rights depend on applicable law; declining or withdrawing consent does not make earlier lawful processing unlawful, and does not remove rights you otherwise have.`,
    "Do not send us unnecessary sensitive evidence. We may need proportionate, secure information to verify a requester's authority. This document is a draft for review and is not a notice that an unimplemented consent, retention or alternative-verification process is already operating."
  ] },
];

export function VerificationNoticeContent() {
  return <LegalDocumentLayout title="Verification Notice" subtitle="Draft for review. Identity documents, matching selfies, age checks, consent and provider redaction. This notice is not yet effective." lastUpdated={SUPPLEMENTAL_LAST_UPDATED} effectiveDate={EFFECTIVE_DATE} sections={sections} contactEmail={PRIVACY_EMAIL} footerTitle="Verification privacy questions" companyName={COMPANY_NAME} companyAddress={COMPANY_ADDRESS} />;
}
