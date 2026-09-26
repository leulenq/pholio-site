# Existing legal surface audit

Audit completed: September 15, 2026. Baseline inspected: September 14–15, 2026.

This is an inventory of the checked-out legal copy and its integration with the application. It preserves the existing design and does not rewrite a policy, change an acceptance record, verify production deployment, or decide a legal question. Statutory conclusions and the intended-product architecture belong in the separate research and rewrite work. No environment files, credentials, production records, or strategic implementation plans were read.

The site baseline was commit `fa791296db49ea3f844abfa2c63c7432e2ad1494`, with unrelated working-tree changes already present. Sources below describe the files inspected before the rewrite; they should not be mistaken for verification of a later revision.

## What is published in the current source

Eight routed documents use `components/legal/LegalDocumentLayout.tsx` and the common dates in `lib/legal-constants.ts`. Every document displays **July 18, 2026** as both last updated and effective date. The corpus version is **2026-07-18**. The entity constant is **Pholio Studio, Inc.**; the company address is deliberately empty. The named governing law and arbitration seat are both Delaware.

| Route and component | Current coverage | Principal limits or gaps |
| --- | --- | --- |
| `/terms` — `TermsContent.tsx` | Account assent; 13+ eligibility and guardian involvement; software-platform role; Talent Studio+; content license; Talent and Recipient obligations; AI; warranties and liability; termination; AAA consumer arbitration; Delaware law. | No complete agency workspace or agency publishing contract, no named Market model, no dedicated verification rules. Some statements contradict current controls or other documents. |
| `/privacy` — `PrivacyContent.tsx` | Account, professional, appearance, media, application, billing, AI, analytics, guardian, support and safety data; public portfolios; Recipient/controller distinction; providers; minors; retention; rights; US launch with qualified EEA/UK discussion. | Does not map agency-imported records, agency sites, their visitors or the intended full product by controller/processor role. AI and cookie details are stale. Broad operational caveats replace some definite handling rules. |
| `/cookies` — `CookiesContent.tsx` | Express/Firebase authentication, visitor and profile-session cookies, legacy localStorage preference, payment/infrastructure technologies, analytics events, choices and retention. | Omits the actual `pholio_consent` cookie from the inventory and understates present consent gating. Page's separate preference-control copy contradicts its policy body. |
| `/ai-notice` — `AiNoticeContent.tsx` | Groq image analysis; OpenAI embeddings; match/ranking signals; sensitive attributes; fallibility, human decisions, bias, minors, settings and deletion. | Describes possible default-enabled image analysis, embeddings without separate opt-in, facial/body analysis and historical-output persistence more broadly than the September app controls. |
| `/community-guidelines` — `CommunityGuidelinesContent.tsx` | Professional use, sexual/exploitative material, CSAM, NCII/deepfakes, harassment, impersonation, fraud, discrimination, rights violations; minors; opportunity integrity; reports, preservation, sanctions and appeals. | Broadly useful, but reporting/response/preservation commitments require staffed operations. Market and public agency-site conduct are only covered indirectly. |
| `/legal/submission-program` — `SubmissionProgramNoticeContent.tsx` | Representation and other opportunities; broad Recipient definition; package categories; AI; access/copies; no representation/work guarantee; fees; minors; work/publicity/digital replicas; retention and withdrawal. | Public notice uses the corpus version; the app has a distinct older, agency-only notice and version. No functional link to this route was found in the inspected application submission components. Data list can read as if internal audit/AI data is always part of the Recipient package. |
| `/dmca` — `DmcaContent.tsx` | Notice, counter-notice, removal, repeat infringers, photograph ownership, separate privacy/likeness/safety reports. | No confirmed designated-agent registration or service address. Public copy explicitly says registration is unconfirmed. Some statutory instructions are shorthand that need primary-law review. |
| `/take-it-down` — `TakeItDownContent.tsx` | Public email process for depicted person/representative; requested information; 48-hour removal for covered valid requests; identical copies; communication; child safety; records. | Request identifiers, response communication, access restriction and deadline operations are promised without being verified in this audit. Metadata omits the body’s valid/covered-request qualification. |

