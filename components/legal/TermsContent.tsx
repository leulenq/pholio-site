"use client";

import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import {
  ARBITRATION_SEAT,
  COMPANY_ADDRESS,
  COMPANY_NAME,
  EFFECTIVE_DATE,
  GOVERNING_LAW_STATE,
  LAST_UPDATED,
  LEGAL_EMAIL,
  PRIVACY_EMAIL,
} from "@/lib/legal-constants";

const CONTACT_EMAIL = LEGAL_EMAIL;

const sections = [
  {
    title: "Acceptance of Terms",
    content: [
      `These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and ${COMPANY_NAME} ("Pholio," "we," "our," or "us") governing your access to and use of the Pholio platform, including the marketing site at www.pholio.studio, the application at app.pholio.studio, and all associated services, features, APIs, and content (collectively, the "Platform").`,
      `BY CREATING AN ACCOUNT, CLICKING OR SELECTING AN AFFIRMATIVE ACCEPTANCE CONTROL, OR USING AN ACCOUNT AFTER THESE TERMS ARE PRESENTED TO YOU, YOU AGREE TO THESE TERMS. OUR PRIVACY POLICY (www.pholio.studio/privacy) IS A NOTICE ABOUT DATA HANDLING; YOUR ACKNOWLEDGMENT OF THAT NOTICE IS NOT CONSENT TO OPTIONAL PROCESSING THAT REQUIRES A SEPARATE CHOICE. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT CREATE OR USE AN ACCOUNT.`,
      `If you are entering into these Terms on behalf of a company, agency, or other legal entity, you represent that you have authority to bind that entity. In that case, "you" refers to both you individually and that entity. If you lack such authority, you must not accept these Terms or use the Platform.`,
      `Additional terms or notices may apply to a particular agency submission, open call, casting, event, sponsored program, subscription, or optional feature. Those opportunity-specific terms supplement these Terms and control for that opportunity if they expressly say so.`,
    ],
  },
  {
    title: "Changes to Terms",
    content: [
      `We may modify these Terms to reflect changes in the Platform, law, or our operations. We will update the "Last Updated" and "Effective Date" above and provide any additional notice required by applicable law. Depending on the change, notice may be delivered by email, an in-product notice, or a request for renewed acceptance.`,
      `A material change will not be applied retroactively where prohibited by law. If renewed acceptance is required and you decline, you may stop using and close your account. Non-material clarifications may take effect when posted.`,
      `You may request the version that applied to your account at ${CONTACT_EMAIL}.`,
    ],
  },
  {
    title: "Eligibility and Account Registration",
    content: [
      `3a. Age Requirements\nThe Platform is a general-audience service and is not directed to children under 13. You must be at least 13 and meet any higher minimum age that applies where you live. A Talent user under 18 may use the Platform only with the knowledge, supervision, and authorization of a parent or legal guardian who has authority to act for the minor. A guardian authorization does not by itself authorize employment, travel, a test shoot, a publicity use, a digital replica, or participation in a particular engagement. An opportunity may impose an 18+ requirement even when the Platform permits a minor account.`,
      `3b. Age and Guardian Verification\nWe may request date-of-birth, guardian, identity, relationship, or authority information. A self-reported date of birth, guardian email, or work-permit indicator is not a government verification or a determination that a minor may lawfully work. If we learn that an under-13 child provided personal information, we may suspend the account and delete or restrict the information as required by law. Parents and guardians may contact ${PRIVACY_EMAIL}.`,
      `3c. Account Accuracy\nWhen registering, you must provide accurate, current, and complete information. You are responsible for keeping your account information up to date. Providing false or misleading information may result in restriction, suspension, or termination.`,
      `3d. Account Security\nYou are responsible for protecting your credentials and devices and for promptly reporting suspected unauthorized access to ${CONTACT_EMAIL}. Security controls shown in the Platform, including session controls, reduce risk but do not guarantee that access on a compromised device has ended. Sign out of the underlying identity provider where appropriate and contact us if a device or credential is compromised.`,
      `3e. One Account Per User\nEach individual may hold one account. Agencies or other organizations may hold one organization account with authorized team members. Duplicate, shared, transferred, or fraudulent accounts are prohibited.`,
      `3f. User and Recipient Roles\n"Talent" means the person whose professional profile or submission is involved. "Recipient" means the organization identified for a submission, which may be an agency, model management company, casting organization, event producer, brand, client, or other opportunity organizer. A Recipient's role and obligations may differ by opportunity.`,
    ],
  },
  {
    title: "Platform Description and License",
    content: [
      `4a. Platform Services\nPholio provides software tools that allow Talent to create portfolios and comp cards, review analytics, communicate, and submit materials to Recipients, and that allow organizational users to review and administer talent information. As part of the standard Platform service, Pholio does not sign a representation agreement for Talent, negotiate compensation or contract terms on Talent's behalf, employ Talent, or guarantee representation, selection, bookings, work, immigration status, permits, compensation, or income. Any later representation, employment, contractor, booking, event, or publicity relationship is governed by a separate agreement between the relevant parties.`,
      `4b. Legal Classification\nDescriptions of Pholio as a software platform state the intended scope of the service and do not determine how a regulator or court may classify a particular activity under model-management, employment-agency, labor, or other law. Pholio may restrict or discontinue a feature where necessary to remain within its intended role or comply with applicable law.`,
      `4c. Limited License\nSubject to these Terms, Pholio grants you a limited, non-exclusive, non-transferable, revocable license to use the Platform for your personal professional or authorized organizational purposes. You may not resell, scrape, reverse engineer, interfere with, or commercially exploit the Platform except as expressly permitted in writing.`,
      `4d. Availability and Beta Features\nThe Platform may be unavailable, changed, suspended, or discontinued. Pre-release features are voluntary and provided as-is. We will provide notice where required by law, but we do not guarantee uninterrupted or error-free access.`,
    ],
  },
  {
    title: "Subscription Plans and Payment Terms",
    content: [
      `5a. Subscription Tiers\nPholio offers free access and paid Studio+ subscription plans for Talent users. The features available at each tier are described on our Pricing page and may change from time to time. Studio+ is billed on a recurring basis (monthly or annually, as selected at checkout). Agency enterprise offerings are handled through contact-sales or contract arrangements, not self-serve in-app Stripe billing.`,
      `5b. Payment Processing\nAll payments are processed by Stripe, Inc., a PCI-DSS Level 1 certified payment processor. By providing payment details, you authorize Stripe to charge your designated payment method on a recurring basis in accordance with your chosen plan. You must provide valid, current payment information. We do not store full payment card numbers on our servers; all payment data is managed by Stripe under their terms (stripe.com/legal).`,
      `5c. Recurring Billing and Cancellation\nBefore purchase, checkout identifies the service, price, billing frequency, trial terms where applicable, renewal terms, and cancellation method. Your subscription automatically renews until canceled. You may cancel through the online billing or account-management method presented at purchase, or contact ${CONTACT_EMAIL} if that method is unavailable. Cancellation must be at least as easy as enrollment where required by law. Cancellation normally takes effect at the end of the current paid period unless law requires otherwise.`,
      `5d. Free Trials\nIf we offer a free trial, it begins on the date you enroll and ends on the date specified. If you do not cancel before the trial ends, you will be automatically charged the applicable subscription fee. One free trial per person.`,
      `5e. Renewal and Price Notices\nWe will provide renewal, cancellation, trial-ending, or material-change notices when and in the timing required by applicable law. A price change will not take effect before the date stated in the notice.`,
      `5f. Taxes\nPrices may exclude applicable sales, use, VAT, GST, or similar taxes. We may collect taxes where we determine they are due. You remain responsible for taxes lawfully imposed on your purchase that are not collected by us.`,
      `5g. Failed Payments\nIf a payment fails, we may retry the charge, suspend your account, or downgrade your access to a free tier until payment is successfully collected. Accounts with overdue balances for more than 30 days may be terminated.`,
      `5h. Refunds\nAll sales are final except where required by applicable law. If you believe a charge is erroneous, contact ${CONTACT_EMAIL} within 14 days of the charge. We will investigate and, if an error is confirmed, issue a refund or credit at our discretion.`,
      `5i. No Paid Selection Right\nA subscription is payment for software features, not payment to a Recipient and not a commission or success fee. It does not guarantee review, priority, representation, selection, booking, work, or income. If a paid plan affects a Platform display, quota, or routing feature, that effect must be described in the relevant product or checkout disclosure. Opportunity-specific rules may prohibit any paid advantage.`,
    ],
  },
  {
    title: "User Content and Intellectual Property",
    content: [
      `6a. Your Content\n"User Content" means any data, text, images, photos, videos, bios, measurements, or other material you upload, submit, or transmit through the Platform. You retain full ownership of your User Content.`,
      `6b. License Grant to Pholio\nBy uploading User Content, you grant Pholio a worldwide, non-exclusive, royalty-free license, sublicensable only as reasonably necessary to service providers and authorized Recipients, to host, store, reproduce, format, transmit, display, and otherwise process that content to provide the features you request, administer submissions, secure and moderate the Platform, and comply with law. AI processing is additionally governed by the Privacy Policy and AI Notice. This license does not independently authorize advertising, merchandising, model training, or creation or commercial use of a digital replica. The operational license ends when the content is deleted, subject to application records, Recipient copies, legal holds, backups, and provider deletion cycles described in the Privacy Policy.`,
      `6c. Recipient Viewing Rights\nWhen Talent sends a submission, the identified Recipient receives a limited right to access, reproduce, print, export, and internally share the submitted materials for the purpose described for that submission and related administration. A Recipient may retain an independent copy where lawful. A submission does not authorize public advertising or publicity use, merchandising, AI model training, or a digital replica. Those uses require a separate agreement or consent where applicable.`,
      `6d. Pholio's Intellectual Property\nThe Platform, including all software, algorithms, designs, graphics, logos, trade names, text, documentation, and all other materials (excluding User Content), is owned by Pholio or its licensors and is protected by copyright, trademark, patent, and other intellectual property laws. Nothing in these Terms transfers any ownership of Pholio's intellectual property to you. The Pholio name, logo, and product names are trademarks of ${COMPANY_NAME}. You may not use our trademarks without our prior written consent.`,
      `6e. Feedback\nIf you provide us with suggestions, ideas, or other feedback about the Platform ("Feedback"), you grant us an irrevocable, worldwide, royalty-free license to use, incorporate, and commercialize such Feedback without restriction or compensation to you. You acknowledge that we may already be working on similar improvements independently.`,
      `6f. Copyright Complaints\nWe respond to copyright complaints under the procedure at www.pholio.studio/dmca. That page identifies the information a notice and counter-notice should contain. Publication of a procedure does not itself represent that every condition for a statutory safe harbor has been satisfied.`,
    ],
  },
  {
    title: "Talent User Obligations",
    content: [
      `7a. Accuracy of Profile Data\nTalent users represent and warrant that all information submitted to their profile — including physical measurements, portfolio categories, location, and contact details — is accurate, truthful, and not misleading. Pholio is not responsible for inaccurate representations made by Talent users to Recipients.`,
      `7b. Image Ownership and Consent\nBy uploading photographs to your portfolio, you represent and warrant that: (i) you own or have all necessary rights, licenses, and consents to upload and display those images on the Platform; (ii) the images do not infringe any third party's intellectual property, privacy, publicity, or moral rights; and (iii) you have obtained written releases from any photographers, stylists, or other rights holders as required by applicable law.`,
      `7c. No Explicit or Harmful Content\nYou may not upload sexually explicit, pornographic, exploitative, nonconsensual intimate, abusive, trafficked, or unlawful content. Content depicting a minor must be nonsexual and professionally appropriate. Additional rules appear in the Community Guidelines.`,
      `7d. Direct Relationships and Work\nIf you proceed with a Recipient off-platform or enter a representation, employment, contractor, booking, event, or publicity agreement, that relationship is governed by the separate agreement and applicable law. Pholio is not a party unless expressly identified in a signed agreement. Verify compensation, expenses, usage, permits, insurance, safety, cancellation, and other material terms before participating.`,
      `7e. AI Features\nThe Platform may transmit profile text, AI-generated descriptions, and selected images to third-party AI providers and may store embeddings, scores, or derived attributes. The image-analysis setting and profile-search embedding are separate processing activities and one setting may not disable both. Current behavior, inputs, defaults, providers, limitations, and opt-out or deletion methods are described in the AI Notice.`,
      `7f. Opportunity and Publicity Terms\nBefore submitting to an event, open call, casting, brand, or other opportunity, review the identified Recipient, purpose, eligibility, compensation status, selection process, data use, and additional terms. A submission is not a consent to employment, travel, nudity, medical examination, commercial publicity, merchandising, or creation or use of a digital replica.`,
      `7g. Community Guidelines\nAll Talent users must comply with our Community Guidelines (www.pholio.studio/community-guidelines), which are incorporated into these Terms.`,
    ],
  },
  {
    title: "Organization and Recipient Obligations",
    content: [
      `8a. Authorized Use of Talent Data\nOrganization users and Recipients may access Talent data only for the purpose shown to Talent and legitimate related administration. They may not resell it, scrape or aggregate it beyond authorized use, use it for unrelated solicitation, disclose it to unauthorized persons, or use it for advertising, digital replicas, model training, or other secondary purposes without a separate lawful basis.`,
      `8b. Commission Records\nThe Platform may allow Agencies to record commission rates and earnings for talent they manage. These records are maintained for Agency internal reference only. Pholio does not enforce, validate, or participate in commission agreements between Agencies and Talent. You are responsible for ensuring your commission records comply with applicable labor, tax, and entertainment industry laws.`,
      `8c. Submission Handling\nA Recipient may collect applications only for a genuine stated purpose. It must identify its legal or business role accurately, limit access, apply its own lawful retention schedule, honor applicable privacy rights, and avoid misleading Talent about review, selection, compensation, or work.`,
      `8d. Licensing, Labor, and Safety\nEach organization represents that it will obtain licenses, registrations, permits, insurance, work authorizations, child-performer documentation, deal terms, harassment policies, safety procedures, and other approvals required for its activities. A Pholio account, approval, or listing is not government verification. A Recipient that controls an engagement remains responsible for its client or employer duties even when another party acts as an intermediary.`,
      `8e. Selection and Automated Tools\nOrganizations are responsible for ensuring that filters, rankings, scores, or automated tools they use comply with employment, civil-rights, accessibility, privacy, and automated-decision laws. They must provide required candidate notices, audits, alternatives, or accommodations and must not treat a Pholio score as an instruction or final decision.`,
      `8f. Minors\nOrganizations may not contact or engage a minor outside the authorized workflow without guardian involvement and may not treat a Pholio guardian record or work-permit indicator as proof that employment or participation is lawful.`,
      `8g. Community Guidelines\nOrganization users must comply with the Community Guidelines and must not engage in fake scouting, exploitation, coercion, trafficking, pay-to-secure schemes, or unsafe off-platform contact.`,
    ],
  },
  {
    title: "Prohibited Conduct",
    content: [
      `You agree not to engage in any of the following activities while using the Platform:`,
      `— Using the Platform for any unlawful purpose or in violation of any applicable local, state, national, or international law or regulation;`,
      `— Impersonating any person or entity, or falsely stating or misrepresenting your identity, affiliation, or credentials;`,
      `— Uploading, posting, or transmitting content that infringes any intellectual property right, violates any privacy right, or constitutes defamation, harassment, or hate speech;`,
      `— Uploading malware, viruses, trojans, spyware, or any other malicious code or files designed to disrupt, damage, or gain unauthorized access to any system;`,
      `— Using automated tools, bots, crawlers, or scrapers to access the Platform or extract data without our express written permission;`,
      `— Attempting to gain unauthorized access to any accounts, systems, or networks connected to the Platform through hacking, password mining, or any other means;`,
      `— Interfering with or disrupting the integrity or performance of the Platform or the data contained therein;`,
      `— Circumventing any technical measures we use to restrict access to certain areas of the Platform;`,
      `— Collecting or harvesting any personally identifiable information from the Platform without consent;`,
      `— Using the Platform to send spam, unsolicited commercial communications, or pyramid schemes;`,
      `— Engaging in any conduct that restricts or inhibits any other user from using or enjoying the Platform;`,
      `— Using the Platform to engage in or facilitate human trafficking, exploitation, or any form of abuse;`,
      `— Commercially reselling, leasing, or sublicensing access to the Platform without our prior written consent.`,
      `We reserve the right to investigate any suspected violation of the above and to take appropriate action, including account suspension or termination, content removal, and referral to law enforcement where warranted.`,
    ],
  },
  {
    title: "AI-Assisted Features",
    content: [
      `10a. Nature of AI Features\nThe Platform uses automated and AI-assisted systems for image analysis, profile embeddings, semantic search, compatibility or match information, quality or completeness assessments, and ranking or sorting. Depending on the feature version, inputs can include images, profile text, location, professional categories, age band, gender or division information, measurements, body type, appearance descriptors, and Recipient criteria. See the AI Notice (www.pholio.studio/ai-notice).`,
      `10b. No Guarantee of Accuracy\nAI systems can produce inaccurate, biased, or unexpected outputs. We make no representations or warranties regarding the accuracy, completeness, or suitability of any AI-generated content or recommendations. You should use your own judgment when acting on any AI output.`,
      `10c. Controls and Consent\nImage analysis and profile embeddings are separate processing activities. An image-analysis setting may be enabled for an eligible account and does not necessarily disable embeddings or previously generated outputs. Where law requires consent for a particular person, data category, or purpose, Pholio will request that consent or restrict the processing. You may disable an available setting or contact ${PRIVACY_EMAIL} to object, request human review, or request deletion of qualifying AI-derived data.`,
      `10d. Human Decisions and Regulated Uses\nAI outputs are advisory and do not themselves form a representation, employment, booking, or event contract. A Recipient remains responsible for its decision and for any bias audit, notice, accommodation, discrimination, or automated-decision obligation that applies. Opportunity-specific rules may prohibit or disable automated ranking.`,
      `10e. Sensitive Attributes and Bias\nAI and search systems may process or infer appearance and profile attributes that can correlate with protected characteristics. Those systems can reproduce bias. Users must not rely on an AI output as the sole basis for an opportunity decision or use it unlawfully.`,
    ],
  },
  {
    title: "Third-Party Services and Links",
    content: [
      `The Platform integrates with third-party services to provide core functionality. By using the Platform, you agree to be bound by the terms and privacy policies of these services where applicable:`,
      `— Firebase / Google LLC: Authentication and identity management. Your use of Google sign-in is subject to Google's Terms of Service and Privacy Policy.`,
      `— Stripe, Inc.: Payment processing. Your financial transactions are governed by Stripe's Terms of Service and Privacy Policy.`,
      `— Groq, Inc.: AI inference for photo analysis where the feature is enabled or otherwise lawfully used. Subject to applicable provider terms.`,
      `— OpenAI: Profile-text embeddings and related semantic-search processing. Subject to applicable provider terms.`,
      `— Cloudflare, Inc.: Media object storage and delivery through Cloudflare R2 and related infrastructure.`,
      `— Neon Technologies: PostgreSQL database hosting in production environments.`,
      `— Netlify, Inc.: Platform hosting and serverless function execution.`,
      `— ipapi.co or another configured IP-location provider: Approximate location derived from an IP address.`,
      `— A configured email-delivery provider: Transactional, account, application, safety, legal, and authorized marketing email.`,
      `The Platform may also contain links to third-party websites, resources, or services that we do not own or control. We are not responsible for the content, privacy practices, or terms of any third-party services. Accessing third-party links is at your own risk. We encourage you to review the terms and policies of any third party before using their services.`,
    ],
  },
  {
    title: "Disclaimers of Warranties",
    content: [
      `TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE PLATFORM AND ALL CONTENT, FEATURES, AND SERVICES PROVIDED THROUGH IT ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.`,
      `PHOLIO EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO: IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT; WARRANTIES ARISING FROM COURSE OF DEALING, USAGE, OR TRADE PRACTICE; AND ANY WARRANTY THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.`,
      `PHOLIO DOES NOT WARRANT THAT: (A) THE PLATFORM WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS; (B) ANY ERRORS OR DEFECTS WILL BE CORRECTED; (C) THE PLATFORM IS FREE FROM UNAUTHORIZED ACCESS OR MANIPULATION BY THIRD PARTIES; OR (D) ANY PARTICULAR RESULT OR OUTCOME WILL BE ACHIEVED FROM YOUR USE OF THE PLATFORM, INCLUDING BUT NOT LIMITED TO AGENCY REPRESENTATION, BOOKINGS, EMPLOYMENT, OR INCOME.`,
      `PHOLIO DOES NOT ENTER REPRESENTATION OR WORK AGREEMENTS FOR TALENT, NEGOTIATE COMPENSATION OR CONTRACT TERMS ON TALENT'S BEHALF, OR GUARANTEE REPRESENTATION, SELECTION, BOOKINGS, EMPLOYMENT, COMPENSATION, OR INCOME. AN ORGANIZATION'S PRESENCE OR PLATFORM APPROVAL IS NOT A GOVERNMENT LICENSE, BACKGROUND CHECK, OR GUARANTEE OF LEGITIMACY. YOU MUST EVALUATE A RECIPIENT AND THE TERMS AND SAFETY OF ANY OFF-PLATFORM RELATIONSHIP.`,
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      `TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL PHOLIO, ITS AFFILIATES, DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, LICENSORS, OR SERVICE PROVIDERS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF DATA, LOSS OF GOODWILL, LOSS OF BUSINESS OPPORTUNITIES, COST OF SUBSTITUTE GOODS OR SERVICES, OR ANY OTHER INTANGIBLE LOSSES, ARISING FROM OR RELATED TO YOUR ACCESS TO OR USE OF (OR INABILITY TO ACCESS OR USE) THE PLATFORM, EVEN IF PHOLIO HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.`,
      `NOTWITHSTANDING ANYTHING TO THE CONTRARY, PHOLIO'S TOTAL CUMULATIVE LIABILITY TO YOU ARISING FROM OR RELATED TO THESE TERMS OR YOUR USE OF THE PLATFORM, REGARDLESS OF THE FORM OF THE ACTION OR THE BASIS OF THE CLAIM, SHALL NOT EXCEED THE GREATER OF: (A) THE TOTAL AMOUNTS YOU PAID TO PHOLIO IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO LIABILITY; OR (B) ONE HUNDRED US DOLLARS ($100.00).`,
      `THE LIMITATIONS IN THIS SECTION SHALL APPLY REGARDLESS OF THE THEORY OF LIABILITY — WHETHER CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR OTHERWISE — AND REGARDLESS OF WHETHER PHOLIO HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.`,
      `SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU. IN SUCH JURISDICTIONS, OUR LIABILITY IS LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.`,
    ],
  },
  {
    title: "Indemnification",
    content: [
      `To the fullest extent permitted by applicable law, you agree to defend, indemnify, and hold harmless ${COMPANY_NAME}, its affiliates, subsidiaries, officers, directors, employees, agents, licensors, and service providers from and against any and all claims, demands, actions, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising from or relating to:`,
      `(a) your use of or inability to use the Platform;`,
      `(b) your User Content, including any claim that your content infringes the intellectual property, privacy, or other rights of any third party;`,
      `(c) your breach of these Terms, any representation or warranty made by you, or any applicable law or regulation;`,
      `(d) your interactions with other users of the Platform, including any dispute with an Agency or Talent;`,
      `(e) any misrepresentation you make regarding your identity, credentials, or authorization; or`,
      `(f) your willful misconduct or fraud.`,
      `We reserve the right, at your expense, to assume exclusive defense and control of any matter subject to indemnification. You agree to cooperate with our defense of such claims and not to settle any such claim without our prior written consent.`,
    ],
  },
  {
    title: "Term and Termination",
    content: [
      `15a. Term\nThese Terms are effective from the date you first access the Platform and continue until terminated by either you or Pholio.`,
      `15b. Termination by You\nYou may terminate these Terms at any time by deleting your account through the account settings page. Termination does not entitle you to a refund of any pre-paid subscription fees, except as required by applicable law.`,
      `15c. Termination by Pholio\nWe may suspend or terminate your account and access to the Platform immediately and without prior notice if we determine, in our sole discretion, that you have: (i) violated these Terms; (ii) provided false or fraudulent information; (iii) engaged in conduct harmful to other users, third parties, or our business interests; (iv) failed to pay amounts due after reasonable notice; or (v) violated applicable law.`,
      `15d. Effects of Termination\nUpon termination of your account: (i) your license to use the Platform immediately ceases; (ii) we may delete your account data in accordance with our Privacy Policy and data retention practices; (iii) provisions of these Terms that by their nature should survive termination will survive, including Sections 6 (Intellectual Property), 9 (Prohibited Conduct), 12 (Disclaimers), 13 (Limitation of Liability), 14 (Indemnification), 16 (Dispute Resolution), and 17 (Governing Law).`,
      `15e. Data Access After Termination\nExport data before requesting deletion or termination where possible. After termination, availability of an export depends on what data remains, identity verification, provider deletion status, and legal retention obligations. We do not promise that deleted content can be restored.`,
    ],
  },
  {
    title: "Dispute Resolution and Arbitration",
    content: [
      `PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT AND YOUR RIGHT TO A JURY TRIAL.`,
      `16a. Informal Resolution First\nBefore initiating any formal legal proceeding, you agree to contact us at ${CONTACT_EMAIL} with a written description of your dispute and the resolution you seek. We agree to use good-faith efforts to resolve the dispute informally within 30 days of receiving your notice. This informal resolution period is a prerequisite to arbitration or any other formal proceeding.`,
      `16b. Binding Arbitration\nIf informal resolution fails, you and Pholio agree that any dispute, claim, or controversy arising from or relating to these Terms or the Platform (including the validity, enforceability, or scope of this arbitration clause) will be resolved through final, binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules. The arbitration will be conducted in English in ${ARBITRATION_SEAT} unless you and Pholio agree otherwise. The arbitrator's award shall be final and binding and may be entered as a judgment in any court of competent jurisdiction.`,
      `16c. Class Action Waiver\nTO THE FULLEST EXTENT PERMITTED BY LAW, YOU AND PHOLIO AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, COLLECTIVE, REPRESENTATIVE, OR MULTI-PLAINTIFF ACTION OR PROCEEDING. No arbitrator shall have authority to consolidate claims or preside over any class or representative proceeding without the consent of both parties.`,
      `16d. Exceptions to Arbitration\nNotwithstanding the above, either party may seek injunctive or other equitable relief in a court of competent jurisdiction for matters involving: (i) actual or threatened infringement, misappropriation, or violation of intellectual property rights; or (ii) unauthorized access to the Platform or user accounts. Small claims court actions within applicable jurisdictional limits are also exempt.`,
      `16e. Opt-Out Right\nYou may opt out of the arbitration agreement within 30 days of first accepting these Terms by sending a written opt-out notice to ${CONTACT_EMAIL} with "Arbitration Opt-Out" in the subject line. If you opt out, disputes will be resolved in the courts specified in Section 17.`,
      `16f. EU/UK Users\nNothing in this Section limits your right as an EU or UK consumer to bring a claim before the courts of your country of residence or to use applicable out-of-court dispute resolution mechanisms provided by EU or UK law.`,
    ],
  },
  {
    title: "Governing Law and Jurisdiction",
    content: [
      `These Terms and any dispute arising from them are governed by and construed in accordance with the laws of the State of ${GOVERNING_LAW_STATE}, United States, without regard to its conflict of law principles.`,
      `For any dispute not subject to arbitration under Section 16, you consent to the exclusive personal jurisdiction and venue of the state and federal courts located in ${GOVERNING_LAW_STATE}, and you waive any objection to such jurisdiction or venue on grounds of inconvenient forum or otherwise.`,
      `If you are a consumer based in the EEA or UK, mandatory consumer protection laws in your country of residence may apply and take precedence over this governing law clause to the extent required by applicable law. You may also be entitled to bring proceedings in your local courts.`,
    ],
  },
  {
    title: "General Provisions",
    content: [
      `18a. Entire Agreement\nThese Terms, together with the Privacy Policy and any other legal notices or policies published by Pholio on the Platform, constitute the entire agreement between you and Pholio regarding your use of the Platform and supersede all prior agreements, understandings, and representations.`,
      `18b. Severability\nIf any provision of these Terms is held invalid, illegal, or unenforceable by a court of competent jurisdiction, that provision will be modified to the minimum extent necessary to make it enforceable, and the remaining provisions will continue in full force and effect.`,
      `18c. Waiver\nOur failure to enforce any right or provision of these Terms shall not constitute a waiver of that right or provision. No waiver of any term or condition shall be deemed a further or continuing waiver of that term or any other term.`,
      `18d. Assignment\nYou may not assign or transfer these Terms or any of your rights or obligations under them without our prior written consent. We may freely assign these Terms (including in connection with a merger, acquisition, or sale of assets) without notice to you. Any purported assignment in violation of this section is void.`,
      `18e. Force Majeure\nNeither party shall be liable for any failure or delay in performance resulting from events beyond its reasonable control, including natural disasters, acts of government, pandemic, strikes, utility failures, internet outages, or cyberattacks, provided the affected party gives prompt notice and uses reasonable efforts to resume performance.`,
      `18f. No Third-Party Beneficiaries\nThese Terms are solely for the benefit of you and Pholio. No third party shall have any right to enforce any provision of these Terms.`,
      `18g. Notices\nSend legal notices to ${CONTACT_EMAIL}. A notice is not effective merely because it was sent to a different support, social-media, or employee account. We may provide notice to you through the email associated with your account or through the Platform. A counsel-approved postal service address will be published when available.`,
      `18h. Export Controls\nYou represent that you are not located in, under the control of, or a national or resident of any country subject to US export restrictions, and that you will not export or re-export the Platform to any such country or person.`,
    ],
  },
];

export function TermsContent() {
  return (
    <LegalDocumentLayout
      title="Terms & Conditions"
      subtitle="These Terms and Conditions govern your access to and use of the Pholio platform. By using Pholio, you agree to be bound by these Terms. Please read them carefully before creating an account or using any part of the Platform."
      lastUpdated={LAST_UPDATED}
      effectiveDate={EFFECTIVE_DATE}
      sections={sections}
      contactEmail={CONTACT_EMAIL}
      footerTitle="Questions About These Terms?"
      footerBody="If you have questions about these Terms and Conditions, contact our legal team. We respond within the period required by applicable law and otherwise within a reasonable time."
      companyName={COMPANY_NAME}
      companyAddress={COMPANY_ADDRESS}
    />
  );
}
