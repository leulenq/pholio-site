# Pholio legal architecture: regulatory research

Research completed: **September 15, 2026**. Sources checked September 14–15, 2026. This is an internal launch assessment, not a public agreement or a representation that Pholio has completed the controls described below.

## 1. Scope, evidence, and conclusions

The appropriate framework is a hosted portfolio, application, agency-workspace, and subscription service with distinct data-sharing and safety obligations. A Terms / Privacy / Cookies trio is insufficient. Pholio needs enforceable recipient-use restrictions, a submission notice, an AI notice, separate safety and copyright reporting procedures, and an agency data-processing agreement. Identity/selfie verification creates a separate possible biometric-notice requirement. Guardian authorization, transaction consent, publication controls, and privacy rights require actual product mechanisms.

This research began with primary regulatory and legislative sources. Product context was then checked against `pholio-app/AGENTS.md`, `docs/pholio-product-plan-2026-08.md`, `docs/pholio-strategic-analysis-2026-08.md`, and the lead auditor's findings from the September semantic-discovery plan. The old `.pholio-landing-ref` checkout was not used. The separate implementation audit is the authority for what the current code actually does; this report does not certify deployed environment flags, vendor contracts, company formation, registrations, or staffed operations.

The product plans support these geographic conclusions:

| Geography | Why it matters | Treatment |
| --- | --- | --- |
| United States, especially New York | The documented launch strategy is New York first, including Brooklyn event-casting intake. | Primary launch framework. Federal law and applicable New York law are not optional contractual choices. |
| California | A major modeling market; the plans explicitly identify fee-related talent-service risk and call for excluding California from paid launch pending counsel. | Analyze even if paid enrollment is blocked. A paid geofence does not exclude California public visitors, free users, talent submissions, or agencies. |
| Other US states | Public sites, interstate applications, and unrestricted signup can reach their residents. | Record actual residence, commercial presence, processing volumes, and exemptions. Privacy, biometric, subscription, and child-protection rules have different triggers. Do not infer that Delaware incorporation limits applicable law. |
| EU / EEA and UK | Plans mention Paris/Milan packs, European agencies, and London/Italy event editions. These establish a credible expansion path, not proof of an approved EU/UK launch. | Conditional expansion assessment. Determine whether Pholio targets residents, contracts with local agencies, or monitors behavior there. A US user exporting to a Paris agency is a different fact pattern from actively serving French users. |
| Other countries | No sufficiently specific approved launch evidence in the reviewed material. | Do not claim worldwide legal readiness. Canada, Australia, Japan, and other destinations need a launch-specific review before active expansion. |

**Applicability vocabulary:** “launch requirement” means strongly supported by the described US product; “conditional” means a jurisdiction, threshold, data category, feature, or legal classification must be established; “operational” means wording alone cannot satisfy the requirement. A statutory risk is not a legal conclusion that Pholio is already a regulated talent agency, data broker, employer, or biometric provider.

## 2. Recommended public legal architecture

These are functional documents; their names and page count are not themselves legally prescribed except where a law requires a particular notice or separate policy.

| Public document / notice | Why Pholio needs it | Important boundaries |
| --- | --- | --- |
| Terms of Service | Account eligibility, service scope, public sites, media license, acceptable use, Studio+, termination, recipient relationships, dispute provisions. | Privacy acknowledgment is not consent. Uploading a photograph does not transfer copyright or authorize every use of a likeness. |
| Privacy Policy | Data categories, sources, purposes, visibility, recipients, vendors, retention, rights, minors, AI/identity/social integrations, and contact. | Explain controller and processor roles by activity. Do not describe every vendor as a processor or every disclosure as consensual merely because Terms were accepted. |
| Cookies and similar technologies notice + actual preferences | Public-site/app/portfolio tracking, cookies, browser storage, pixels, and server-side analytics distinctions. | Necessary security records differ from optional visitor analytics. A preferences link must reach a working control. |
| Submission / application notice | Named recipient, representation versus event/job purpose, precise package, permitted review use, withdrawal limits, retention, and off-Pholio handoff. | A draft/export is not delivery; delivery is not review; review is not selection or representation. |
| Agency / recipient terms | Authorized staff, lawful purpose, independent decisions, access limits, confidentiality, export restrictions, applicant notices, minors, fair treatment, and incident cooperation. | Pholio is not the contracting talent representative merely because it hosts an agency workspace. Restrictions must also cover clients, event organizers, and other recipients. |
| Agency Data Processing Addendum (DPA) | A binding allocation for agency-controlled applicant/roster/workspace processing and applicable service-provider/processor terms. | A public DPA can be incorporated into the actual agency agreement; posting an unsigned template does not execute it. Add real processing and security schedules. |
| AI and automated processing notice | Separate technical image analysis, text/caption embeddings, semantic result ordering, generated writing, identity verification, and any optional connected-account analysis. | Do not claim “no ranking,” “no biometric processing,” or “AI never affects discovery” when the intended product says otherwise. Narrow prohibited uses and approval gates matter. |
| Content and safety reporting notice | NCII/deepfakes, child sexual exploitation, impersonation, harassment, threats, and other unlawful content. | TAKE IT DOWN reporting must be easy, conspicuous, and separate from copyright ownership requirements. |
| Copyright / DMCA notice | Proper notices, counter-notices, designated agent, repeat-infringer policy, and legally appropriate restoration handling. | Copyright procedures cannot substitute for safety removal. A `dmca@` address is not Copyright Office registration. |
| Guardian / minors framework | Preserve the intended future guardian-managed product, responsibilities, disclosures, and withdrawal rights. | Must accurately state the current 18+ launch gate and that under-18 participation requires an expressly enabled compliant workflow. No implied entitlement to bypass the gate. |
| Identity and biometric information notice | Recommended separate conditional document for ID/selfie verification; required public retention policy if Illinois BIPA applies. | Identify the actual verifier, data, purposes, recipients, retention and deletion. A generic notice cannot authorize a not-yet-selected vendor. |
| Consumer health data policy | Conditional, if actual Pholio processing triggers Washington or similar health-data laws. | Do not add health processing merely to justify a policy. Washington requires a distinct homepage link and a policy limited to required health-data content. |
| Subprocessor / service-provider register | Useful contractual transparency for the DPA, vendor change management, and jurisdiction-specific disclosure. | List actual production vendors, exact function, entity, data, region, and contract role. A code dependency or dormant integration alone is not proof of live processing. |

