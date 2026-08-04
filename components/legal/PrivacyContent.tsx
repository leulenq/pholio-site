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
    title: "Who We Are and How to Contact Us",
    content: [
      `${COMPANY_NAME} ("Pholio," "we," "our," or "us") operates www.pholio.studio and app.pholio.studio (together, the "Platform"). Pholio determines the purposes and means of the account, portfolio, submission, safety, and product data processing described in this Policy unless an opportunity-specific notice identifies a different arrangement.`,
      `Privacy requests and questions: ${PRIVACY_EMAIL}`,
      `Legal and safety questions: ${LEGAL_EMAIL}`,
      `Do not send passwords, payment-card data, government identification, or intimate images by email. A counsel-approved postal service address will be published when available.`,
    ],
  },
  {
    title: "Scope and Territorial Availability",
    content: [
      `This Policy applies when you visit the marketing site, create or use a Platform account, publish or view a portfolio, submit to or review an opportunity, communicate through Pholio, subscribe, or contact us. It does not govern a third party's independent website or off-platform processing.`,
      `An agency, casting organization, event producer, brand, client, or other Recipient may act as an independent controller or business for the copy of data it receives and for later off-platform activity. Review that Recipient's notice before proceeding.`,
      `The initial production launch is directed to users in the United States. The Platform may be technically accessible elsewhere, but technical accessibility alone is not an offer in every jurisdiction. Users outside the United States should contact ${PRIVACY_EMAIL} before submitting sensitive data.`,
    ],
  },
  {
    title: "Personal Data We Collect",
    content: [
      `3a. Account and identity data\nName, email address, Firebase user identifier, sign-in provider information, role, account status, email-verification status, dates and timestamps, and session identifiers. Firebase stores and verifies credentials; Pholio does not store your plaintext password. Account entry currently requests name and email before the onboarding flow requests date of birth.`,
      `3b. Talent profile and professional data\nDisplay or professional name, pronouns, biography, date of birth, age band, city, country, market, languages, training, experience, specialties, representation history, union or work-eligibility information, availability, social-media handles, portfolio links, and other professional information you provide.`,
      `3c. Measurements and appearance information\nHeight, weight, bust or chest, waist, hips, inseam, dress, suit and shoe measurements, hair and eye color, gender or division information, body type, tattoos, piercings, ethnicity or heritage, and related attributes. These fields can be sensitive in context and may reveal or correlate with protected characteristics.`,
      `3d. Images, media, and metadata\nOriginal uploads, processed images, thumbnails, file names, dimensions, format, upload date, ordering, image type, moderation status, rights or release information, and technical metadata. Images are stored with Cloudflare R2. Processed files and, in some configurations, originals are addressed through direct CDN URLs. A URL that has already been copied or shared may remain reachable until the object is removed or the URL is invalidated.`,
      `3e. Applications and opportunity data\nRecipient, opportunity or board, draft, selected images and comp card, submission note, package fingerprint, disclosure and confirmation records, submission time, status, withdrawal, messages, interviews, reminders, internal Recipient activity, and technical audit events.`,
      `3f. Payments and subscriptions\nStripe customer and subscription identifiers, plan, interval, trial and renewal dates, status, and transaction references. Stripe collects card and billing information directly. Pholio does not store full card numbers or CVV values.`,
      `3g. AI-assisted and derived data\nImages, profile text, AI-generated descriptions, embeddings, compatibility or match information, photo-quality or presentation signals, face-structure and body-impression descriptions, archetype or market-fit scores, and casting-style summaries. Depending on the feature and index version, inputs may include location, age band, gender or division information, measurements, body type, hair, eye color, ethnicity or heritage, and Recipient criteria. See the AI Notice.`,
      `3h. Technical, security, and approximate-location data\nIP address, forwarded network address, browser, operating system, device type, user agent, referrer, timestamps, error records, rate-limit data, session records, and country, region, city, timezone, or coordinates derived from IP through ipapi.co or another configured provider.`,
      `3i. Portfolio analytics\nPublic portfolio views and interactions, including profile views, returning-visitor status, image impressions or opens, image dwell, biography reads, contact or social clicks, scroll depth, referrer, share-token activity, and approximate market information. Portfolio analytics records can include a persistent visitor identifier, IP address, user agent, and timestamps; they are not necessarily anonymous when collected.`,
      `3j. Guardian, age, and compliance data\nDate of birth, minor status, guardian name and email, consent or authorization status and token, submission-specific authorization, and self-reported work-permit status. A guardian email or work-permit indicator is not identity, relationship, custody, or government-document verification.`,
      `3k. Rights, safety, and support data\nLegal acknowledgments, consent and withdrawal records, report details, moderation and enforcement events, deletion or provider-purge status, privacy requests, support communications, and information needed to investigate fraud, abuse, infringement, exploitation, or security incidents.`,
    ],
  },
  {
    title: "How We Use Personal Data",
    content: [
      `(a) create, authenticate, secure, support, and administer accounts;`,
      `(b) build portfolios and comp cards and provide profile, application, messaging, analytics, and subscription features;`,
      `(c) publish or make a profile discoverable according to the settings and product state associated with the account;`,
      `(d) transmit a submission to the Recipient selected by Talent and maintain the associated record;`,
      `(e) generate search indexes, embeddings, quality, compatibility, or ranking information as described in the AI Notice;`,
      `(f) send transactional, safety, legal, application, billing, and, where authorized, marketing communications;`,
      `(g) prevent, detect, investigate, and respond to fraud, abuse, infringement, exploitation, unsafe conduct, security events, and violations of our policies;`,
      `(h) debug, measure, maintain, and improve the Platform; and`,
      `(i) comply with law, lawful process, recordkeeping duties, disputes, and legal claims.`,
      `Pholio does not sell personal data or share it for cross-context behavioral advertising as those terms are currently defined under applicable U.S. state privacy laws.`,
    ],
  },
  {
    title: "Public Profiles, Discoverability, and Blocking",
    content: [
      `A profile can have separate public-portfolio, agency-discoverability, contact-sharing, analytics, and field-visibility states. Some new or legacy accounts may begin with one or more visibility or analytics settings enabled. Review account settings before uploading or publishing sensitive information.`,
      `When a portfolio is public, anyone with the URL may be able to view the fields and media rendered on it, including social handles and appearance or professional information. Search engines, recipients, viewers, and third parties may copy, screenshot, cache, download, or independently retain public information. Pholio cannot recall every copy made outside its systems.`,
      `Agency discoverability can make profile information and derived search signals visible to authorized organization users even when the public portfolio is not the only source of access. Submitting to a Recipient separately authorizes that Recipient to receive the submitted package.`,
      `A blocked-organization setting is intended to limit specified in-product activity, but it does not remove public information, recall a prior submission or download, prevent access through another account, or guarantee that every name or domain variation is matched. If blocking relates to harassment, exploitation, or personal safety, contact ${LEGAL_EMAIL} so we can apply and document additional restrictions.`,
      `Turning a profile private or deleting media changes future Platform presentation after the request is processed; it does not immediately invalidate every CDN, cache, application snapshot, backup, analytics record, or Recipient copy.`,
    ],
  },
  {
    title: "Recipients and Service Providers",
    content: [
      `6a. Opportunity Recipients\nAt Talent's direction, we disclose the selected submission package to the identified agency, event producer, casting organization, brand, client, or other Recipient and its authorized personnel. The Recipient may be an independent controller or business for its use, retention, decisions, and off-platform copies.`,
      `6b. Service providers\nProviders used by the Platform may include Firebase or Google for authentication; Stripe for billing; Groq and OpenAI for AI processing; Cloudflare for object storage and delivery; Neon for database hosting; Netlify for hosting and functions; ipapi.co for IP-derived location; and a configured email-delivery provider for transactional email. Provider identity and configuration can change. Contact ${PRIVACY_EMAIL} for the current list relevant to a request.`,
      `6c. Safety, legal process, and professional advisers\nWe may disclose information to law enforcement, NCMEC, regulators, courts, professional advisers, insurers, auditors, or other parties when required or permitted by law, necessary to report apparent unlawful material, protect a person, investigate misuse, or establish or defend legal claims.`,
      `6d. Corporate transactions\nInformation may be transferred in a financing, merger, acquisition, reorganization, insolvency, or sale of assets, subject to applicable law and notice requirements.`,
      `6e. De-identified information\nWe may use or disclose aggregated or de-identified information where we reasonably believe it cannot be linked to a person and where we commit not to re-identify it except to test the de-identification process or as permitted by law.`,
    ],
  },
  {
    title: "Legal Bases, Consent, and United States Privacy Laws",
    content: [
      `For United States users, we process information to provide requested services, operate and secure the Platform, comply with law, and pursue legitimate business purposes described above. Specific state laws may grant additional rights or require consent for minors, sensitive information, profiling, biometrics, or other processing.`,
      `Where consent is legally required, the request should identify the data, purpose, and available choice. A Terms acceptance, Privacy Policy acknowledgment, guardian authorization, public-profile setting, image-AI setting, and opportunity submission are distinct actions and do not automatically authorize one another.`,
      `Known New York users aged 13 to 17 may have the right to decline nonessential processing through a separate, informed and revocable choice. Refusal should not reduce service or increase price unless the processing is strictly necessary for that feature.`,
      `Where the EU GDPR or UK GDPR lawfully applies, possible bases can include contract, legitimate interests, consent, legal obligation, and protection of vital interests. Special-category processing requires an Article 9 condition. This Policy does not represent that every current processing activity has been approved for EEA or UK rollout.`,
    ],
  },
  {
    title: "Children and Teen Privacy",
    content: [
      `The Platform is not directed to children under 13, and under-13 users may not create accounts or provide personal information. Because date of birth is requested after initial account entry, an under-13 user may have provided name, email, account, device, or session information before the age screen is completed. If we learn this occurred, we will investigate and delete or restrict that information as required by law.`,
      `Users aged 13 to 17 may use the Platform only with guardian involvement and subject to applicable law and opportunity-specific eligibility. A user-supplied guardian email is not proof of identity, adulthood, relationship, custody, or legal authority. We may request additional evidence.`,
      `Guardian authorization for account use or a submission does not itself authorize employment, travel, test shoots, publicity, commercial image use, digital replicas, medical examinations, or other later activity. Child-performer permits, employer certificates, work hours, education, trust accounts, insurance, supervision, and other protections may apply before work.`,
      `A known minor may also have independent consent and privacy rights. Parents, guardians, and minors can contact ${PRIVACY_EMAIL} to review, revoke, restrict, or delete qualifying information.`,
    ],
  },
  {
    title: "Cookies and Portfolio Analytics",
    content: [
      `Authenticated sessions currently use a first-party Express session cookie commonly named connect.sid with a configured lifetime of up to seven days. Firebase stores authentication credentials or refresh information in browser storage until logout, revocation, or expiry. Stripe may use cookies during checkout.`,
      `A non-owner visit to a public portfolio can set pholio_visitor_id for up to one year and a profile-specific pholio_session_<profile identifier> cookie for approximately 30 minutes. Associated server records can include visitor and session identifiers, IP address, user agent, referrer, returning-visitor status, timestamps, and interaction events.`,
      `The application may store pholio_cookie_consent_v1 in localStorage to remember a necessary/analytics preference. This browser preference does not itself delete prior analytics and may not govern every server-side security or public-portfolio event currently collected.`,
      `We do not currently use third-party advertising pixels or cross-context behavioral-advertising cookies on the authenticated application. See the Cookie Policy for a fuller inventory.`,
    ],
  },
  {
    title: "Retention and Deletion",
    content: [
      `We retain personal data for the period reasonably necessary for the purposes described here, subject to account state, provider deletion cycles, security, disputes, legal claims, financial records, and legal obligations. Where a fixed period is not stated, these criteria determine the period.`,
      `Account and profile data: Generally retained while the account is active. After a deletion request, database records are deleted or de-identified subject to required or permitted exceptions. Provider deletion can remain pending if Firebase, object storage, or another provider is unavailable.`,
      `Media: Live objects are removed when a supported deletion succeeds. CDN caches, backups, previously copied URLs, and Recipient copies can persist longer. We record provider-purge failures so they can be retried, but deletion is not complete until the relevant providers confirm or no longer retain the object.`,
      `Submission drafts: An active server-side draft generally expires after 90 days without renewal; a deleted or expired payload can remain recoverable for approximately seven additional days before purge.`,
      `Submitted applications: The submitted package is generally scheduled for redaction or deletion approximately 24 months after submission. Status, consent, safety, audit, legal, and limited application records may be retained longer where necessary. Recipient copies follow the Recipient's retention obligations.`,
      `Sessions: The browser session cookie is configured for up to seven days. Server-side session rows may persist until expiration, account deletion, manual revocation, or database cleanup.`,
      `Portfolio analytics: Visitor cookies have the periods described above. Server analytics and IP-bearing records are retained according to active operational schedules and can be kept longer for security, fraud, disputes, or legal obligations. We do not represent that all such records are automatically purged after 90 days.`,
      `Billing and legal records: Transaction, tax, assent, consent, complaint, moderation, security, and dispute records may be retained for the period required or reasonably necessary to demonstrate compliance or resolve claims.`,
    ],
  },
  {
    title: "Security and Incident Response",
    content: [
      `Pholio uses HTTPS, Firebase authentication, server-side sessions, managed database and object-storage providers, provider encryption at rest, application access controls, and security or moderation logging in parts of the Platform. These measures reduce risk but do not guarantee confidentiality, integrity, availability, or that every user-selected visibility control prevents all access.`,
      `Public portfolios and direct media URLs are not confidential. Do not upload information that is unnecessary for a professional portfolio or submission, including government identifiers, payment credentials, medical records, precise home addresses, or intimate material.`,
      `If you suspect account compromise, unauthorized disclosure, or a security incident, contact ${LEGAL_EMAIL} promptly. We will investigate and provide notices to affected people and authorities when and within the time required by applicable law.`,
    ],
  },
  {
    title: "Your Rights and Requests",
    content: [
      `Depending on location and applicable law, you may have rights to know, access, correct, delete, restrict, object, withdraw consent, receive portable data, obtain information about profiling, request human review, limit qualifying sensitive-data use, appeal a refusal, and receive equal service. Rights are subject to verification and legal exceptions.`,
      `Some settings can change profile data, visibility, notifications, analytics preferences, AI image settings, sessions, export, deactivation, or deletion. A setting is not proof that every downstream copy, provider record, prior submission, or legal record has been changed. Use ${PRIVACY_EMAIL} when you need a verified rights request or confirmation of completion.`,
      `We may verify your identity and authority, especially for deletion, export, guardian, representative, or safety-sensitive requests. We respond within the period required by the law that applies to the request. If no statutory deadline applies, we aim to respond within a reasonable time.`,
      `A request concerning a Recipient's independent copy must also be sent to that Recipient. Pholio can restrict in-product access but cannot guarantee deletion from an independent system it does not control.`,
    ],
  },
  {
    title: "International Processing",
    content: [
      `Pholio and its providers primarily process information in the United States and in other locations where a provider operates. Data-protection and government-access rules can differ from those in your country.`,
      `Before intentionally offering the full Platform to EEA or UK residents, Pholio must determine and document applicable transfer mechanisms, Article 27 representation, special-category conditions, age-appropriate design, profiling safeguards, and provider terms. No EU or UK representative is currently identified in this Policy.`,
      `If you are in the EEA or UK and believe the law applies to your use, contact ${PRIVACY_EMAIL}. You may also have the right to complain to a competent supervisory authority.`,
    ],
  },
  {
    title: "Changes to This Policy",
    content: [
      `We may update this Policy as practices, providers, features, or law change. We will update the dates above and provide any additional notice or renewed consent required by applicable law. Notice may be delivered by email, through the Platform, or by posting the revised Policy.`,
      `A material change will not be applied retroactively where prohibited. You may request the version associated with your account or a submission at ${PRIVACY_EMAIL}.`,
    ],
  },
];

export function PrivacyContent() {
  return (
    <LegalDocumentLayout
      title="Privacy Policy"
      subtitle="This Policy describes Pholio's current collection, publication, analytics, AI, submission, minor, retention, deletion, and security practices. Public-profile controls, AI settings, submissions, and guardian authorizations are separate choices."
      lastUpdated={LAST_UPDATED}
      effectiveDate={EFFECTIVE_DATE}
      sections={sections}
      contactEmail={PRIVACY_EMAIL}
      footerTitle="Privacy Questions or Requests"
      footerBody="Contact the Privacy Team for access, correction, deletion, consent, profiling, minor-data, or provider-processing questions."
      companyName={COMPANY_NAME}
      companyAddress={COMPANY_ADDRESS}
    />
  );
}
