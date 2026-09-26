"use client";

import {
  LegalDocumentLayout,
  type LegalSection,
} from "@/components/legal/LegalDocumentLayout";
import {
  COMPANY_ADDRESS,
  COMPANY_NAME,
  DMCA_EMAIL,
  EFFECTIVE_DATE,
  LAST_UPDATED,
  LEGAL_EMAIL,
  PRIVACY_EMAIL,
  SUPPORT_EMAIL,
} from "@/lib/legal-constants";

const sections: LegalSection[] = [
  {
    title: "Scope and Professional Use",
    content: [
      `These Community and Safety Guidelines form part of the [Terms of Service](/terms). They apply to use of the Services, including accounts, Public Sites, User Content, Submissions, Market activity, messages, shared selections and Organization workspaces. Capitalized terms have the meanings given in the Terms.`,
      `Use the Services for legitimate professional purposes. Talent, Organizations, Recipients and their authorized users must describe their identity, role, authority and intended use accurately, respect other people's rights, and comply with applicable law.`,
      `These rules also apply to conduct connected to a Pholio introduction or Submission when that conduct threatens a person's safety, exploits the Services, or violates the obligations accepted for the relevant opportunity. Pholio may restrict use of its Services in response without becoming a party to the participants' separate relationship.`,
    ],
  },
  {
    title: "Identity, Authority and Opportunity Integrity",
    content: [
      `Do not impersonate Talent, an Organization, a scout, a client, a guardian, a rights holder or Pholio. Do not falsify age, contact details, measurements, experience, representation, licenses, verification status, work eligibility or authority to act for another person.`,
      `A Recipient must have a genuine stated purpose for requesting materials and must accurately identify the responsible Organization, the nature of the opportunity and material participation conditions. Do not misstate compensation, expenses, deadlines, location, selection status or required rights. Representation review, event casting and a client's project must be described as the distinct activities they are.`,
      `Do not post fictitious opportunities, collect applications to build an unrelated mailing list, sell applicant data, or present a reference entry in Market as an endorsement, partnership or invitation that the Organization has not authorized.`,
      `Do not promise guaranteed representation, selection, work, immigration status or earnings in exchange for payment. Deceptive scouting, compulsory photo-service schemes, undisclosed conflicts, fraudulent fees and pressure to disclose payment credentials are prohibited. A Studio+ subscription does not purchase selection or preferential consideration by a Recipient.`,
    ],
  },
  {
    title: "Prohibited Sexual and Exploitative Conduct",
    content: [
      `Pornographic, sexually explicit, exploitative or trafficked content is prohibited. Nude or intimate imagery must not be uploaded to a Public Site, requested through a Submission, or used to condition access to an opportunity on Pholio.`,
      `Child sexual abuse material, sexualized depictions of minors, grooming and any conduct that sexually exploits or endangers a child are prohibited. Do not request, acquire or redistribute such material. Pholio reports apparent violations and preserves information when required by applicable child-safety law.`,
      `Sharing or threatening to share an intimate depiction without consent is prohibited, including an AI-generated or altered depiction made to appear authentic. Consent to create an image or share it privately is not permission to publish it or distribute it to another audience.`,
      `Sextortion, coercive image demands, trafficking, forced labor, sexual harassment, retaliation and abuse of a person's financial, immigration, professional or age-related vulnerability are prohibited.`,
    ],
  },
  {
    title: "Safe Contact and Respectful Treatment",
    content: [
      `Threats, stalking, hate speech, discriminatory harassment, doxxing, intimidation, repeated unwanted contact and evasion of a block or restriction are prohibited. Do not disclose another person's private address, contact information, financial details or sensitive records without authority.`,
      `Communications must relate to the purpose for which contact or materials were provided. Do not use a Submission, exported package, public contact link or shared selection for unrelated solicitation, spam, sexual contact or pressure to move into an unsafe private channel.`,
      `An introduction, message, interview request or invitation is not a signed contract. Before a meeting, shoot, event, travel or engagement, the responsible parties must agree on the material terms and satisfy applicable safety, labor, licensing and other obligations. A Pholio listing or verification result does not replace those duties.`,
      `Do not require a person to conceal communications, attend an undisclosed location, surrender identification documents, accept unwanted physical contact, or waive mandatory rights as a condition of consideration. Report threats or coercion using the channels below.`,
    ],
  },
  {
    title: "Content Rights, Data and Automated Tools",
    content: [
      `Upload, import, publish and share User Content only with sufficient copyright permission and any required privacy, publicity or other authority. Being depicted in a photograph does not necessarily give you its copyright. An Organization must have authority to provide another person's materials; access to an image or a public profile does not establish that authority.`,
      `Use a Submission only for its disclosed purpose and authorized related administration. Limit access to authorized people. Do not resell data, scrape or aggregate profiles without permission, circulate access tokens or private links to unauthorized people, or repurpose a representation application for advertising, an unrelated event or another undisclosed use.`,
      `Do not use another person's materials for model training, public advertising, merchandising, or creation or exploitation of a digital replica without the separate authorization and other lawful basis required for that use. General account acceptance, a public profile and a Submission are not those authorizations.`,
      `Hateful content and unlawful discrimination are prohibited. Do not use filters, rankings, AI outputs or proxies for protected characteristics to discriminate unlawfully or to evade employment, accessibility, candidate-notice or automated-decision obligations. Recipients must exercise the human review and other safeguards required by the [Organization Terms](/legal/agency-terms) and [AI Notice](/ai-notice).`,
      `Do not use edited or synthetic media to misrepresent identity, current appearance, experience, consent or an opportunity. Do not remove rights information or falsely attribute work to another person.`,
    ],
  },
  {
    title: "Account Security and Service Integrity",
    content: [
      `Do not share or steal credentials, impersonate another team member, obtain unauthorized access, deploy malware, circumvent access controls, manipulate usage limits, or interfere with the Services. Organization members must use their own authorized accounts and respect the access granted to their role.`,
      `Automated collection, bulk account creation, message spam and unauthorized scraping are prohibited. Do not evade a suspension through another account, Organization, domain or person.`,
      `Do not misuse analytics, tracking links, search tools or verification processes to identify, monitor or target a person outside their disclosed professional purpose. Report suspected account compromise promptly to ${LEGAL_EMAIL}.`,
    ],
  },
  {
    title: "Children and Any Future Minor Program",
    content: [
      `Talent accounts are currently limited to adults as stated in the [Terms of Service](/terms). Do not falsify a date of birth or use an adult's or guardian's details to bypass that restriction. The [Guardian and Minor Notice](/legal/guardians) describes the conditions for any separately introduced minor program; it does not open one.`,
      `If a minor's information is present in the Services or a specifically authorized future program, do not contact or engage the minor outside the approved guardian-involved process. Do not request private or sexual material, arrange unsupervised meetings or travel, or ask a minor to hide contact from a guardian.`,
      `Guardian authorization, identity checks and a self-reported permit are not interchangeable. None alone establishes that a minor can lawfully work, travel or license publicity rights. The party responsible for an engagement must meet applicable child-performer, supervision, education, work-hour, trust-account and safety requirements.`,
      `A child or guardian can report a safety concern or request removal without creating a Pholio account.`,
    ],
  },
  {
    title: "Reports and Urgent Requests",
    content: [
      `For immediate danger, contact local emergency services. Pholio is not an emergency-response service. For other safety concerns, use an available in-product report control or email ${LEGAL_EMAIL} with the relevant account, URL or message identifier, approximate time and a concise description.`,
      `For an intimate image or digital forgery shared without consent, use the [Intimate Image Removal process](/take-it-down). An account or copyright ownership is not required. The process explains the written notice requirements and the 48-hour removal obligation for valid requests covered by the TAKE IT DOWN Act.`,
      `For suspected child sexual abuse material, provide the location and non-graphic circumstances to ${LEGAL_EMAIL}. Do not download, copy, forward or attach the material to make a report.`,
      `For privacy, unwanted likeness or personal-data concerns, contact ${PRIVACY_EMAIL}. Copyright owners and authorized representatives can use the [Copyright Policy](/dmca) or contact ${DMCA_EMAIL}. General support is available at ${SUPPORT_EMAIL}.`,
      `Reports must be made honestly. Do not impersonate a victim or rights holder, submit knowingly false allegations, retaliate against a good-faith reporter or abuse reporting to harass another person.`,
    ],
  },
  {
    title: "Review, Enforcement and Appeals",
    content: [
      `Pholio may review reported or detected violations and restrict access while a matter is investigated. Depending on the evidence, severity, recurrence, safety risk and applicable law, action may include a warning, content removal, limitation of sharing or messaging, revocation of access, suspension or termination under the Terms.`,
      `We may preserve relevant records, restrict internal access, and disclose information to service providers, affected people or competent authorities where required or permitted for safety, legal process or enforcement. Removal from view does not necessarily end a legal preservation duty. The [Privacy Policy](/privacy) explains the handling of report and safety information.`,
      `To challenge an enforcement decision, contact ${SUPPORT_EMAIL} with the account, decision and reasons for review. We will consider relevant information and correct a decision where appropriate. A report or appeal does not stay an urgent protective measure, a legally required removal or a court order.`,
      `Pholio cannot remove copies held independently by another website, Recipient or device. Restrictions within the Services do not determine the parties' rights under a separate contract or prevent a person from seeking a legal remedy.`,
    ],
  },
  {
    title: "Changes and Contact",
    content: [
      `Changes to these Guidelines follow the amendment and notice provisions in the [Terms of Service](/terms). A revised version does not retroactively authorize prohibited conduct or expand a permission you separately granted.`,
      `Trust, safety, exploitation, or urgent legal reports: ${LEGAL_EMAIL}`,
      `Privacy and likeness reports: ${PRIVACY_EMAIL}`,
      `Copyright reports: ${DMCA_EMAIL}`,
    ],
  },
];

export function CommunityGuidelinesContent() {
  return (
    <LegalDocumentLayout
      title="Community and Safety Guidelines"
      subtitle="The standards for professional conduct, safe contact, authorized content and genuine opportunities throughout the Pholio Services."
      lastUpdated={LAST_UPDATED}
      effectiveDate={EFFECTIVE_DATE}
      sections={sections}
      contactEmail={LEGAL_EMAIL}
      footerTitle="Report a Safety Concern"
      footerBody="For urgent safety, exploitation, trafficking, child-protection, or nonconsensual-intimate-image concerns, provide the account or URL and non-graphic circumstances. Do not redistribute suspected illegal material."
      companyName={COMPANY_NAME}
      companyAddress={COMPANY_ADDRESS}
    />
  );
}
