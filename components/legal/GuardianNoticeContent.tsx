import { LegalDocumentLayout, type LegalSection } from "./LegalDocumentLayout";
import { COMPANY_NAME, COMPANY_ADDRESS, EFFECTIVE_DATE, PRIVACY_EMAIL, SUPPORT_EMAIL } from "@/lib/legal-constants";
import { SUPPLEMENTAL_LAST_UPDATED } from "./supplemental-revision";

const sections: LegalSection[] = [
  { title: "Current Adult-Only Eligibility", content: [
    "New talent accounts on Pholio are for adults aged 18 or older. Pholio is not currently opening a guardian-sponsored talent-account program. A parent's permission does not override this eligibility rule, and this notice is not an invitation to create a minor's account.",
    "Legacy references to guardian approval, an email-confirmation link, or a recipient accepting younger applicants do not establish that a minors program is open. A recipient's own age criteria also do not determine eligibility for a Pholio account.",
    "Do not enter a false birth date or use an adult's identity to create an account for a child. A future change to eligibility would require a separately announced program and its own safeguards, notices and agreements. It cannot be inferred from this draft."
  ] },
  { title: "If You Find a Minor's Account or Material", content: [
    `Contact ${SUPPORT_EMAIL} if you believe a child has created an account, appears in an application without appropriate authority, or is being contacted through Pholio in a way that raises a safety concern. Contact ${PRIVACY_EMAIL} about the child's personal information. Include only what is needed to locate the account or material and explain the concern.`,
    "Do not redistribute intimate material, send an identity document in ordinary email, or submit excessive information about the child. Use the [Take It Down](/take-it-down) reporting path for non-consensual intimate imagery. If there is an immediate threat, contact the appropriate emergency or child-protection service.",
    "A report does not require you to approve a contract on the child's behalf. We may need proportionate information about your authority before disclosing private account information or acting on a request that affects another person's rights."
  ] },
  { title: "Existing Restricted Accounts and Safety Actions", content: [
    "An existing account identified as belonging to a minor can be restricted. Restrictions do not mean the account has been approved for participation. Safety actions can include withdrawing a submission, requesting an export or deletion, revoking an existing permission, and reporting abuse.",
    "A restriction or account deletion does not automatically recall recipient downloads, screenshots, external publications or public caches. Pholio must address its own records and available controls; independent recipients remain responsible for their copies and applicable obligations. See the [Privacy Policy](/privacy) and [Submission Notice](/legal/submission-program).",
    "A parent or guardian must not use safety or privacy controls to obtain another person's private information without appropriate authority. We will assess the request's purpose, authority and the rights of the people affected."
  ] },
  { title: "Limits of Legacy Email Confirmation", content: [
    "Some older records or interfaces may refer to guardian confirmation by email, permissions with a defined scope, or revocation links. Possession of an email link establishes control of that mailbox only. It does not by itself prove adulthood, parenthood, legal guardianship, custody, the child's identity, or the legal authority to agree to work.",
    "A historical confirmation must not be represented as permission for every future recipient, opportunity, image use or account action. Its recorded scope and limits matter, and it does not override the current adult-only eligibility rule.",
    "This notice does not restart, extend or validate a historical permission. If you need help locating or withdrawing an earlier permission, contact support rather than forwarding a private confirmation link to someone else."
  ] },
  { title: "Work, Images and Recipient Responsibility", content: [
    "Pholio is a software platform and does not represent talent, employ a child, appoint a guardian, or authorize a recipient to engage a minor. A recipient must independently comply with applicable child-employment, agency, safeguarding, education, working-time, permit and image-use rules.",
    "A submission, a parent's general agreement, or an identity check does not authorize intimate content, a digital replica or a new commercial use of an image. Any legally required permission must identify the actual purpose and scope and must be obtained through an appropriate process.",
    "No adult-context feature is a route around age restrictions. A recipient's invitation or a payment for a subscription does not change account eligibility or create permission to disregard a person's boundaries."
  ] },
  { title: "Privacy Requests and Children Under 13", content: [
    `Pholio does not permit accounts for children under 13. If you believe Pholio has collected a child's information in circumstances that require action, contact ${PRIVACY_EMAIL} promptly. We will assess and address the report, including deletion or other required steps under applicable law.`,
    "Where a parent or legal guardian has applicable rights to review, correct, delete or stop further processing of a child's information, those rights remain available. Verification of the request must be proportionate and secure. We will not require a child's sensitive information in an ordinary email merely to start the conversation.",
    "A deletion request can be subject to a lawful need to preserve limited records, such as evidence needed to address a safety report or comply with a legal obligation. Any limitation must be explained as applicable to the request rather than treated as a blanket exception."
  ] },
  { title: "Any Future Guardian Program", content: [
    "Before any minors program opens, Pholio would need to define eligible ages and jurisdictions, verify authority through an appropriate method, provide age-appropriate privacy and safety information, and implement the specific consent and protection requirements that apply. A dormant route or draft document is not evidence that those requirements have been met.",
    "A future guardian agreement would have to identify the actual permissions, recipients, duration, revocation process and consequences. It would not remove a child's independent rights or transfer a recipient's employment and safeguarding obligations to a parent.",
    "This document makes no promise that such a program will open. Until an explicit eligibility change is announced, the current adult-only rule remains the basis for new talent accounts."
  ] },
  { title: "Contact", content: [
    `Account and safety assistance: ${SUPPORT_EMAIL}. Personal-information requests: ${PRIVACY_EMAIL}. Describe the account, your relationship to the affected person and the action requested without attaching unnecessary sensitive evidence.`,
    "This notice supplements the general Terms and Privacy Policy and preserves mandatory rights. It is a draft for review, is not yet effective, and does not approve a child's account or establish a guardian-consent program."
  ] },
];

export function GuardianNoticeContent() {
  return <LegalDocumentLayout title="Guardian Notice" subtitle="Draft for review. Adult-only account eligibility, legacy guardian permissions and requests concerning a child's information. This notice is not yet effective." lastUpdated={SUPPLEMENTAL_LAST_UPDATED} effectiveDate={EFFECTIVE_DATE} sections={sections} contactEmail={PRIVACY_EMAIL} footerTitle="Child privacy and guardian requests" companyName={COMPANY_NAME} companyAddress={COMPANY_ADDRESS} />;
}