## Highest-priority contradictions

### S01 — The AI notice does not describe the current separate opt-ins

**Public statements.** AI Notice §3 says image analysis may initially be enabled, profile embeddings may be generated even with image analysis disabled, and disabling a setting does not itself remove historical outputs. Terms 10c contains the same possible-enabled formulation. Privacy §3g and the AI Notice describe face structure, body impressions, ethnicity/heritage and market-fit information as possible AI inputs or outputs.

**Inspected implementation.** `pholio-app/src/domains/talent/routes/settings.js` exposes separate image and embedding choices, separate disclosure hashes, eligibility checks and deletion states. Its disclosure version is `2026-09-02`. The embedding disclosure names bio, declared profile details and short photo descriptions, and expressly excludes face, age, heritage and body from those photo descriptions; it says stored descriptions and vectors are deleted on withdrawal. `src/domains/ai/analyzeProfileImage.js` and `src/domains/ai/embeddings.js` require explicit consent and known adult eligibility at their processing boundary, as well as feature flags where applicable. Unknown DOB and minors fail closed.

**Implication.** Do not preserve the old default-enabled or blanket historical-output language as if it were the intended feature contract. Distinguish optional image processing, optional embedding/search processing, non-AI rules and necessary moderation. Describe the scope of current permitted processing precisely. Whether any legacy outputs remain is an operational/data audit question, not something to guess from the new controls.

### S02 — The cookie policy inventories the old implementation

**Public statements.** Cookie Policy §3 describes `pholio_cookie_consent_v1` as the current preference, stored in localStorage. Privacy §9 uses the same name. Both say the preference may not gate server-side public-portfolio analytics. The body does not name `pholio_consent`.

**Inspected implementation.** `pholio-site/lib/cookie-consent.ts` and `pholio-app/src/shared/lib/consent.js` agree on `pholio_consent`, version 1, a necessary/analytics/timestamp payload and a one-year first-party cookie on `.pholio.studio` in production. Legacy localStorage is migration input. The app's `analyticsAllowed(req)` fails closed without affirmative analytics permission; `src/routes/portfolio.js` uses it before creating a visitor session. `/cookies#preferences` already describes the shared cookie and has a real reset control. The site footer also has a reset control.

**Implication.** Update the inventory and explain the actual choice, shared domain, duration, withdrawal and prior-record retention. Separately verify any analytics routes not covered by the inspected public-portfolio path. Do not infer that essential security logs are optional analytics or that every analytics system was verified here.

### S03 — Entity and launch geography require owner facts

`lib/legal-constants.ts` and Terms route metadata use **Pholio Studio, Inc.**, while `docs/app-integration.md` says the entity is **Pholio Studio**. No company address is supplied. The policies contain public statements that a counsel-approved address will be published later. Privacy §2 says initial production launch is directed to the US; §13 discusses prerequisites before intentional EEA/UK rollout. Terms contain EEA/UK consumer branches alongside Delaware law and arbitration.

**Implication.** Corporate identity, address, launch territory and applicable contract counterparties must be confirmed facts. Do not invent an entity, registered agent, address, representative or governing-law rationale. Technical worldwide availability and an EEA/UK savings clause do not resolve rollout facts.

### S04 — Quota economics are inconsistent across recorded sources

`docs/app-integration.md` states five monthly discovery submissions for free accounts, Studio+ removes that limit, and open-call submissions are capped at three monthly. The current `pholio-app/src/shared/lib/submission-program-content.js` instead states **five discovery submissions per calendar month UTC for every plan, no payment lifts the limit, and agency open-call links are unlimited**. The public program notice avoids numbers and allows plan differences in quotas, presentation or routing. Terms 5i likewise allows a disclosed paid effect on display/quota/routing while denying guaranteed review or results.

