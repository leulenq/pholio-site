"use client";

import {
  LegalDocumentLayout,
  type LegalSection,
} from "@/components/legal/LegalDocumentLayout";
import {
  COMPANY_ADDRESS,
  COMPANY_NAME,
  EFFECTIVE_DATE,
  LAST_UPDATED,
  LEGAL_EMAIL,
  PRIVACY_EMAIL,
} from "@/lib/legal-constants";

const sections: LegalSection[] = [
  {
    title: "Purpose",
    content: [
      `${COMPANY_NAME} ("Pholio," "we," "our," or "us") provides this process for a person depicted in an intimate image, or an authorized representative, to request removal of a real or digitally created or altered intimate image shared without consent.`,
      `This process is available without a Pholio account. It is separate from copyright ownership, ordinary privacy requests, Community Guidelines reports, and reports of child sexual abuse material.`,
      `Do not download, forward, or attach suspected illegal material merely to make a report. A direct Pholio URL, portfolio slug, message identifier, account, or other information sufficient to locate it is preferred.`,
    ],
  },
  {
    title: "Who May Submit",
    content: [
      `A request may be submitted by the individual depicted, the individual's authorized representative, or a parent or legal guardian acting for a depicted minor.`,
      `We may request information reasonably necessary to verify the depicted person, representative authority, or guardianship. Do not email a government ID unless we specifically request it through a secure method.`,
    ],
  },
  {
    title: "Required Request Information",
    content: [
      `Send the request to ${LEGAL_EMAIL} with the subject "TAKE IT DOWN Request." Include:`,
      `(a) the direct URL, portfolio, account, message, image identifier, or other information reasonably sufficient to locate the content;`,
      `(b) the name and contact information of the requester;`,
      `(c) the name of the depicted individual and, if different, the requester's relationship and authority to act;`,
      `(d) a brief description sufficient to distinguish the image without redistributing it;`,
      `(e) a statement that the requester has a good-faith belief the identified content is an intimate depiction of the identified individual and was published without consent, or that consent was lawfully withdrawn where applicable;`,
      `(f) a statement that the information in the request is accurate and that the requester is the depicted individual or is authorized to act for that individual; and`,
      `(g) the requester's physical or electronic signature.`,
      `If information is missing, we may contact the requester. The 48-hour removal period for a valid request begins as provided by applicable law, not when an incomplete or unlocatable email is first sent.`,
    ],
  },
  {
    title: "What Pholio Will Do",
    content: [
      `We will assign or communicate a request identifier, restrict internal access to people with a need to act, and evaluate whether the request is valid and the content is within Pholio's control.`,
      `For a valid request covered by the TAKE IT DOWN Act, Pholio will remove the identified content and make reasonable efforts to identify and remove known identical copies within 48 hours as required by law. We may preserve limited evidence where required for legal compliance, safety, abuse prevention, or a law-enforcement request.`,
      `Removal from Pholio does not remove an independent screenshot, download, Recipient copy, search-engine cache, other website, device, or off-platform message. Provide known Pholio locations or copies so they can be evaluated.`,
      `We will communicate completion, a request for more information, or the reason a request could not be completed through the contact information supplied.`,
    ],
  },
  {
    title: "Minors and Apparent CSAM",
    content: [
      `If the content may depict a minor in sexually explicit conduct or may otherwise be child sexual abuse material, do not download, copy, hash, forward, or attach it. Provide only the location and non-graphic circumstances to ${LEGAL_EMAIL}.`,
      `When Pholio obtains actual knowledge of an apparent violation subject to federal reporting law, Pholio will report and preserve information as required. Immediate danger should be reported to emergency services.`,
    ],
  },
  {
    title: "Privacy, Abuse, and Records",
    content: [
      `We use request information to locate content, verify authority, communicate, prevent abuse, preserve legally required evidence, demonstrate compliance, and protect affected people. It may be disclosed to service providers, advisers, authorities, NCMEC, or law enforcement when necessary or required.`,
      `Do not submit a knowingly false request, impersonate a depicted person, or use this process to harass or remove lawful non-intimate content. False statements can carry legal consequences.`,
      `For non-intimate privacy or likeness concerns, contact ${PRIVACY_EMAIL}. For copyright ownership concerns, use the Copyright and DMCA Policy.`,
    ],
  },
  {
    title: "Contact",
    content: [
      `TAKE IT DOWN and urgent safety requests: ${LEGAL_EMAIL}`,
      `General privacy and likeness requests: ${PRIVACY_EMAIL}`,
    ],
  },
];

export function TakeItDownContent() {
  return (
    <LegalDocumentLayout
      title="Intimate Image Removal"
      subtitle="Use this public process to request removal of a real or digitally created or altered intimate image shared without the depicted person's consent. A Pholio account is not required."
      lastUpdated={LAST_UPDATED}
      effectiveDate={EFFECTIVE_DATE}
      sections={sections}
      contactEmail={LEGAL_EMAIL}
      footerTitle="Submit a TAKE IT DOWN Request"
      footerBody="Email the content location, requester and depicted-person information, required good-faith and accuracy statements, authority if acting for someone else, and a physical or electronic signature. Do not redistribute the image."
      companyName={COMPANY_NAME}
      companyAddress={COMPANY_ADDRESS}
    />
  );
}