Primary role-allocation authorities: the [EDPB's controller/processor explanation](https://www.edpb.europa.eu/sme/learn-the-basics/data-controller-or-data-processor_en), [ICO Article 28 contract requirements](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/contracts-and-liabilities-between-controllers-and-processors-multi/what-needs-to-be-included-in-the-contract/), and [Delaware's controller/processor provisions](https://delcode.delaware.gov/title6/c012d/index.html). The product-specific separation above is this audit's recommendation, not a claim that every listed standalone page is universally mandated.

## 3. Talent services, representation, and event casting

### California: software terminology is not an exemption

California regulates procuring or attempting to procure employment or engagements for artists, expressly including models. The actual conduct and advertised offer matter; a disclaimer alone does not determine classification. See the [Labor Commissioner's talent-agency definitions and licensing guidance](https://www.dir.ca.gov/dlse/Talent_Agency_License.html).

The [Labor Commissioner's fee-related talent-service guidance](https://www.dir.ca.gov/DLSE/2009Legislation-afrts.html) identifies paid agency lists, self-directed database searches, and storage/distribution of an artist's photographs, websites, portfolios, or promotional materials as potential talent-listing services. It also explains the separate prohibition on advance-fee representation services: procurement/management representations combined with fees for specified promotional materials or services can be sufficient. Thus removing paid submission quotas reduces risk but does not establish an exemption for paid websites within a product marketed as securing representation.

If the listing-service regime applies, the prescribed written contract, cancellation/refund provisions, and bond/deposit are substantive requirements. The enacted [AB 1319 text, including Labor Code §§ 1701–1705](https://leginfo.ca.gov/pub/09-10/bill/asm/ab_1301-1350/ab_1319_bill_20091011_chaptered.pdf) specifies a 10-business-day cancellation right and a $50,000 bond/deposit framework. The current regulator still links this enactment. Direct current LegInfo section retrieval failed during this research; counsel should confirm the consolidated sections and any intervening amendments before relying on prescribed contract language.

**Pholio decision:** keep every application/review/discovery entitlement independent of Studio+ payment; do not advertise guaranteed representation, auditions, jobs, preferential visibility, or career advancement. Obtain a California classification opinion covering the *combined* free/paid offering, referral behavior, exports, public portfolio links, agency discovery, and marketing. If the business falls within a prohibited service, adding a bond and disclaimer does not cure the prohibition. The plan's California paid-launch restriction is a risk control, not an adjudication of legality.

### New York: Fashion Workers Act and employment-agency rules

[Labor Law § 1031](https://www.nysenate.gov/legislation/laws/LAB/1031) defines a model management company through alternatives including managing models, procuring engagements for a fee, or giving vocational guidance/counseling to models for a fee. A company does not need to satisfy every alternative. “Client” is separately defined around contracting for and managing modeling services, including through intermediaries; “model” includes independent contractors. Event casting therefore requires its own classification, not an assumption that representation-only language covers it.

The [New York Department of Labor's Fashion Workers Act page](https://dol.ny.gov/fashion-workers-act) states that substantive duties applied from June 19, 2025 and registration duties from December 21, 2025. Its [FAQ](https://dol.ny.gov/fashion-workers-act-faqs) explains that out-of-state companies can be covered when providing relevant services in New York. **Correction to the strategic analysis:** the $50,000 registration bond is required for companies/groups with more than five employees who work in or represent models in New York; it is not a blanket requirement for every registrant.

The [Department's responsibilities guidance](https://dol.ny.gov/responsibilities-fashion-management-and-clients) addresses model-management fiduciary and contract duties, timely information/payment obligations, anti-abuse protections, deal memos, registration disclosures, and separate digital-replica authorization. Client obligations include workplace protections and written replica approval specifying scope, purpose, compensation, and duration. A Pholio consent record can help document the parties' transaction; it does not make an inadequate release valid or fulfill an organizer's workplace duties.

**Pholio decision:** require agencies and event clients to identify their capacity and lawful authority; represent registry checks accurately by registry, number, and check date rather than guaranteeing an agency is safe or compliant. Confirm whether any Pholio activity is model management, paid counseling, or employment-agency activity. Keep user-directed application preparation distinct from Pholio soliciting/negotiating engagements. Free access alone does not exempt actual management under every statutory prong.

## 4. Privacy architecture for the US launch

### The baseline is broader than threshold-based privacy statutes

Privacy and security representations must match practice. [California Attorney General guidance on CalOPPA](https://oag.ca.gov/sites/all/files/agweb/pdfs/cybersecurity/making_your_privacy_practices_public.pdf) explains the commercial-site notice requirement, data categories/recipients, policy changes, effective-date disclosure, and Do Not Track transparency. CalOPPA should not be confused with the much higher applicability thresholds in the CCPA.

New York's [SHIELD Act guidance](https://ag.ny.gov/resources/organizations/data-breach-reporting/shield-act) describes reasonable administrative, technical, and physical safeguards, service-provider controls, and breach response for covered private information, including credentials and biometric information. This is a security-program obligation, not a reason to write “industry-leading security.” Credential/session compromise, exposed storage objects, export links, and staff access are part of the operational assessment. The guidance is not a substitute for checking the current breach statute and its deadlines when an actual incident occurs.

### Threshold and category assessment

| Regime | Applicability / current position | Pholio consequence |
| --- | --- | --- |
| California CCPA/CPRA | Conditional on the statutory business tests, including revenue, buying/selling/sharing volumes, and sale/share revenue. The current inflation-adjusted revenue figure is **$26,625,000**, not the historic $25 million. [CalPrivacy thresholds](https://privacy.ca.gov/laws-and-regulations/monetary-thresholds-in-the-ccpa/), [current law and regulations](https://privacy.ca.gov/laws-and-regulations/). | Measure applicability rather than promise statutory status. If covered, provide collection notices, retention disclosures, rights mechanisms, required opt-outs, qualifying preference-signal handling, and proper vendor contracts. Professional/agency context is not a universal CCPA exclusion. |
| Delaware Personal Data Privacy Act | Conditional: conduct/targeting and relevant processing threshold; professional/employment-context exclusions can matter. Incorporation is not the sole test. [6 Del. C. ch. 12D](https://delcode.delaware.gov/title6/c012d/index.html). | Maintain a jurisdiction/volume register. Broad acceptance of Terms is expressly not consent to sensitive processing. Rights appeals and processor agreements are operational requirements where applicable. |
| Texas Data Privacy and Security Act | Uses its own business scope, with a general SBA-small-business exemption but a sensitive-data-sale consent rule even for small businesses. [Texas AG](https://www.texasattorneygeneral.gov/es/node/259071). | Do not use the CCPA revenue threshold as a nationwide exemption. Verify size classification, actual sale practice, and sensitive-data treatment. |
| Rhode Island privacy law | Operative January 1, 2026. Its website/information-sharing section has specific wording addressing collection, storage, and sale, distinct from broader threshold tests. [R.I. § 6-48.1-3](https://webserver.rilegislature.gov/Statutes/TITLE6/6-48.1/6-48.1-3.htm). | Do not copy summaries saying all small websites have identical obligations or that all are exempt. Check the actual trigger against Pholio's sharing and commercial context. |
| State biometric statutes | Independent of the general privacy-law revenue thresholds. Illinois facial geometry is especially relevant to ID/selfie matching. [BIPA § 15](https://www.ilga.gov/ftp/ILCS/Ch%200740/Act%200014/074000140K15.html). | Prior informed written release and public retention/destruction policy if applicable; protect evidence and vendor flows. Deletion immediately after collection does not eliminate prior-consent duties. |
| Washington My Health My Data | Conditional on consumer-health-data processing and jurisdiction. Smaller businesses are not categorically exempt. [Washington AG FAQ](https://www.atg.wa.gov/protecting-washingtonians-personal-health-data-and-privacy), [RCW ch. 19.373](https://app.leg.wa.gov/RCW/default.aspx?cite=19.373). | Measurements alone do not automatically mean a health service. Health conditions, pregnancy/disability data, or inferences identifying health status need a separate assessment. If triggered, use the separate health policy and required consent/deletion contracts. |

This table is not a claim that only these states have privacy laws. The launch register must also assess applicable laws in states actually served, including Colorado, Connecticut, Virginia, Oregon, Montana, Minnesota, New Jersey, Nebraska, New Hampshire, Maryland, Indiana, Kentucky, Tennessee, Utah, and Iowa. Their thresholds, exemptions, sensitive-data rules, youth protections, profiling rights, and response periods cannot safely be collapsed into “CCPA applies everywhere.” This research does not supply unverified threshold arithmetic for every state.

### Data map that the Privacy Policy must express

The public policy needs a readable but complete distinction among:

1. Account/authentication and contact information; age and eligibility records; agency membership and permissions; support and legal acceptance records.
2. Talent-provided biographies, professional details, measurements, location, social links, photographs, videos or other enabled uploads, rights metadata, and historical versions.
3. Private profile/workspace data; deliberately public pages; agency discovery visibility; named-recipient submission snapshots; share links; downloadable artifacts; agency notes and exports.
4. Messages and delivery/reply metadata, calendar/interview/event information, agency decisions, saved applicants and retention choices.
5. Visits, referrers, tracked links, downloads, image events, security logs, IP-derived location, and cookies/browser storage, with actual collection/consent boundaries.
6. Subscription and transaction records, billing status, receipts and fraud signals, distinguishing Stripe-held payment credentials from data Pholio receives.
7. Optional AI inputs/outputs, generated captions, embeddings, semantic ordering, eligibility verification, connected social/creator account metrics, and the resulting inferences or audit records.

Do not say all data is public; do not say deleting a profile recalls emails or agency downloads; do not call pseudonymous IDs, hashes, or embeddings anonymous merely because names are absent. Keep publication, discovery participation, submission, connected-account authorization, and marketing use of a model's image separate.

**Retention requires evidence.** A policy can explain categories, purposes, and a defensible schedule; it cannot turn a stale constant into an implemented erasure job. For each category establish its trigger, normal duration, statutory/legal-hold exception, backups, vendor deletion, and agency-controlled copies. Blanket “retain as long as necessary” is not a complete internal schedule, and blanket “delete everything immediately” will be false where financial, security, or litigation records must remain.

## 5. Minors, guardians, and verification

### Launch gate versus intended future participation

The August strategy expressly keeps launch 18+ and treats minors as a future product. The legal framework should preserve that intended future capability with a clear conditional statement. A minors policy must not contradict a current adult-only signup rule. Conversely, removing all guardian obligations because the feature is presently gated would fail to prepare the intended product.

A guardian's permission to create an account, authority to enter a commercial contract, consent to a particular disclosure, permission to use a likeness, and employment permits are separate questions. A checkbox “I am the guardian” does not establish identity, parental responsibility, the child's identity, or authority for a specific engagement. Agencies uploading minors' data also require a lawful intake path; a talent signup gate does not govern every import route.

### COPPA

The revised COPPA Rule's principal compliance deadline was April 22, 2026. For under-13 collection where COPPA applies, its requirements include compliant notice, verifiable parental consent, parental access/deletion, minimization, security, and retention controls. The revised definition expressly includes relevant biometric and government identifiers. [FTC final-rule announcement](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data), [current FTC rule resource](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa), [FTC compliance plan](https://www.ftc.gov/business-guidance/resources/childrens-online-privacy-protection-rule-six-step-compliance-plan-your-business).

A general-audience age limit does not erase actual knowledge of an under-13 user. Do not say “COPPA does not apply because we say 13+.” Reject prohibited collection early; establish a path for accidental/third-party child-data discovery, restricted handling, deletion, and legally necessary safety retention.

The FTC's [February 25, 2026 age-verification enforcement policy](https://www.ftc.gov/news-events/news/press-releases/2026/02/ftc-issues-coppa-policy-statement-incentivize-use-age-verification-technologies-protect-children) is limited: it concerns certain collection solely to determine age, with prompt deletion, notice, security, vendor assurances, and accuracy conditions. It is not a statutory repeal, a blanket permission for child accounts, or an exemption from state biometric/privacy law.

### New York teenagers have their own consent rights

The New York Child Data Protection Act has been effective since June 20, 2025. The [Attorney General's implementation guidance](https://ag.ny.gov/child-data-protection-act-guidance) explains that knowledge of age follows a recognized account across devices/services and that a parent's request does not generally authorize nonessential processing of a 13–17-year-old's data. Account support may be necessary; marketing, advertising, research/development, and unrelated tracking do not become necessary simply because Pholio lists them in a policy.

[GBL § 899-ff](https://www.nysenate.gov/legislation/laws/GBS/899-FF) requires qualifying nonessential consent separately from other transactions, prominently presents refusal, permits easy revocation, restricts repeated prompts after refusal, prohibits certain sale/purchase, and requires action within 30 days after learning a user is covered unless processing has a lawful basis under the statute. Guardian account assent therefore cannot substitute for the teenager's required informed choice.

The separate SAFE for Kids Act is not the same law. The [New York AG's final-rule announcement of July 28, 2026](https://ag.ny.gov/press-release/2026/attorney-general-james-and-governor-hochul-release-final-safe-kids-act-rules) gives January 25, 2027 as its operative date and describes covered addictive online platforms. Pholio needs a functionality assessment if it introduces covered personalized feeds/notifications; ordinary professional search is not automatically an addictive feed.

### Child-performer law

California requires a child-performer-services permit for applicable fee-based services to minors, including specified career and publicity/website services; exemptions are specific. The [Labor Commissioner's permit guidance](https://www.dir.ca.gov/dlse/Child_performer_services_permit.htm) and [FAQ](https://www.dir.ca.gov/dlse/Child_performer_services_permit_FAQs.htm) also record AB 653's January 1, 2026 expansion of mandated reporting to relevant talent agents, managers, and coaches. This is separate from a child's work permit, trust account, guardian contract, and employer obligations.

**Before enabling minors:** a jurisdiction/age eligibility matrix, actual guardian verification, an authorization ledger with revocation, purpose-specific recipient notices, private defaults, staff permissions, restricted messaging, escalation/reporting, appropriate permit handling, and the adult-transition flow all need testing. Do not promise public invisibility if media URLs or exports defeat that claim.

## 6. AI, semantic discovery, identity, and connected accounts

### Describe each activity honestly

The latest September discovery plan takes precedence over the August blanket removal of ranking: text/neutral photo captions may be embedded and semantically ordered, with possible reranking. This is legally relevant even if all final agency decisions are human. Treat generated image captions as derived personal information where linked to identifiable talent; evaluate protected-trait leakage and proxies through both prompts and actual outputs.

The following require separate inventories and activation decisions:

- Technical image quality/classification and text extraction from comp cards.
- Profile/caption embeddings and semantic result ordering/reranking.
- Generated bios or other drafting assistance.
- Government-ID/selfie verification for a verified-adult/private creator feature.
- Phyllo or other connected social/creator account permissions, metrics, refreshes, revocation, and disclosure to recipients.

A data license for serving a portfolio is not an unrestricted model-training license. Vendor “no training” and retention claims must be verified against the contracted product and account settings, not generalized from a vendor homepage. Provider changes may require new disclosures/consents and DPA updates.

### Biometrics: matching a selfie is a different use from describing a photograph

Illinois [BIPA § 15](https://www.ilga.gov/ftp/ILCS/Ch%200740/Act%200014/074000140K15.html) requires a public retention/destruction schedule where the entity possesses covered biometrics, prior written notice of collection, purpose and duration, a written release, disclosure limits, and reasonable protection. The latest [consolidated BIPA text](https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=3004+) also reflects the 2024 multiple-collection recovery changes. Photographs and facial-geometry measurements are legally distinct; do not infer that every image is biometric, or that a face scan is harmless because its source was a photo.

**Pholio implication:** verify whether the age provider creates face geometry, face templates, liveness/identity signals, or other biometric information, and whether Pholio receives only an attestation or has access to raw evidence. If covered data is collected, transient processing still requires the appropriate pre-collection consent. Publish a specific retention policy and obtain separate consent before enabling that path. A provider's consent may need to name Pholio and the provider distinctly. Avoid “we never process biometrics” unless true for the entire service, including vendors acting on its behalf.

Texas and other biometric laws must also be checked against the selected provider. The Texas statutes site returned its navigation shell, rather than usable consolidated Chapter 503 text, during this research; no Texas-specific exemption or retention deadline is asserted here. This is an explicit source limitation, not a determination that Texas law is inapplicable.

### Selection and ranking regulation

The [NYC DCWP AEDT resource](https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page) requires annual independent bias audits, public information, and notices for covered automated employment decision tools used by employers/employment agencies. Its notice timing is at least 10 business days before use. Whether agency discovery, a particular hiring/casting workflow, or a specific semantic-ranking configuration qualifies needs a fact-specific assessment; “a human clicks accept” is not a categorical exemption.

**Colorado current-law correction, verified against enacted text:** [SB 26-189, chapter 131](https://leg.colorado.gov/laws/session-laws/SB26-189/131/download) repeals/reenacts the earlier framework. Section 5 generally starts the new law January 1, 2027 and applies it to consequential decisions on/after that date; limited rulemaking/funding sections took effect on passage. The statute excludes specified search and administrative uses, and its covered employment domain concerns an actual/potential employer–employee relationship. Where covered, it requires documentation, notices, records, and correction/human-review mechanisms. Its own-acts discrimination indemnity restriction also warrants contract review. The [Colorado AG](https://coag.gov/ai/) confirms the new timeline and identifies August 2026 rules as proposed. Do not describe the earlier February/June 2026 dates as the current new-law launch deadline.

**Operational conclusion:** complete a per-use assessment covering role, recipients, geography, model/version, inputs, ranking effect, sensitive traits/proxies, human review, alternatives, explanation/appeal capability, and prohibited uses. Use it to decide whether to disable, narrow, or comply with a feature. A disclaimer that results are “informational” does not determine their real function. Existing discrimination duties continue independently of special AI legislation.

### EU AI Act current-status check

The European Commission's [July 27, 2026 AI Omnibus announcement](https://digital-strategy.ec.europa.eu/en/news/ai-omnibus-enters-force), rechecked September 15, says the Omnibus entered into force on July 27 and moves Annex III high-risk requirements to December 2, 2027 and embedded-product requirements to August 2, 2028. It links [Official Journal L 2026/1744](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202601744). **Evidence limitation:** that linked legal text returned a robot challenge, so this report has verified the Commission's current statement, not independently read the amending articles. Confirm the consolidated enactment before fixing a legally critical EU activation date.

The Commission's separate [July 31, 2026 transparency announcement](https://digital-strategy.ec.europa.eu/en/news/commission-starts-enforcing-ai-act-rules-and-new-transparency-requirements-2-august) and [Article 50 guidance](https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems) confirm transparency requirements from August 2, 2026. Those should not be confused with postponed high-risk requirements. Pholio's EU employment/selection and biometric uses need classification; general-purpose-model-provider obligations are not automatically Pholio's merely because it calls a model API.

## 7. Uploaded media, public sites, and safety operations

### Copyright and likeness are separate permissions

The [Copyright Office's photographer guidance](https://www.copyright.gov/engage/photographers/) explains that photographers generally own their photographs, subject to recognized arrangements such as work made for hire. The depicted talent therefore cannot grant rights they never received. Require sufficient rights for hosting, technical resizing, display, sharing, and exports, and preserve credit/license information when required.

New York [Civil Rights Law § 50](https://www.nysenate.gov/legislation/laws/CVR/50) and [§ 51](https://www.nysenate.gov/legislation/laws/CVR/51) protect against relevant unauthorized advertising/trade use of a person's identity and address written consent, including minors. A necessary service license should be distinct from permission to feature a model in Pholio's marketing or authorize a commercial campaign/digital replica. A registry of image-rights assertions is a record, not proof that all asserted rights exist.

**Drafting direction:** users retain ownership; grant Pholio a limited operational license tied to the chosen features and visibility. Permit vendors and authorized recipients only as necessary for those purposes. Explain what happens when content is unpublished/deleted, including limited legal/security records and copies already exported. Do not take a perpetual unrestricted publicity, advertising, resale, or training license in exchange for an upload. Require separately authorized commercial uses.

### DMCA safe-harbor conditions

Under [17 U.S.C. § 512, published by the Copyright Office](https://www.copyright.gov/title17/92chap5.html#512), safe-harbor protection is conditional. Relevant steps include a registered/public designated agent, expeditious valid-notice handling, reasonable implementation of a repeat-infringer policy, and compliance with counter-notice/restoration rules. Where the statutory counter-notice route applies, restoration occurs no fewer than 10 and no more than 14 business days after receipt unless the required court-action notice arrives. Other independent lawful grounds for removal must be handled separately.

The [Copyright Office's online-service-provider resource](https://www.copyright.gov/onlinesp/) confirms that public contact details and Copyright Office designation are both needed. Establish a real agent, name/address/telephone/email, directory record, renewal responsibility, trained reviewers, and notice records. Do not assert safe harbor merely because the public page exists.

### TAKE IT DOWN: a distinct and presently operative notice

[Public Law 119-12, § 3](https://www.congress.gov/119/plaws/publ12/PLAW-119publ12.pdf) requires covered platforms to maintain a written reporting process for nonconsensual intimate visual depictions, including qualifying digital forgeries, and a conspicuous plain-language notice. A request identifies the material, supplies contact information, a signature and a good-faith nonconsent statement. For a valid request, removal must be as soon as possible and within 48 hours, with reasonable efforts to identify/remove known identical copies. The platform-process deadline was May 19, 2026.

The [FTC's May 19, 2026 enforcement announcement](https://consumer.ftc.gov/media/ftc-enforces-compliance-take-it-down-act) confirms that these duties are now enforced. A service centered on uploading and sharing talent photos/public pages should treat covered-platform status as a high-priority launch assessment. Do not require copyright ownership, a DMCA counter-notice exchange, or a court order before accepting the victim's statutory report. The [FTC platform letter](https://www.ftc.gov/system/files/ftc_gov/pdf/TIDA-Stakeholder-Letter.pdf) also recommends trackable requests and status communications.

**Operational requirements:** a monitored queue including nights/weekends, logged receipt times, authorized restricted reviewers, content/known-copy identification, CDN/cache handling, safe evidence preservation, escalation and response records. A mailbox monitored only on business days cannot substantiate a 48-hour promise. Ordinary moderation appeals must not automatically restore intimate abuse after a counterclaim.

### Child sexual exploitation reporting

[18 U.S.C. § 2258A](https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title18-section2258A), as amended by the REPORT Act, requires covered providers with qualifying knowledge of apparent offenses to report to NCMEC, including specified child sex-trafficking and enticement offenses. The reported-material preservation period is one year, subject to the statute; it is not the old 90-day period. The law does not create a general duty to monitor every user or proactively search all communications.

Establish CyberTipline access, response responsibility, restricted evidence storage, and lawful preservation/deletion rules. Public reporting copy should tell users how to report content without asking them to re-upload illegal media. Account deletion and a safety takedown must not destroy legally required preserved evidence.

## 8. Studio+, subscriptions, and communications

### Federal subscriptions law

[15 U.S.C. § 8403 (ROSCA)](https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title15-section8403) requires clear material terms before billing information, express informed consent before charging, and simple mechanisms to stop recurring charges. A Terms link by itself is not a recurring-payment consent mechanism.

The 2024 FTC “click-to-cancel” amendments were vacated. The [FTC's February 12, 2026 rule-conformance notice](https://www.ftc.gov/legal-library/browse/federal-register-notices/revision-negative-option-rule-withdrawal-cars-rule-removal-non-compete-rule-conform-these-rules) and [current federal rulemaking agenda](https://www.reginfo.gov/public/do/eAgendaViewRule?RIN=3084-AB84&pubId=202510) record restoration of the earlier text and a March 13, 2026 advance notice for further rulemaking. Do not present the vacated amendments as binding current federal law. ROSCA and state laws still support straightforward online cancellation.

### New York and California renewal controls

Current [New York GBL § 527-a](https://www.nysenate.gov/legislation/laws/GBS/527-A) includes pre-consent material disclosures, retainable confirmation, easy cancellation through required media, annual-renewal notice in the 15–45-day window for the specified annual term, material-change notice, and additional price-increase consent or cancellation/refund protection. The particular trial-notice provision applies to trials longer than a month; do not falsely describe Pholio's 14-day trial as meeting that trigger. Exact transaction applicability and notice dates must be computed from the actual terms.

The [California AG's September 4, 2025 automatic-renewal alert](https://www.oag.ca.gov/news/press-releases/attorney-general-bonta-issues-consumer-alert-california%E2%80%99s-automatic-renewal-law) confirms the strengthened law effective July 1, 2025, including affirmative consent and accessible cancellation. Any California paid expansion needs the actual statutory enrollment, acknowledgment, retention, trial/renewal reminder, fee-change, and cancellation implementation checked. A billing geofence must apply before checkout and cannot be assumed from marketing copy.

**Required product evidence:** itemized checkout terms; currency/tax/term/trial conversion; separate affirmative recurring authorization; disclosure-version record; receipt; cancellation inside the product; cancellation success and retained access period; reminder scheduling; price changes; failed payment/retry; refunds; disputes; and subscription cancellation during account deletion. “Non-refundable” must preserve mandatory rights. No legal text should suggest payment buys recipient access, ranking, review priority, or selection.

### Emails and off-Pholio delivery

The [FTC CAN-SPAM guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) distinguishes transactional/relationship messages from marketing and expressly covers B2B commercial email. Marketing requires accurate sender/subject, a valid postal address, a working opt-out, and timely honoring of opt-outs; outsourcing delivery does not remove responsibility. An account's email setting does not authorize all promotional messages.

For external agency flows disclose whether Pholio creates a local draft, exports a file, opens the agency's website, or actually transmits a message. If sending is later enabled, the user must authorize the specific recipient and final package; sender identity, suppression, recipient expectations, secure reply links, and status claims require review. A prepared application must never be represented as received or reviewed. Do not add SMS/telephone-marketing consent boilerplate where no such feature exists.

## 9. EU / UK expansion requirements

The [EDPB's final territorial-scope guidelines](https://www.edpb.europa.eu/documents/guideline/guidelines-32018-on-the-territorial-scope-of-the-gdpr-article-3-version-adopted_en) distinguish mere website accessibility from offering services to people in the EU and monitoring their behavior. Geography follows people, business targeting, and processing; a contract saying “US law” does not resolve it. Named European agency integrations, localized marketing, and tracked European visitors can change the analysis.

If GDPR applies, [Regulation (EU) 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng) requires purpose-specific lawful bases and transparent notices, additional conditions for sensitive data, meaningful rights handling, processor contracts, appropriate security, breach processes, and safeguards for relevant international transfers. Article 13 direct collection and Article 14 indirectly received agency/roster data require distinct attention. A one-month response period should not be rewritten as the US 45-day standard. Explicit consent is not a universal substitute for an appropriate legal basis. DPIA, representative, and DPO requirements must be assessed against their actual triggers rather than universally promised.

Agency-controlled intake/notes and Pholio-controlled accounts/security/discovery may require different roles. For hosted applicant processing, the [ICO's Article 28 guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/contracts-and-liabilities-between-controllers-and-processors-multi/what-needs-to-be-included-in-the-contract/) calls for documented instructions, confidentiality, security, subprocessors, assistance with rights/incidents, return/deletion, and audit provisions. International transfer annexes require completed parties, role-specific modules, data schedules and safeguards. Merely linking to standard clauses does not execute them. Do not claim Data Privacy Framework certification without an actual applicable listing.

For EU hosting/platform duties, the [Digital Services Act](https://eur-lex.europa.eu/eli/reg/2022/2065/oj/eng) requires a separate service classification. Hosting notice/action, content-restriction reasons, points of contact and potentially legal representation matter; micro/small-business exemptions are targeted and do not exempt all hosting duties. Larger-platform obligations should not be indiscriminately pasted into Pholio's terms. Targeted advertising to minors and sensitive-data profiling restrictions are additional reasons not to create those practices.

For UK user-to-user services with the required UK links, [Ofcom's current illegal-content guidance](https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/illegal-content-duties-under-the-online-safety-act) requires risk assessment, proportionate safeguards, reporting/complaints, clear terms, and records. The [children's-access/risk-assessment guidance](https://www.ofcom.org.uk/online-safety/protecting-children/enforcement-programme-to-monitor-if-services-are-meeting-their-childrens-risk-assessment-duties-under-the-online-safety-act-2023) explains that 18+ terms do not by themselves establish that children cannot access the service. Small size alone is not a complete exemption. Establish scope before inviting UK users or agencies into messaging/hosting workflows.

**UK current-law correction:** the ICO's [April 29, 2026 storage/access guidance announcement](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/04/final-storage-and-access-technologies-guidance-published/) incorporates Data (Use and Access) Act changes. Its [exceptions guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/) includes a narrowly conditioned statistical-purpose exception. Do not state that every UK analytics operation necessarily requires consent, or that every analytics product qualifies for the exception. Named-recipient/visitor-level portfolio intelligence may differ materially from aggregate service-improvement statistics. Existing opt-in analytics is a product choice that may remain appropriate.

UK consumer subscription rights also require separate review. The government's [April 2, 2026 implementation response](https://www.gov.uk/government/consultations/consultation-on-the-implementation-of-the-new-subscription-contracts-regime/outcome/government-response-to-consultation-on-the-implementation-of-the-new-subscription-contracts-regime-web-accessible-version) anticipates the new DMCCA subscription regime in spring 2027; it is not an already operative September 2026 subscription regime. Existing consumer contract/cancellation/unfair-terms law remains relevant. Do not offer a worldwide waiver of mandatory refund, court, or statutory rights.

## 10. Notices and consents required in product context

This is an implementation checklist, not a claim these mechanisms are all already present. Relevant authorities and conditional triggers are explained in the sections above.

| Trigger | Required concrete information / choice | Evidence to keep |
| --- | --- | --- |
| Account creation / revised Terms | Conspicuous linked Terms, unambiguous affirmative assent, eligibility, accessible copy. Privacy is a notice acknowledgment. | User/role, exact version, timestamp, presented statement, acceptance event. |
| Agency access request and setup | Collection notice, requester authority, agency purpose, recipient terms/DPA, independent applicant-notice responsibility. | Approved organization, authorized acceptor, agreement/version and scope. |
| Public publication / discoverability | What data/images become visible, to whom, indexing/copy risks, relevant controls. | Separate settings and change history, correct permissions. |
| Named application / event casting | Recipient identity, actual purpose, exact snapshot and permitted use, optional disclosures, retention/withdrawal limits. | Recipient, purpose, submitted artifact, consent/version, delivery state. |
| Roster/import/contact entry | Source, uploader authority, lawful basis and required notice to nonusers. | Source and notice/authorization record. |
| Technical AI / semantic discoverability | Inputs, vendors/functions, ordering effects, limitations, withdrawal/deletion behavior, separate choices where consent is required. | Purpose/version opt-in, model/provider/version, eligibility gate, deletion record. |
| ID/selfie verification | Verifier, identifiers/biometrics, purpose, duration, recipients, alternative route if available, separate required written consent. | Signed consent and minimal verification result; provider deletion evidence. |
| Social/creator connection | Exact account permissions and data, ongoing refresh, who can see outputs, disconnect/deletion effect. | OAuth permission/version and tokens protected separately; revocation test. |
| Studio+ checkout | Price/period, trial conversion, renewal, cancel/refund rules, affirmative recurring authorization. | Checkout disclosure version, consent, receipt, reminders/cancellation. |
| Analytics on public sites/share links | Collection purpose, visitor-level versus aggregate results, necessary versus optional technologies. | Consent/preferences, enforced gating, retention/deletion. |
| Minor/guardian activation | Verified authority, child eligibility, required teen consent, recipient limitations and permit distinctions. | Guardian and youth records separately, scope, expiry/revocation. |
| Safety/copyright report | Accessible distinct channels, minimal necessary fields, relevant procedure and deadlines. | Receipt, decision, removal/copy search, notices and protected evidence. |
| Delete / withdraw / disconnect | Precise effect on account, billing, public/media access, recipient copies, vendors, retained legal records. | Completion/retry records and any limited documented exceptions. |

In [Berman v. Freedom Financial Network (9th Cir. 2022)](https://cdn.ca9.uscourts.gov/datastore/opinions/2022/04/05/20-16900.pdf), insufficiently conspicuous notice and lack of unambiguous assent defeated enforcement. This is a useful design/evidence warning, not a universal contract-formation rule for all jurisdictions. Hyperlink style, placement, nearby button text, and the archived screen matter, not just the existence of `/terms`.

## 11. Internal operations legal copy cannot replace

Launch evidence should include:

1. **Company identity:** actual contracting entity, formation/status, verified service address, notice contacts, merchant identity, and authority to sign. A source-code company constant is not a corporate record. Do not invent an address.
2. **Launch restrictions:** approved geography/age/feature matrix, implemented signup/checkout/API/import enforcement, and an owner who reviews changes. An environment variable is not proof of all-route enforcement.
3. **Talent-services classification:** counsel's CA/NY analysis of the final offering and marketing; any actual required license, registration, bond or prescribed agreement. Do not disclaim away regulated conduct.
4. **Data/vendor register:** data flow, role, location, lawful basis/consent, transfer basis, actual contracts, provider retention/training settings and deletion support. Include analytics, storage/CDNs, email, auth, billing, AI, identity, and social APIs.
5. **Privacy operations:** authenticated requests, authorized agents, appeals, response clocks, agency handoffs, access/correction/portability, targeted erasure across database/media/indices/embeddings/exports/vendors, backup expiry and legal holds.
6. **Security:** named responsible person, least privilege, tenant isolation, signed-link and object permissions, credentials/secrets, audit access, incident response, recovery, and vendor incident contacts. Verify implementation without claiming unearned certifications.
7. **Safety:** staffed rapid-response channel, TAKE IT DOWN process/copy search, DMCA agent and repeat-infringer handling, NCMEC reporting, abuse investigations, appeals, emergency escalation, and restricted evidence retention.
8. **Billing:** enrollment and recurring consent, reminders, price changes, cancellation/refund support, webhook reliability, and account-deletion/subscription coordination.
9. **Minors:** guardian/youth consents, actual age/authority verification, private-by-default media, restricted communications/imports, required permit responsibilities, and adulthood transition.
10. **AI:** feature-specific risk/classification decisions, discriminatory output/proxy assessment, consent/eligibility gates, correction/withdrawal, vendor settings and contract permissions, documented authorized uses, human review where required.
11. **Publication:** immutable legal versions, notice delivery, assent evidence, separate dates, cross-repo version synchronization, and a rollback that does not erase the prior agreement.

The Terms should preserve lawful complaints and truthful reviews. The [FTC's Consumer Review Fairness Act guidance](https://www.ftc.gov/business-guidance/resources/consumer-review-fairness-act-what-businesses-need-know) prohibits relevant standardized gag/penalty/IP-assignment terms. Similarly, any arbitration clause must preserve the election provided by [9 U.S.C. § 402, enacted in Public Law 117-90](https://uscode.house.gov/download/bills/117-2/117-90.pdf) for covered sexual-assault/harassment disputes. Broad indemnities and forum clauses need consumer/jurisdiction-specific review; they are business choices, not required contents of every SaaS agreement.

## 12. Effective Date, Last Updated, and revision control

No general rule requires these labels always to differ. They must mean different things and record true events. CalOPPA requires an effective-date disclosure; misleading date treatment also undermines the assent evidence described above.

- **Last Updated:** the date the published text was actually revised. A formatting-only change may update this field without changing legal substance, provided the archival/version convention explains that distinction.
- **Effective Date:** when this agreement/version becomes operative for the relevant users. Drafting, committing, deploying, giving notice, and user acceptance are different events.
- **First actual publication:** an initial version can have the same dates if revision/publication/operation truly coincide. Do not call this rewrite first-ever publication if July documents were already served or accepted.
- **Later material revisions:** preserve the prior text and its effective period; give the notice required by the existing contract and law; specify new-user versus existing-user operation if different; obtain fresh assent where appropriate. No retroactive authorization for new data uses or a newly broadened image license.
- **Privacy changes:** notice changes describe processing; they are not a backdoor consent reset. Obtain new purpose-specific consent where required before changed processing starts.
- **Cross-repo release:** coordinate `CURRENT_LEGAL_VERSION`, public document availability, `TERMS_CHANGELOG`, talent and agency acceptance, effective-date logic, and any billing-disclosure version. Do not advance an acceptance gate to a version that is not yet actually available and operable.

As of this research, September 15, 2026 is a valid **research/revision date**, not independently established as the authorized public launch or agreement effective date. A launch owner must establish the real publication/notice/operation events; the public documents must express those honestly.

## 13. Specific unresolved decisions and research limits

The following remain evidence or legal decisions, not copy problems:

- Confirm the contracting entity, physical service address, monitored mailboxes, registered DMCA agent, any required talent-service registration/license, and actual launch geography.
- Resolve whether the final combined Studio+/free business is a regulated or prohibited California talent service, New York model management activity, or another employment/intermediation service. The August strategy's statutory readings are not adjudicated exemptions.
- Confirm the September ranking design's actual impact and authorized agency uses. “Search,” “discovery,” and “informational” labels are not sufficient by themselves.
- Select and diligence the ID/selfie provider before publishing specific biometric processing claims; inspect the actual data contract and evidence deletion behavior.
- Decide whether any health-status information is actually collected/inferred, and whether a separate consumer-health-data policy is triggered. Do not assume measurements or adult-creator status automatically settle that question.
- Establish which retention periods and deletion promises are actually supported; verify recipient exports and post-withdrawal access independently of database flags.
- Confirm current law again at any delayed launch. EU Omnibus status was verified through current Commission statements; the linked amending OJ text was not readable in this session. Some California consolidated sections and Texas biometric statutory text also could not be retrieved; the report identifies where regulator/enactment sources were used instead.
- This is a targeted primary-source launch architecture and risk assessment, not a completed 50-state threshold survey or an authorization to launch internationally. Add jurisdiction-specific work where the actual launch register shows exposure.

**The required release test is not whether the pages sound professional. It is whether every asserted service behavior, permission, remedy, and mandatory process has an identified owner and evidence in the intended launch product.**