**Implication.** The integration document is not sufficient evidence for current quotas. Confirm the intended economic model against the enforcement source and publish a consistent rule in marketing, checkout, the in-app notice and incorporated terms. The current source is particularly sensitive to paid visibility or routing claims.

### S05 — Agency billing language exceeds the integration contract

Terms 5a says agency enterprise offerings use contact-sales or contract arrangements. `docs/app-integration.md` says agencies are not charged and revenue is a Talent Studio+ subscription. This audit did not find or validate an agency order form or enterprise contract.

**Implication.** Decide whether agency charges are an intended future possibility, an actual offering, or obsolete copy. Do not describe a contact-sales arrangement as an existing transaction path without evidence.

### S06 — Public assent language is internally inconsistent

Terms §1 distinguishes affirmative account assent from optional processing and calls Privacy a notice. The Terms subtitle says using any part of Pholio binds the reader; §15a makes the term run from first Platform access. §18a incorporates the Privacy Policy and any other published legal notices or policies into the entire agreement without identifying a closed, intelligible set. The Talent gate says, “I agree to the updated Terms of Service and Privacy Policy.”

**Implication.** State which document is a contract, which documents are incorporated standards, which notices are acknowledgments, and which actions require their own choice. Align the account controls with that distinction. Avoid using general visit/use language to paper over the actual assent process.

## Links, navigation and document identity

1. **All eight route files exist and export metadata.** Legal documents are deliberately absent from the main header index. The footer lists Terms, Privacy, Cookies and Copyright. AI, Guidelines, Submission Program and Take It Down are intended to be reached contextually.
2. **Three agency deep links are broken:** `/terms#agency-workspace-use`, `/terms#agency-fair-decision-making`, `/privacy#agency-data-processing`. The inspected `LegalDocumentLayout.tsx` supports only generated `section-N` IDs. It has no optional `id` property, despite `docs/app-integration.md` saying one exists. None of the three IDs appears in the inspected section definitions.
3. **References within legal paragraphs are plain text.** The layout renders `string[]` directly. It does not turn `www.pholio.studio/...`, email addresses or document names into anchors. Only the document footer's contact address and generated contents entries are links. This matters because the shortened footer relies on contextual links to the four omitted documents.
4. **The public submission notice is effectively unlinked from the inspected application flow.** `SubmissionThreshold.jsx` and `SubmissionTerms.jsx` link Terms and Privacy. The first-time threshold displays server-supplied program copy. No `/legal/submission-program` reference was found in the searched `src`, `client` and `tests` application source. The site's `LEGAL_NAV` declares the route but does not put it in the standing footer.
5. **AI email-link documentation is stale.** The integration doc says every transactional email footer links the AI notice. The inspected current `src/shared/lib/pholio-email/footer.js`, `text.js` and `components.js` include Terms and Privacy; the source search did not find an AI-notice link in the email templates. The Talent acceptance gate and shared `LegalNoticeLine.jsx` do link AI Notice.
6. **Cookie Manage differs from its own comments.** The app is documented to use `/cookies#preferences`, while the current site banner's Manage link is `/cookies`. The preferences section itself exists and works through the reset component; the site banner does not take a visitor directly to it.
7. **Terms naming varies.** The rendered document is “Terms & Conditions”; route metadata, acceptance controls and other notices mostly call it “Terms of Service.” Pick one identity while preserving `/terms`.
8. **Removal metadata is broader than the policy.** `/take-it-down` description promises removal “within 48 hours” without the valid/covered-request qualification in the body. `/legal/submission-program` metadata advertises “limits,” but the body does not state current numeric limits.
9. **No public version archive was located in the inspected legal route set.** Terms and Privacy offer prior versions on request. Retaining and retrieving the actual historical body remains an operational need; a version string or descriptor hash is not the document.

## Acceptance and version integration

