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
    title: "Scope",
    content: [
      `This Cookie Policy explains cookies, browser storage, session identifiers, and related technologies used by ${COMPANY_NAME} ("Pholio," "we," "our," or "us") on www.pholio.studio, app.pholio.studio, and public portfolio pages.`,
      `Cookies are small files or values stored by a browser. Similar technologies include localStorage, sessionStorage, authentication refresh information, URL tokens, and server records linked to a browser identifier.`,
      `This inventory reflects the Platform configuration reviewed as of the Effective Date. Browser, provider, and deployment behavior can change. Contact ${PRIVACY_EMAIL} if you observe a technology not described here.`,
    ],
  },
  {
    title: "Why We Use These Technologies",
    content: [
      `We use cookies and similar technologies to authenticate users, maintain sessions, secure requests, remember a consent preference, operate payment checkout, track public portfolio audiences and interactions, prevent abuse, troubleshoot, and measure product use.`,
      `We do not currently use third-party advertising pixels or cookies for cross-context behavioral advertising on the authenticated application. Public portfolio analytics are first-party analytics, but they are not necessarily anonymous when collected because the records can include persistent identifiers, IP address, user agent, referrer, and timestamps.`,
    ],
  },
  {
    title: "Current First-Party Cookies and Storage",
    content: [
      `connect.sid\nPurpose: Maintains the Express authenticated session. Type: strictly necessary. Storage: first-party HttpOnly cookie. Configured duration: up to seven days. It may be shared across Pholio subdomains when the production cookie domain is configured that way. Logging out the current browser removes or invalidates the current session, but a separately persisted identity-provider login may be capable of creating a new Platform session.`,
      `pholio_visitor_id\nPurpose: Recognizes a browser as a returning visitor across public portfolio pages and supports Talent analytics. Type: first-party portfolio analytics. Storage: HttpOnly cookie. Configured duration: up to one year.`,
      `pholio_session_<profile identifier>\nPurpose: Associates interactions during a visit with a particular public portfolio. Type: first-party portfolio analytics. Storage: HttpOnly cookie. Configured duration: approximately 30 minutes.`,
      `pholio_cookie_consent_v1\nPurpose: Remembers the necessary/analytics preference selected in the application. Type: preference record. Storage: localStorage, not a cookie. Duration: until cleared, replaced, or site data is deleted. This preference does not itself erase prior analytics and may not currently gate every server-side security or public-portfolio event.`,
      `Firebase browser storage\nPurpose: Maintains the user's Firebase identity-provider state and permits token refresh. Type: strictly necessary authentication storage. Storage and duration depend on Firebase configuration, logout, token expiry, and revocation. Ending only a Pholio server session may not remove the Firebase state from that browser.`,
      `Onboarding and recovery storage\nPurpose: Remembers parts of onboarding, a submission draft, or browser recovery state. Type: functional or necessary local/session storage. Keys and duration vary by feature; some browser recovery records are designed to expire after approximately seven days.`,
    ],
  },
  {
    title: "Third-Party Technologies",
    content: [
      `Firebase / Google\nFirebase manages authentication and may use browser storage, OAuth state, or provider cookies during sign-in. Google sign-in can also involve cookies on Google-controlled domains. Google's terms and privacy policy govern its independent processing.`,
      `Stripe\nStripe may set fraud-prevention, checkout, and session cookies when you open a Stripe-hosted checkout or customer portal. Stripe's terms and privacy policy govern those technologies.`,
      `Other providers\nCloudflare, Netlify, and security or infrastructure providers may process network identifiers or set operational cookies when required to deliver or protect their services. We do not represent that an infrastructure log is anonymous merely because no browser cookie is set.`,
    ],
  },
  {
    title: "Public Portfolio Analytics",
    content: [
      `When a person other than the signed-in owner visits a public portfolio, Pholio can create or update a visitor session and record a view. Automated crawlers identified by user agent are generally excluded, but detection is not perfect.`,
      `Recorded events can include profile views, returning status, image impressions and opens, dwell time, biography reads, contact or social clicks, scroll depth, link opens, referrer, share-token activity, approximate location or market, and timestamps. Server records can include the visitor identifier, profile-session identifier, IP address, and user agent.`,
      `These analytics are shown to or used for the relevant Talent account and product operations. They are not used for cross-site advertising. The browser analytics preference does not currently guarantee that every server-side public-profile event is suppressed.`,
    ],
  },
  {
    title: "Consent and Legal Bases",
    content: [
      `Strictly necessary authentication, security, and requested-service technologies are used to provide the service and generally cannot be disabled through a Pholio preference. Blocking them may prevent login, checkout, or core features.`,
      `Where law requires consent before nonessential analytics or storage, Pholio must obtain that consent before the relevant technology is used. The presence of a preference control does not by itself establish that a particular collection is legally necessary or exempt from consent.`,
      `Known minors can have additional consent and default-privacy rights. A guardian authorization does not replace a minor's separate choice where applicable law gives that choice to the minor.`,
    ],
  },
  {
    title: "Your Choices",
    content: [
      `You can use available account preferences, clear site data, block cookies through the browser, use private-browsing controls, or contact ${PRIVACY_EMAIL}. Clearing connect.sid or Firebase storage can sign you out. Blocking Stripe cookies can interfere with checkout.`,
      `A browser "Do Not Track" signal is not a substitute for a legally recognized universal opt-out signal, and Pholio does not claim that all current server-side analytics respond to DNT. Because Pholio does not sell data or use it for cross-context behavioral advertising, a sale/share opt-out signal has limited application to the practices described here.`,
      `To request deletion of server-side visitor or analytics records, contact ${PRIVACY_EMAIL}. We may need information sufficient to locate and verify the records, and legal or security exceptions can apply.`,
    ],
  },
  {
    title: "Retention",
    content: [
      `Cookie durations are described above. Deleting a browser cookie does not delete the associated server record. Server-side session, visitor, analytics, security, and fraud records are retained according to the criteria in the Privacy Policy and active operational schedules.`,
      `We do not represent that all IP-bearing analytics are automatically purged after 90 days or that all expired server sessions are purged monthly. A verified deletion request can be sent to ${PRIVACY_EMAIL}.`,
    ],
  },
  {
    title: "Children",
    content: [
      `The Platform is not directed to children under 13. If we learn that an under-13 child used the Platform and cookies or browser identifiers were associated with the child before the age screen was completed, we will investigate and delete or restrict the information as required by law.`,
      `Parents or guardians can contact ${PRIVACY_EMAIL} about a child's account, browser identifier, or analytics data.`,
    ],
  },
  {
    title: "Changes and Contact",
    content: [
      `We may update this Policy as technology, providers, or law changes. We will update the dates above and provide any additional notice or consent required by applicable law.`,
      `Cookie, analytics, browser-storage, or deletion questions: ${PRIVACY_EMAIL}`,
    ],
  },
];

export function CookiesContent() {
  return (
    <LegalDocumentLayout
      title="Cookie Policy"
      subtitle="This Policy identifies Pholio's current authenticated-session, Firebase, portfolio-visitor, profile-session, localStorage, checkout, and server-side analytics technologies."
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
