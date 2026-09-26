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
    title: "Scope and Standard",
    content: [
      `These Community Guidelines apply to every Pholio account, public portfolio, image, application, message, organization, agency, event, casting, brand, client, and other opportunity Recipient. They supplement the Terms of Service.`,
      `Use Pholio only for legitimate professional portfolio, representation, casting, event, collaboration, or related administration purposes. Be accurate about identity, role, authority, opportunity, compensation, and intended data use.`,
      `A violation may result in content restriction, removal, investigation, warning, suspension, termination, preservation, or a legally required report. Action depends on evidence, severity, recurrence, safety, law, and the rights of affected people.`,
    ],
  },
  {
    title: "Professional and Authorized Use",
    content: [
      `Talent may create and control professional portfolios, generate comp cards, review analytics, communicate, and submit to identified Recipients.`,
      `Authorized organizations may review submissions, administer genuine opportunities, communicate professionally, and manage information for the purpose shown to Talent.`,
      `You must have authority to upload every image and personal-data item, operate an organization account, invite team members, and submit or evaluate material for another person.`,
      `Off-platform meetings, contracts, travel, payments, shoots, fittings, and work are undertaken at the participants' own responsibility and remain subject to applicable licensing, labor, child-performer, insurance, safety, privacy, and contract law.`,
    ],
  },
  {
    title: "Prohibited Content and Conduct",
    content: [
      `3a. Sexual and exploitative content\nPornographic, sexually explicit, exploitative, coercive, or trafficked content is prohibited. Nude or intimate imagery is not appropriate for the Talent Platform or an initial submission. Any sexualized depiction of a minor is prohibited.`,
      `3b. Child sexual abuse material\nChild sexual abuse material and any content that sexually exploits or endangers a minor are prohibited. Do not download, copy, forward, or attach suspected material to a report. Provide only the location and circumstances. When Pholio obtains actual knowledge of an apparent reportable violation, it will preserve and report information to NCMEC as required by federal law.`,
      `3c. Nonconsensual intimate imagery and digital forgeries\nSharing or threatening to share an intimate image without consent, including a digitally created or altered image that appears to depict a real person, is prohibited. Sextortion, coercive image demands, and retaliation are prohibited.`,
      `3d. Harassment, threats, and doxxing\nThreats, stalking, repeated unwanted contact, intimidation, bullying, publishing private contact or location information, or evading a block or restriction are prohibited.`,
      `3e. Impersonation and deceptive profiles\nDo not impersonate a person, agency, brand, client, event, employee, scout, guardian, or rights holder; falsify credentials, licenses, representation, measurements, experience, identity, age, or work eligibility; or use edited or AI-generated material deceptively.`,
      `3f. Fraud, pay-to-secure schemes, and exploitation\nDo not demand payment to guarantee representation, selection, access, work, immigration status, or earnings; redirect users into deceptive payment or photo-service schemes; solicit financial credentials; facilitate trafficking; or exploit professional or age-related vulnerability.`,
      `3g. Hate, discrimination, and unlawful screening\nHateful content and unlawful discrimination are prohibited. Do not use a Platform filter, score, or AI output to evade civil-rights, employment, accessibility, candidate-notice, or automated-decision obligations.`,
      `3h. Rights violations and malicious activity\nCopyright, privacy, publicity, confidentiality, and trademark violations; malware; scraping; credential theft; unauthorized access; spam; and interference with the Platform are prohibited.`,
    ],
  },
  {
    title: "Minors",
    content: [
      `Users under 13 may not create accounts or provide personal information through Pholio. A user aged 13 to 17 requires guardian knowledge, supervision, and authorization and remains subject to any higher opportunity-specific minimum age.`,
      `A guardian email, consent link, or work-permit indicator is not proof of identity, relationship, custody, legal authority, permit validity, or authorization to work. Pholio may request additional evidence and restrict a minor profile or submission.`,
      `Do not contact a minor outside the authorized workflow, request private or sexual material, arrange unsupervised meetings or travel, or ask the minor to conceal contact from a guardian.`,
      `A submission does not satisfy child-performer permits, employer certificates, school, work-hour, trust-account, responsible-adult, safety, insurance, or other legal requirements. The party controlling the engagement is responsible for those requirements.`,
    ],
  },
  {
    title: "Opportunity and Recipient Integrity",
    content: [
      `A Recipient must identify the true organization and role, state a genuine purpose, collect only relevant information, limit access, and avoid misleading Talent about review, selection, compensation, expenses, publicity, or work.`,
      `An event, casting, brand, or client opportunity is not an agency-representation application unless it is expressly identified as one. A Recipient must not repurpose an agency submission for an event, publicity, training, advertising, or another purpose without a separate lawful basis.`,
      `A paid Pholio subscription is not payment to a Recipient and does not guarantee review, priority, selection, representation, work, or income. Opportunity rules may prohibit any paid advantage.`,
      `A Recipient may not create or commercially use a digital replica of Talent or use Talent's name, image, voice, or likeness in publicity or advertising without a separate agreement or consent that satisfies applicable law.`,
    ],
  },
  {
    title: "Reporting",
    content: [
      `Use the in-product report tool where available. It is intended for ordinary account, message, or content concerns, but it may not collect every fact required for a statutory notice.`,
      `Immediate danger: contact local emergency services first, then send the account, URL, time, and non-graphic circumstances to ${LEGAL_EMAIL}.`,
      `Child-safety concerns: send only identifying URLs, account information, and circumstances to ${LEGAL_EMAIL}. Do not download or redistribute suspected material.`,
      `Nonconsensual intimate image or digital forgery: use www.pholio.studio/take-it-down or send ${LEGAL_EMAIL} the content location, depicted person's name, requester's relationship or authority, contact information, a good-faith and accuracy statement, and a physical or electronic signature. Valid requests covered by the TAKE IT DOWN Act are processed within 48 hours as required by law, including known identical copies where required.`,
      `Privacy, unwanted likeness, or personal-data complaints: ${PRIVACY_EMAIL}. Copyright complaints: ${DMCA_EMAIL}. General help: ${SUPPORT_EMAIL}.`,
      `Do not make a knowingly false report, impersonate a victim or rights holder, or use reporting to harass another person.`,
    ],
  },
  {
    title: "Review, Enforcement, and Preservation",
    content: [
      `Pholio may restrict access while reviewing a credible safety, rights, or fraud concern. We may preserve relevant content or account information even after removal where required for a report, investigation, legal hold, dispute, or statutory preservation period.`,
      `We may warn, remove content, restrict features, revoke sessions, suspend, terminate, or notify a provider, Recipient, guardian, rights holder, insurer, regulator, NCMEC, or law enforcement where appropriate or required.`,
      `A public URL, Recipient copy, download, screenshot, cache, or off-platform message may remain outside Pholio after in-product removal. Tell us about known copies or locations so they can be evaluated.`,
      `Where an appeal is appropriate, send ${SUPPORT_EMAIL} the account, decision, and reason for appeal. Safety, legal-hold, child-protection, or court-ordered restrictions may not be appealable or may require additional verification.`,
    ],
  },
  {
    title: "Changes and Contact",
    content: [
      `We may update these Guidelines as the Platform, threats, or law change. We will update the dates above and provide any additional notice required by applicable law.`,
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
      subtitle="These Guidelines govern professional conduct, minors, opportunity integrity, prohibited content, reporting, preservation, and enforcement across Pholio."
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