| Surface | Evidence currently recorded | Revision behavior and gap |
| --- | --- | --- |
| Public corpus | Common `CURRENT_LEGAL_VERSION`, `LAST_UPDATED`, `EFFECTIVE_DATE` in `lib/legal-constants.ts`. | All eight share a date/version. Changing incorporated content requires coordinated application version and changelog changes under the repo contract. No body digest/immutable archive is generated by the inspected layout. |
| Talent account legal acceptance | `src/shared/lib/legal-acceptance.js` updates `users.terms_accepted_at`, `terms_accepted_version`, `privacy_accepted_at`, `privacy_accepted_version`. | It overwrites the prior values. The inspected helper does not append immutable acceptance events or preserve presented copy, IP, user agent or body hash. |
| Talent reacceptance gate | Gets version and changelog from `/settings/legal-status`; posts two true booleans to `/settings/legal-acceptance`. | It does not echo the displayed version or manifest. A server version change between display and post can record a revision the client did not present. It also labels Privacy as an agreement. The UI shows the dashboard if the status fetch fails; backend legal middleware separately guards normal protected actions, so this is not proof of unrestricted API access. |
| Agency individual member | Five checked policies, manifest version, per-policy version/URL/descriptor digest; immutable acceptance batch with member, membership, agency, time, IP and user agent. | Stronger evidence and stale-manifest rejection. The digest binds the policy descriptor, **not the remote body**. Terms/Privacy use `2026-07-18`; workspace use, decision policy and data processing remain `2026-07-12` and link to absent anchors. |
| Submission-program acknowledgment | `users.submission_program_acknowledged_at` and `_version`, current app version `2026-07-04`. | Separate app-authored content is agency-only. Its version differs from the public notice's July 18 version. POST sends only `acknowledged: true`, not the displayed version; values are overwritten. |
| AI choices | Separate purposes, disclosure version `2026-09-02`, disclosure hashes, consent events and deletion-state information are exposed by Settings. | This mechanism is separate from general legal acceptance, as it should be. Its current copy and the older public notice must be reconciled. This audit did not validate every historical grant or deletion job. |
| Studio+ checkout | Shared billing plan carries a distinct `billingDisclosureVersion` of `2026-06-25`; checkout disclosure links Terms and Privacy. | Subscription assent is a separate action. A general corpus bump should not be assumed to update checkout disclosure text, price notices or billing evidence. |

Relevant acceptance files:

- Site: `lib/legal-constants.ts`, `docs/app-integration.md`, `components/legal/LegalDocumentLayout.tsx`.
- App: `src/shared/lib/legal-versions.js`, `src/shared/lib/legal-acceptance.js`, `src/shared/middleware/require-legal-acceptance.js`, `src/domains/talent/routes/settings.js`, `client/src/shared/components/LegalAcceptanceGate.jsx`.
- Agency: `src/domains/agency/services/legal-acceptance.js`, `src/domains/agency/routes/legal.js`, `client/src/domains/agency/components/AgencyLegalAcceptanceGate.jsx`.
- Submission: `src/shared/lib/submission-program.js`, `src/shared/lib/submission-program-content.js`, `src/domains/talent/routes/applications.js`, `client/src/domains/talent/pages/ApplyPage/SubmissionThreshold.jsx`.

`pholio-app/tests/shared/legal-versions.test.js` checks consistency **within the app**, presence of a current changelog and agency descriptor inclusion of the version. Despite comments referring to parity, the inspected test does not import or compare the site's constant and does not detect public content edits without a bump. No tests were run in this read-only audit.

## Coverage missing for the intended full product

These are drafting and product-definition questions; they do not imply an invented feature is currently enabled.

