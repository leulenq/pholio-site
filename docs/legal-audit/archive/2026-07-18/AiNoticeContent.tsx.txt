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
    title: "Purpose and Scope",
    content: [
      `${COMPANY_NAME} ("Pholio," "we," "our," or "us") uses automated and artificial-intelligence systems in parts of the Pholio platform. This Notice describes the systems currently used or supported, the information they may process, how outputs can affect search or presentation, and available controls.`,
      `This Notice supplements the Privacy Policy and Terms of Service. It is a notice, not a representation that an AI output is accurate, fair, legally compliant for every Recipient, or suitable for a particular casting, representation, employment, or event decision.`,
      `An opportunity-specific notice may state that AI or automated ranking is disabled, limited, or used differently for that opportunity. The opportunity-specific notice controls for that submission.`,
    ],
  },
  {
    title: "Systems and Providers",
    content: [
      `2a. Image analysis\nSelected portfolio images may be transmitted to Groq, Inc. or another disclosed inference provider. Current image analysis can describe visible facial structure, apparent body impression, styling or presentation characteristics, image quality, aesthetic or market signals, and indicative runway, editorial, commercial, or lifestyle fit. These are machine-generated estimates, not verified facts or professional assessments.`,
      `2b. Profile embeddings\nProfile text and structured profile information may be sent to OpenAI or another disclosed embedding provider to create numerical vectors used for semantic search and discovery. Depending on the index or feature version, source text may include biography, location, experience, categories, languages, gender or division information, age band, height, body type, hair or eye color, ethnicity or heritage, and AI-generated image descriptions.`,
      `2c. Match, ranking, and quality signals\nPholio may combine embeddings with rule-based signals, Recipient criteria, profile completeness, location, measurements, activity, and image-derived information to calculate compatibility, quality, ranking, or ordering information. A Recipient may see these signals when reviewing search results or applications.`,
      `2d. Provider terms\nProvider processing is governed by Pholio's account configuration, the provider's applicable service terms, and any contract then in effect. Pholio does not authorize a provider to use Talent data for general model training unless that use is separately disclosed and lawfully authorized. Contact ${PRIVACY_EMAIL} for current provider information.`,
    ],
  },
  {
    title: "Image Settings, Embeddings, and Consent",
    content: [
      `Image analysis and profile embeddings are separate processing activities. Turning off an image-analysis setting does not necessarily stop profile embeddings, search indexing, rule-based ranking, or processing already completed.`,
      `For an eligible account, the image-analysis setting may initially be enabled. You can disable an available image-analysis setting in account settings. Disabling it is intended to stop new image-analysis requests after the change is processed; it does not automatically delete prior scores, descriptions, logs, embeddings, or Recipient copies.`,
      `Profile embeddings may be generated as part of search and discovery even when image analysis is disabled. You may object to qualifying profiling or request deletion or re-indexing by contacting ${PRIVACY_EMAIL}. An opt-out may reduce or prevent discoverability where the feature technically depends on the data.`,
      `Where applicable law requires consent for a specific person, data category, or purpose, Pholio will request that consent or restrict the processing. A general acknowledgment of the Terms or Privacy Policy is not a substitute for a separate consent where one is legally required.`,
    ],
  },
  {
    title: "Sensitive Attributes and Facial Analysis",
    content: [
      `Profile and image systems can process information that is sensitive in context or correlates with protected characteristics, including age band, gender or division information, height, weight or other measurements, body type, ethnicity or heritage, skin tone or contrast, hair, facial structure, and appearance descriptors.`,
      `Pholio does not use uploaded photographs for identity authentication or one-to-one facial recognition as part of the Talent experience described in this Notice. Image analysis nevertheless processes facial and body characteristics. Whether a provider creates or retains face geometry, landmarks, templates, or other legally regulated biometric information depends on the provider and technical configuration. Contact ${PRIVACY_EMAIL} for a current technical description before relying on this Notice for a biometric-law determination.`,
      `Do not upload a government ID, medical image, intimate image, or image you lack authority to process through an AI feature.`,
    ],
  },
  {
    title: "Advisory Outputs and Human Decisions",
    content: [
      `AI outputs are probabilistic and can be wrong, incomplete, culturally narrow, or biased. A quality score or match score is not an objective measure of attractiveness, identity, employability, representation potential, or likely professional success.`,
      `Pholio does not enter a representation, employment, booking, or event contract solely through an AI output. Recipients make their own decisions and remain responsible for human review and for compliance with civil-rights, employment, model-management, accessibility, candidate-notice, and automated-decision laws.`,
      `Where an automated tool substantially assists screening for a regulated opportunity, the responsible employer, employment agency, client, or Recipient may need to provide notices, an alternative process, information about assessed characteristics, or an independent bias audit. The availability of a Pholio score does not satisfy those obligations.`,
      `You may request information about, correction of, or human review of an output by contacting ${LEGAL_EMAIL}. Human review cannot require a Recipient to offer representation, work, or another outcome.`,
    ],
  },
  {
    title: "Bias, Validation, and Appropriate Use",
    content: [
      `Models and embeddings can reproduce bias from their training data, prompts, labels, and user behavior. Appearance, language, geography, disability, age, gender, race or ethnicity, and body characteristics can affect outputs directly or through proxies.`,
      `Recipients must not use an AI output as the sole basis for an opportunity decision or use a Pholio feature in a discriminatory or otherwise unlawful manner. A user-selected filter may also create legal risk even when the underlying software is neutral.`,
      `Unless Pholio publishes an opportunity-specific validation or audit, no representation is made that a model or score has been independently validated for employment selection, meets a four-fifths or other statistical test, or has been audited under New York City Local Law 144 or another automated-decision law.`,
    ],
  },
  {
    title: "Minors",
    content: [
      `Users under 13 are not permitted to provide personal information through a Pholio account. A parent or guardian who believes an under-13 child created an account should contact ${PRIVACY_EMAIL} immediately.`,
      `For a known user aged 13 to 17, nonessential AI or profiling may require the minor's separate informed consent in addition to guardian involvement. A guardian email or account-level authorization does not automatically authorize every AI purpose.`,
      `Pholio may restrict AI features for known minors or for a specific opportunity. A minor and guardian should review both this Notice and the opportunity-specific terms before submitting.`,
    ],
  },
  {
    title: "Retention, Deletion, and Provider Copies",
    content: [
      `AI-derived descriptions, scores, and embeddings may remain associated with an active profile and may be regenerated when profile data changes. Logs, application records, moderation records, backups, and copies already made available to a Recipient can have different retention periods.`,
      `Disabling a setting does not itself remove historical outputs. You may request deletion of qualifying AI-derived data at ${PRIVACY_EMAIL}. We may retain limited records where reasonably necessary for security, legal compliance, disputes, or proof of consent or withdrawal. Provider deletion can take additional time and may be subject to provider backup cycles.`,
      `If removal of an AI output requires re-indexing or materially disables a search feature, we will explain that effect when responding to the request.`,
    ],
  },
  {
    title: "Contact",
    content: [
      `Privacy, consent, opt-out, access, or deletion requests: ${PRIVACY_EMAIL}`,
      `Fairness, human-review, legal, or opportunity-specific questions: ${LEGAL_EMAIL}`,
      `Include the account email, affected image or profile, feature involved, and the output or decision you are asking us to review. Do not send passwords, government IDs, or intimate images by email.`,
    ],
  },
];

export function AiNoticeContent() {
  return (
    <LegalDocumentLayout
      title="AI Notice"
      subtitle="This Notice explains Pholio's current image analysis, profile embeddings, search and ranking signals, sensitive inputs, limitations, and available controls. Image settings and profile embeddings are separate processing activities."
      lastUpdated={LAST_UPDATED}
      effectiveDate={EFFECTIVE_DATE}
      sections={sections}
      contactEmail={PRIVACY_EMAIL}
      footerTitle="Questions About AI Processing?"
      footerBody="Contact the Privacy Team about AI data, settings, consent, opt-out, deletion, or provider processing. Contact the Legal Team to request human review of an output."
      companyName={COMPANY_NAME}
      companyAddress={COMPANY_ADDRESS}
    />
  );
}
