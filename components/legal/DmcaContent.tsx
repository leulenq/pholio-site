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
} from "@/lib/legal-constants";

const sections: LegalSection[] = [
  {
    title: "Purpose and Status of This Policy",
    content: [
      `${COMPANY_NAME} ("Pholio," "we," "our," or "us") respects copyright and provides the notice, removal, counter-notice, and repeat-infringer process described here for content on www.pholio.studio and app.pholio.studio.`,
      `The Digital Millennium Copyright Act ("DMCA"), 17 U.S.C. § 512, provides conditional limitations on liability for qualifying service providers that satisfy statutory requirements. Publication of this Policy does not itself establish, represent, or warrant that Pholio has satisfied every condition for a statutory safe harbor.`,
      `The Copyright Office's public directory, rather than this Policy, controls whether a designated-agent registration is active. Until an active designation and complete service address are confirmed, ${DMCA_EMAIL} is Pholio's operational copyright-report contact and should not be described as proof of registration.`,
    ],
  },
  {
    title: "Where to Send a Copyright Notice",
    content: [
      `Send copyright notices and counter-notices to:`,
      `Email: ${DMCA_EMAIL}`,
      `Subject: Copyright Notice — [URL or account]`,
      `Do not send copyright notices only through a generic in-product report, social-media message, or employee account. If the Copyright Office directory identifies a different agent or service address, use the directory information in addition to the email above.`,
      `For privacy, likeness, nonconsensual imagery, harassment, or safety issues rather than copyright ownership, contact ${PRIVACY_EMAIL} or ${LEGAL_EMAIL}.`,
    ],
  },
  {
    title: "Copyright Notice Requirements",
    content: [
      `A notice alleging copyright infringement should include:`,
      `(a) a physical or electronic signature of the copyright owner or authorized agent;`,
      `(b) identification of the copyrighted work, or a representative list where appropriate;`,
      `(c) identification and location of the material at issue, including a direct URL, portfolio slug, image, or other information reasonably sufficient for us to locate it;`,
      `(d) the claimant's name, mailing address, telephone number, and email address;`,
      `(e) a statement of good-faith belief that the complained-of use is not authorized by the copyright owner, its agent, or the law; and`,
      `(f) a statement that the information is accurate and, under penalty of perjury, that the sender is authorized to act for the owner of the allegedly infringed exclusive right.`,
      `If a notice identifies the work and material but is incomplete, we may contact the sender for information reasonably necessary to evaluate it. Knowingly material misrepresentations can create liability under 17 U.S.C. § 512(f).`,
    ],
  },
  {
    title: "Review and Removal",
    content: [
      `After receiving a substantially compliant notice, Pholio will locate the material, preserve an appropriate case record, and act expeditiously to remove or disable access where required or appropriate. Timing depends on completeness, location, emergency risk, and legal requirements.`,
      `Where appropriate, we will notify the uploader, provide the substance of the complaint, and explain the counter-notice process. We may share the notice or counter-notice with the affected user, claimant, service providers, advisers, or authorities as necessary to administer the process or comply with law.`,
      `Removal from Pholio does not remove a copy independently retained by another website, Recipient, search engine, cache, device, or person.`,
    ],
  },
  {
    title: "Counter-Notice",
    content: [
      `An uploader who believes material was removed because of mistake or misidentification may send a counter-notice containing:`,
      `(a) the uploader's physical or electronic signature;`,
      `(b) identification of the removed material and its prior location;`,
      `(c) a statement under penalty of perjury that the uploader has a good-faith belief the material was removed or disabled because of mistake or misidentification;`,
      `(d) the uploader's name, address, and telephone number; and`,
      `(e) consent to the jurisdiction and service-of-process statement required by 17 U.S.C. § 512(g)(3).`,
      `We may forward a valid counter-notice to the original claimant. Where the statutory process applies, the material may be restored no sooner than ten and no later than fourteen business days after the counter-notice is forwarded unless we receive notice that the claimant filed an action seeking a court order. We may decline restoration for a separate policy, safety, rights, or legal reason.`,
    ],
  },
  {
    title: "Repeat Infringers",
    content: [
      `Pholio may warn, restrict, suspend, or terminate users who repeatedly or egregiously infringe copyright, taking account of valid notices, counter-notices, retractions, court outcomes, context, and abuse of the complaint process.`,
      `We do not publish a rigid strike number that would require us to ignore context or treat a disputed notice as finally adjudicated. We maintain records reasonably necessary to apply the policy and may terminate a user after a single willful or severe infringement where appropriate.`,
    ],
  },
  {
    title: "Portfolio Photography and Authority",
    content: [
      `The person depicted in a photograph does not necessarily own its copyright. Talent must have sufficient permission from the photographer or other copyright owner to upload, publish, create a comp card from, and submit each image.`,
      `A model release or consent from the person depicted and a copyright license from the photographer address different rights. Pholio does not verify every license or release merely because a file can be uploaded.`,
      `Recipients may use submitted media only for the authorized evaluation and administration purpose unless they obtain a separate license or release for publicity, advertising, merchandising, digital replicas, or another use.`,
    ],
  },
  {
    title: "Other Image and Safety Complaints",
    content: [
      `Copyright is different from privacy, publicity, consent, intimate-image, impersonation, harassment, and child-safety law. A person shown in an image who does not own the copyright can still have a separate complaint.`,
      `Nonconsensual intimate images or digital forgeries: use the public process at www.pholio.studio/take-it-down or contact ${LEGAL_EMAIL} with the location, identity of the depicted person or authorized representative, contact information, a statement that the request is accurate and made in good faith, and a signature. Valid requests subject to the TAKE IT DOWN Act are handled under the legally required 48-hour process, including known identical copies where required.`,
      `Apparent child sexual abuse material or immediate danger: do not download, forward, or attach the material. Send the location and circumstances to ${LEGAL_EMAIL} and contact emergency services where necessary. Pholio reports apparent violations to NCMEC or law enforcement when required by law after obtaining actual knowledge.`,
      `Other privacy or likeness complaints: ${PRIVACY_EMAIL}. Trademark or other legal complaints: ${LEGAL_EMAIL}.`,
    ],
  },
  {
    title: "Changes and Contact",
    content: [
      `We may update this Policy as law, registration status, contact details, or operations change. We will update the dates above and provide any additional notice required by law.`,
      `Copyright reports and counter-notices: ${DMCA_EMAIL}`,
      `General legal and safety matters: ${LEGAL_EMAIL}`,
    ],
  },
];

export function DmcaContent() {
  return (
    <LegalDocumentLayout
      title="Copyright and DMCA Policy"
      subtitle="This Policy explains how to report copyright infringement, submit a counter-notice, and distinguish copyright complaints from privacy, likeness, intimate-image, and child-safety reports."
      lastUpdated={LAST_UPDATED}
      effectiveDate={EFFECTIVE_DATE}
      sections={sections}
      contactEmail={DMCA_EMAIL}
      footerTitle="Submit a Copyright Notice"
      footerBody="Include the required ownership, location, contact, good-faith, accuracy, authority, and signature information so the report can be evaluated."
      companyName={COMPANY_NAME}
      companyAddress={COMPANY_ADDRESS}
    />
  );
}
