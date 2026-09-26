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
  PRIVACY_EMAIL,
} from "@/lib/legal-constants";

const sections: LegalSection[] = [
  {
    title: "Scope and Related Notices",
    content: [
      `This Cookie Policy explains how ${COMPANY_NAME} ("Pholio," "we," "us") uses cookies and similar technologies on its marketing website, application, and Public Sites served through the Services. Capitalized terms have the meanings given in the [Terms of Service](/terms). The [Privacy Policy](/privacy) explains the associated personal-data processing.`,
      `Cookies store small values in a browser. Related technologies include localStorage, sessionStorage, authentication tokens, link identifiers and server records associated with a browser or request. A technology can process personal data even when it does not set a cookie.`,
      `This Policy covers technologies controlled by Pholio. A third-party website reached from Market, a social link, an embedded service, or a Recipient's independent website may have its own technologies and notices. A Pholio analytics choice does not control that third party's independent processing.`,
    ],
  },
  {
    title: "Necessary Technologies",
    content: [
      `Authentication, security, consent records and technologies needed to provide a feature you request support the operation of the Services. Pholio's analytics preference does not disable these technologies. You can restrict them through your browser, but login, checkout, recovery or another requested feature may then fail.`,
      `connect.sid\nAn HttpOnly session cookie maintains an authenticated Pholio session for up to seven days. It is shared across Pholio subdomains when the production domain is .pholio.studio. HttpOnly means ordinary page scripts cannot read the value.`,
      `Firebase authentication storage\nFirebase uses browser storage to maintain sign-in and refresh information. Its duration depends on the authentication persistence setting, sign-out, expiry and revocation. Clearing a Pholio cookie alone does not necessarily clear the identity-provider state held by the browser.`,
      `Requested-feature storage\nOnboarding, form recovery, selected preferences and Submission preparation may use localStorage or sessionStorage. Session storage normally lasts for a tab session; local storage can remain until it expires under the feature's rules or you clear it. Avoid using a shared device for confidential drafts.`,
    ],
  },
  {
    title: "Your Consent Record",
    content: [
      `pholio_consent\nThis first-party preference cookie records the consent-format version, necessary-storage status, your analytics choice and the time of that choice. It lasts for up to one year and is accessible to Pholio page scripts so the preference can be read and changed.`,
      `On pholio.studio and its subdomains, the preference uses the .pholio.studio domain so the same browser choice applies to www.pholio.studio and app.pholio.studio. On another domain, including a separate custom domain or preview host, browser restrictions can require a separate preference. Choices do not automatically follow you across browsers or devices.`,
      `pholio_cookie_consent_v1 is an older localStorage preference. Where present, it can be read to migrate an existing choice to pholio_consent. Resetting cookie preferences clears this legacy record on the current origin as well as the current consent cookie.`,
    ],
  },
  {
    title: "Optional Visitor Analytics",
    content: [
      `With an affirmative analytics choice, Pholio can use persistent visitor and visit identifiers to measure audiences and interactions on a Public Site. Without that choice, Pholio does not create or renew the optional visitor session described below.`,
      `pholio_visitor_id\nAn HttpOnly analytics cookie recognizes a returning browser on the host serving the portfolio. Its configured duration is up to one year. It is host-only, rather than shared across all Pholio subdomains.`,
      `pholio_session_<profile identifier>\nAn HttpOnly analytics cookie connects events during a visit to a particular portfolio. Its name includes a form of that profile's identifier. Its configured duration is approximately 30 minutes, and it is host-only.`,
      `Consented analytics may associate views, returning visits, image impressions or opens, reading and dwell events, contact or social clicks, scroll activity and shared-link activity with visitor/session identifiers, IP address, user agent, referrer, approximate location and time. Talent can receive audience and engagement information for their Public Site. These records are not necessarily anonymous.`,
      `Pholio does not use these analytics cookies for cross-context behavioral advertising. Our current Services do not use third-party advertising pixels to sell or share personal data for that purpose.`,
    ],
  },
  {
    title: "Records Collected Without Optional Cookies",
    content: [
      `Declining optional analytics does not stop every server record. Pholio and its hosting, delivery and security providers process requests to deliver pages, authenticate users, prevent abuse and investigate errors. Those records can include IP addresses, requested resources, time and other network information under the [Privacy Policy](/privacy).`,
      `Pholio also records certain portfolio views and interactions to produce usage counts without creating the optional persistent visitor session. For these nonconsented event records, the portfolio event logger omits IP address and user agent; it can retain the profile, event, time and referrer or other event metadata. A referrer is information about the page or link from which a visit originated and can include information in its URL. These records are not represented as wholly anonymous merely because no analytics cookie is set.`,
      `Necessary security processing, aggregate reporting and optional visitor tracking serve different purposes. Where applicable law requires consent for a particular storage or processing activity, Pholio must obtain that consent before the activity or restrict it.`,
    ],
  },
  {
    title: "Providers and External Services",
    content: [
      `Firebase and Google can use authentication storage, sign-in state and provider cookies when you use their authentication features. Google-controlled pages apply Google's own notices to independent processing.`,
      `Stripe can use checkout, fraud-prevention and session technologies when you open its hosted checkout, billing portal or an enabled identity-verification flow. The applicable Stripe notice is presented with that service.`,
      `Cloudflare, Netlify and other infrastructure providers process technical requests needed to deliver or protect the Services. An external social, video or other linked service may also collect information when you choose to open or use it. The [Privacy Policy](/privacy) describes provider and integration roles.`,
    ],
  },
  {
    title: "Give, Decline or Withdraw a Choice",
    content: [
      `The cookie banner offers an affirmative analytics choice and a necessary-only choice. You can withdraw an earlier choice using the Cookie preferences control in the footer or [change your choice on this page](/cookies#preferences). Resetting preferences removes the current preference and reopens the banner; optional visitor tracking requires an affirmative choice again.`,
      `Withdrawal affects future optional tracking after the change is read. It does not itself delete previously stored cookies, reports or server records. You can clear existing cookies through your browser and request deletion of qualifying server data at ${PRIVACY_EMAIL}. We may need enough information to locate the records and verify your request.`,
      `Browser settings can block, delete or limit cookies and local storage. Private browsing and clearing site data can cause Pholio to ask for your choice again. Blocking authentication or payment technologies can interrupt those services.`,
      `Pholio does not treat a Do Not Track header as a general instruction to stop all processing. We honor legally required opt-out requests and signals for processing to which those rights apply, as explained in the [Privacy Policy](/privacy). A signal is not required to choose necessary-only analytics.`,
    ],
  },
  {
    title: "Retention and Young People",
    content: [
      `A cookie's expiry is different from the retention period for an associated server record. Session, analytics, consent and security records follow the purpose-based retention criteria in the [Privacy Policy](/privacy), including lawful security, dispute and recordkeeping exceptions. Deleting a cookie does not delete those records.`,
      `Talent accounts are currently available only to adults under the [Terms of Service](/terms). Public pages can nevertheless be visited by young people. The Services are not directed to children under 13. A parent, guardian or young person can contact ${PRIVACY_EMAIL} about information collected from a child or an applicable privacy choice. The [Guardian and Minor Notice](/legal/guardians) explains the separate status of any future minor program.`,
    ],
  },
  {
    title: "Changes and Contact",
    content: [
      `We may revise this Policy when technologies, purposes, providers or legal requirements change. The revised Policy will state its update and effective dates. We will provide additional notice and obtain a new choice where required; posting a revised Policy does not itself constitute your consent.`,
      `For cookie, analytics, browser-storage or deletion requests, contact ${PRIVACY_EMAIL}.`,
    ],
  },
];

export function CookiesContent() {
  return (
    <LegalDocumentLayout
      title="Cookie Policy"
      subtitle="How Pholio uses cookies and browser storage, measures public-site activity, and gives you control over optional visitor tracking."
      lastUpdated={LAST_UPDATED}
      effectiveDate={EFFECTIVE_DATE}
      sections={sections}
      contactEmail={PRIVACY_EMAIL}
      footerTitle="Cookie or Analytics Questions?"
      footerBody="Contact the Privacy Team to ask about a browser identifier, portfolio analytics, consent preference, or deletion request."
      companyName={COMPANY_NAME}
      companyAddress={COMPANY_ADDRESS}
    />
  );
}
