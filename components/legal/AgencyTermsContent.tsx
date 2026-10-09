import { LegalDocumentLayout, type LegalSection } from "./LegalDocumentLayout";
import { COMPANY_NAME, COMPANY_ADDRESS, EFFECTIVE_DATE, LEGAL_EMAIL, PRIVACY_EMAIL } from "@/lib/legal-constants";
import { SUPPLEMENTAL_LAST_UPDATED } from "./supplemental-revision";

const sections: LegalSection[] = [
  { title: "Scope and Authority", content: [
    `These Agency and Recipient Terms supplement the [Terms of Service](/terms) for an organization receiving or reviewing talent materials through Pholio. A Recipient may be an agency, casting organization, event producer, brand, designer or another identified organization. Its purpose and permitted audience must be disclosed in the applicable opportunity or submission flow.`,
    `A person accepting for an organization must have authority to bind it. An individual login acceptance does not establish that a separate organizational agreement has been accepted by an authorized representative. Identify your organization accurately and keep its authorized users and account details current.`,
    `Pholio supplies software. It does not represent talent, act as your employee, grant you a talent-services license, issue permits or guarantee that a person is suitable or safe. Agency access is free; a separate signed agreement is required for any separately negotiated service.`
  ] },
  { title: "Applications and Permitted Use", content: [
    `Use an application only for the evaluation and administration purpose stated when the applicant sent it, and only by personnel with a legitimate role in that purpose. A representation application is not unrestricted permission to send someone to clients or unrelated opportunities. An event submission is not a general agency-application consent.`,
    `You may review, make necessary internal notes, and use permitted print or export functions for that disclosed purpose, subject to the applicant's permissions and applicable law. Internal sharing must remain limited to the authorized audience. A shared link must not silently expand that audience or the period of access.`,
    `Do not sell talent materials, publish an application, build an unrelated contact list, use submitted images in advertising, license them to a third party, train a general AI model on them, or create a digital replica without the separate authority and consent required for that specific use. Ownership of the submitted work remains with its owner.`
  ] },
  { title: "Opportunity and Event Disclosures", content: [
    `Publish accurate eligibility, required materials, fees if any, review windows, organization identity, contact details, purpose and recipient audience. Distinguish a genuinely required condition from a preference. Do not claim an affiliation, endorsement, decision, license or verified status that has not been established.`,
    `If an event gives designers, clients or outside reviewers access, identify the audience and purpose before submission. Each outside recipient must have a lawful role and equivalent use restrictions. A generic reference to an event does not authorize unlimited downstream access.`,
    `A submission status must describe what actually happened. A prepared package is not evidence of delivery; an elapsed review window is not evidence that you reviewed or rejected the applicant. The [Submission Notice](/legal/submission-program) explains the corresponding applicant disclosures.`
  ] },
  { title: "Fair Decisions and Human Responsibility", content: [
    `You remain responsible for evaluation, contact, selection and any later engagement. Do not discriminate unlawfully, harass, exploit or retaliate against an applicant, or evade applicable protections through proxy criteria. Respect reasonable accommodation and alternative-process duties where they apply.`,
    `A search order, generated description, completeness indicator or other automated signal is not a professional assessment, identity clearance or hiring decision. Apply meaningful human judgment and verify facts that matter. If your use triggers an audit, candidate-notice, consent, explanation or other automated-decision requirement, you must satisfy it before using that system for the regulated purpose.`,
    `Do not infer health, ethnicity, sexuality, legal work eligibility or another sensitive fact from a photograph or a generated description. Optional sensitive context and verification outcomes may be used only within their disclosed, authorized purpose. See the [AI Notice](/ai-notice) and [Verification Notice](/legal/verification).`
  ] },
  { title: "Safety, Work and Separate Agreements", content: [
    `Contact talent professionally and within the disclosed opportunity. No application grants consent to nudity, intimate activity, medical examinations, travel, a test shoot, employment, representation, exclusivity, a power of attorney or a digital replica. Obtain any necessary separate agreement and specific consent without coercion.`,
    `You are responsible for the licensing, registration, workplace safety, compensation, anti-harassment, performer, immigration and permit duties applicable to your activities. Calling a service casting, discovery or independent contracting does not remove obligations imposed by law.`,
    `Do not demand payment for guaranteed selection, representation, work, visas or earnings. Do not condition fair review on a Pholio subscription. Report suspected exploitation, impersonation or unlawful material through the [Community Guidelines](/community-guidelines) and relevant safety channels.`,
    `The launch talent service is restricted to adults. Do not import or expose a minor's materials as a way around that restriction. The [Guardian Notice](/legal/guardians) describes existing minor-data requests and the separate conditions for a later program; it does not authorize one.`
  ] },
  { title: "Privacy Roles and Notices", content: [
    `Pholio controls processing for its own accounts, product operation, security, billing and platform purposes as described in the [Privacy Policy](/privacy). A Recipient is responsible for the evaluation decisions and other processing it independently controls, including its external records, notes and copies. Roles follow the actual activity, not a label in these terms.`,
    `Provide the applicant notices, lawful basis, purpose limitations, security and rights handling required for your processing. When you import information about a nonuser, establish your authority and any required direct or indirect collection notice. Do not assume that a public photograph or an employee's upload creates unrestricted permission.`,
    `Where Pholio processes agency-private records solely on your documented instructions, the parties must put the appropriate processor or service-provider agreement and completed processing/security schedules in place. These general public terms do not themselves execute a data-processing agreement, international-transfer clauses or an event-specific sharing schedule.`
  ] },
  { title: "Access, Exports and Security", content: [
    `Use individual authorized accounts and appropriate access levels. Protect credentials and share links; do not share another user's session or circumvent access controls. Remove access when a person's role ends. Use exports only in systems and locations authorized for the stated purpose.`,
    `A downloaded file, printed card or screenshot remains your responsibility after it leaves Pholio. Do not treat an export as permission to retain information indefinitely or redistribute it. Apply appropriate access controls and deletion procedures to the copies you hold.`,
    `Promptly notify ${PRIVACY_EMAIL} of suspected unauthorized access or disclosure involving Pholio materials, with enough information to investigate safely. Cooperate in containment, evidence preservation and the notices required by law. Do not delay a legally required notice while waiting for a platform response.`
  ] },
  { title: "Retention, Withdrawal and Rights", content: [
    `Keep materials only for the disclosed purpose and a justified retention period. Apply a shorter opportunity-specific period where applicable. Withdrawal, expiry or deletion may restrict future access within Pholio; it does not automatically erase every independently held copy. You must assess and act on copies you control and any applicable legal retention exception.`,
    `When an applicant makes an access, correction, deletion, restriction or other rights request, respond for processing you control and cooperate with Pholio where the request involves both parties. Do not require the person to buy a subscription or accept unrelated terms to exercise a legal right. Contact ${PRIVACY_EMAIL} for coordination.`,
    `A legal hold must have a real basis, limited scope and restricted access. Preserve necessary evidence without leaving an ordinary evaluation package broadly accessible. Neither withdrawal nor a safety report authorizes destroying evidence that the law requires you to preserve.`
  ] },
  { title: "Enforcement and Contact", content: [
    `Pholio may restrict or suspend access under the Terms to protect people, investigate misuse or meet legal duties. A restriction does not cancel your responsibilities for information already received. Any contest or review procedure remains subject to the Terms and applicable law.`,
    `Contact ${LEGAL_EMAIL} about organizational authority, opportunity terms or contractual questions, and ${PRIVACY_EMAIL} about data handling. A specific signed agreement governs a conflict only to the extent it expressly addresses that subject. Mandatory labor, privacy and consumer protections remain unaffected.`,
    `This is a review draft, not evidence that any organization has accepted these terms or that an operational privacy agreement, screening process or regulatory registration exists.`
  ] },
];

export function AgencyTermsContent() {
  return <LegalDocumentLayout title="Agency and Recipient Terms" subtitle="Draft for review. Authority, permitted evaluation, safe contact and handling of talent materials by recipient organizations. These terms are not yet effective." lastUpdated={SUPPLEMENTAL_LAST_UPDATED} effectiveDate={EFFECTIVE_DATE} sections={sections} contactEmail={LEGAL_EMAIL} footerTitle="Recipient and organization questions" companyName={COMPANY_NAME} companyAddress={COMPANY_ADDRESS} />;
}