| Intended surface | Existing coverage | Work needed in the rewrite or a separate agreement/notice |
| --- | --- | --- |
| Agency workspace and team | General organizational authority and Recipient duties; one organization account with authorized members. | Clear entity acceptance versus individual member responsibilities; admin powers, invitations, removal, access to former members' work, imported/managed Talent data, roster relationships, rights requests and export/termination handling. Do not present a DPA without defining the processing relationship and actual instructions. |
| Agency/public websites | Public Talent portfolios and generic Platform content license. | Agency-controlled publishing, website visitors and inquiries, domains, agency notices, authority to publish Talent/media, content responsibility, access/withdrawal limits and effects when the workspace ends. |
| Market and off-platform engagements | Broad Recipients; representation-versus-opportunity distinction; separate contracts and no guarantees. | Identify what Market does, who posts/decides, whether Pholio handles money or bookings, how inquiries and offers work, compensation/usage disclosures, and responsibility for off-platform agreements. A categorical disclaimer must remain consistent with actual conduct. |
| Media and likeness | Operational hosting/submission license; copyright and model-release distinction; separate publicity/digital-replica use. | Agency uploads for Talent, non-account people, multiple depicted individuals, publication permissions, voice/video, public promotional uses and the specific optional releases presented at the time of use. |
| Messaging and communications | Listed as a service/data category; harassment/minor restrictions; general retention exceptions. | Participants and authorized agency access, message delivery providers, optional versus necessary communications, reporting/review, threads after withdrawal or account deletion, and the limits of off-platform communications. |
| Studio+ | Core recurring subscription terms, checkout disclosure concept and no paid selection guarantee. | Standalone intelligible trial, renewal, cancellation, refunds, entitlement changes, taxes and access-after-cancellation rules; harmonized quotas and any paid visibility effects. Do not invent numeric commercial terms or mandatory notice operations. |
| Minors and guardians | Repeated 13+ account permission; guardian involvement; separate engagement permits/releases; nonverification caveats. | A single phased eligibility policy consistent with actual rollout. If minors are conditional/future, do not invite immediate minor registration. Specify contextual guardian authorization separately from age/identity verification and from later work/publicity. |
| Verification | Accounts, self-reported DOB, guardian email and permits are repeatedly said not to constitute government verification. | Describe any actual verification process, provider, data, result, expiry/recheck, badge meaning, challenge path and limitations. No provider or verification guarantee is established by the current corpus. |
| Analytics | Detailed public-portfolio events; non-anonymous collection; Talent access; cookie controls. | Distinguish logged-in product analytics, Talent portfolio audiences, agency website analytics, security logs and any shared reporting. Identify the relevant role, consent setting, recipients and retention for each. |
| Data roles | Pholio described as controller for almost everything unless an opportunity notice differs; Recipients may be independent controllers. | A role map for account/business data, agency-controlled workspace data, public sites, submissions, security/moderation and optional AI. A notice cannot casually change the role through a generic “unless otherwise stated” clause. |

## Operational commitments that the public copy makes

Publication should follow confirmation of the applicable process and owner. The proper response to an unbuilt process is to record the operational gap and decide the launch condition, not to pretend a policy alone implements it.

| Commitment in current text | Source | Evidence still needed outside this audit |
| --- | --- | --- |
| Prior legal versions can be supplied on request. | Terms §2; Privacy §14. | Historical body archive, version mapping and request process. |
| Mandatory trial, renewal, cancellation and price notices will be delivered in the required timing. | Terms §5. | Checkout facts, notice schedules, delivery records and failed-delivery handling. |
| Account deletion removes or de-identifies records subject to exceptions; provider-purge failures are recorded and retried. | Privacy §10. | Complete deletion graph, retry operations, backup/object/CDN handling and case closure evidence. |
| Draft expiry is generally 90 days plus approximately seven-day recovery; submissions generally redact/delete after approximately 24 months. | Privacy §10; Submission Notice §11. | Current jobs, execution history, scoped exceptions and historical-record treatment. |
| Rights requests and incident notifications receive legally required responses. | Privacy §§11–12. | Intake ownership, verification, timing, appeals/escalation and jurisdiction routing. |
| Reports may cause warnings, removals, session revocation, suspension, evidence preservation or notifications to guardians, NCMEC and authorities. | Guidelines §§6–7. | Staff tooling, access controls, escalation, report preservation and trained operators. |
| Valid covered intimate-image removal requests receive removal and reasonable efforts concerning identical copies within 48 hours, a request ID, and completion/more-information/reason communication. | Take It Down §§3–4; Guidelines §6; DMCA §8. | Continuously monitored intake, validation, copy-location/removal process, deadlines and communications. |
| Copyright notices are reviewed expeditiously; uploader notifications, counter-notice handling and repeat-infringer records are maintained. | DMCA §§4–6. | Registered agent/address facts, case workflow, repeat-infringer policy implementation, forwarding/restoration timing. |
| Qualifying AI outputs can receive human review and deletion/re-indexing explanations. | AI Notice §§5, 8–9. | Review owner, available source material, provider controls, scope and response evidence. |
| Safety-related organization blocking can receive additional documented restrictions. | Privacy §5. | Available enforcement controls, escalation and logging. |

## Clauses to review for coherence and legal calibration

These observations identify drafting issues; they are not conclusions about enforceability.

- **Content ownership:** Terms 6a says users retain “full ownership” of everything uploaded. Elsewhere the corpus correctly recognizes a depicted model may have only a photographer's license. Preserve users' rights without asserting ownership they may not possess.
- **Recipient versus Pholio data:** Submission Notice §3 lists audit IP/user agent, guardian records and derived data among information a submission can include. Explain which information the Recipient actually receives and which is retained by Pholio to operate or evidence the transmission.
- **Imported data and publicity:** A Talent-directed submission license does not resolve an agency's authority to upload a non-user's roster, publish their profile or repurpose their media. Separate those situations.
- **Withdrawal language:** The public notice says withdrawal may leave messages/audit records; the current in-app program text says withdrawal deletes the Platform message thread. Distinguish operational thread visibility, deletion, safety preservation and independent Recipient copies.
- **Disputes:** The current consumer arbitration, Delaware venue, class waiver, 30-day opt-out and universal 30-day informal prerequisite need jurisdictional and business/consumer review. A missing service address must not be filled with a guess.
- **Liability/indemnity:** The broad indemnity includes inability to use the service and ordinary interactions. Liability caps and carve-outs need to fit consumer, agency and minor use rather than relying only on “to the fullest extent permitted.”
- **Billing remedies:** Terms combine “all sales final,” a 14-day erroneous-charge contact window, discretionary correction, trial autocharge, account suspension for failed payment and no prepayment refund on termination. Align these with checkout behavior and non-waivable rights.
- **Provider terms:** Terms §11 says using Pholio binds the user to provider terms and privacy policies “where applicable,” including backend providers with which the user may have no direct contract. Clarify independent third-party transactions versus Pholio's own processors.
- **Safety policy wording:** Copyright counter-notice jurisdiction/service-of-process instructions are only a statutory reference, and the restoration clock is described from forwarding. The current Take It Down request criteria and identical-copy language also need primary-source review. Do not assume the existing wording is legally complete.
- **Public operational caveats:** Statements such as “no representative is currently identified,” “until registration is confirmed,” and “the preference may not gate every event” document an old audit state. The final notices should explain the service and people's rights clearly; unfulfilled launch obligations belong in an explicit internal launch record.

## Work performed and remaining

Completed: read all eight existing legal documents, shared legal chrome, constants/navigation, cookie controls, integration contract, and targeted application acceptance/version/AI-consent sources. Recorded contradictions and intended-product gaps. Only this audit artifact was written.

Not performed: no legal copy changes, app changes, production inspection, mailbox verification, registry/entity checks, statutory research, provider-contract review, database or environmental inspection, browser testing, builds, lint or automated tests. The report is preparation for the coordinated rewrite and its operational review, not a launch approval.
