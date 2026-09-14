/**
 * Every string this page puts on screen, in one file, so the copy audit
 * (banned-ui §9) can be run by reading one short file cold.
 *
 * The option vocabularies (agency types, boards, roster and team sizes, use
 * cases, contact roles) are NOT here: they land in the database verbatim, so
 * they live next to the API contract in `lib/agency-access-request.ts`, where
 * a data-migration edit is harder to mistake for a copy tweak.
 *
 * The test every line here passed (lessons.md §40): read once, does the
 * agency know something it did not know before? Plain nouns and verbs first;
 * the voice is in the restraint, not in fragments.
 *
 * Where each fact lives:
 *
 *   before anything    who reviews the request, and that it costs nothing
 *   beside a field     a note behind the information mark, only where it
 *                      changes how the field is answered
 *   at the send        that no account is created, and what Pholio does next
 *   after the request  the review, collapsed by default: who reads it, the
 *                      call some agencies get, what approval sends, what a
 *                      decline sends, where to write
 *
 * Zero em-dashes, zero en-dashes. Ranges take a hyphen.
 */

export const OPENING = {
  headingPrefix: "Request access for your ",
  headingItalic: "agency",
  headingSuffix: ".",
  support: "Every request is reviewed by a person. Agencies are never charged.",
} as const;

/**
 * The four groups the request is drawn up in. The ids are internal; nothing
 * on the page prints them as headings, and nothing counts them.
 */
export const GROUP_IDS = ["agency", "profile", "contact", "use"] as const;
export type GroupId = (typeof GROUP_IDS)[number];

/**
 * The term column of every row; for each field that needs one, the note its
 * information mark opens; for each choice, the prompt shown where the value
 * will go.
 */
export const FIELD_COPY = {
  agencyName: {
    term: "Agency",
    info: "The official legal or trade name of your agency.",
  },
  websiteUrl: {
    term: "Website",
    info: "Enter your root domain (e.g. agency.com). We check this against public registry records.",
  },
  primaryMarketCity: {
    term: "City",
    info: "The agency's headquarters or primary operating market.",
  },
  primaryMarketCountry: {
    term: "Country",
    info: "Primary country of operation if active internationally.",
  },
  agencyType: {
    term: "Type",
    info: "The primary representation model of your company.",
    prompt: "Select a type",
  },
  primaryBoards: {
    term: "Boards",
    info: "Select all active divisions on your roster, including new faces and commercial.",
    prompt: "Select boards",
  },
  rosterSizeRange: {
    term: "Roster",
    info: "Total active talent represented across all of your agency's boards.",
    prompt: "Select a range",
  },
  teamSizeRange: {
    term: "Team",
    info: "Staff members who will use the workspace: bookers, scouts, and directors.",
    prompt: "Select a range",
  },
  contactName: {
    term: "Your name",
    info: "Your full name as the authorized agency representative.",
  },
  contactEmail: {
    term: "Work email",
    info: "Use an address at your agency domain. Personal emails (Gmail, Yahoo) delay verification.",
  },
  contactRole: {
    term: "Role",
    info: "Your position at the agency. Select Other if your title is not listed.",
    prompt: "Select your role",
  },
  contactRoleOther: { term: "Your role" },
  firstUseCases: {
    term: "Intended use",
    info: "What you plan to build first: digital packages, talent portfolios, or client links.",
    prompt: "Select what applies",
  },
  notes: {
    term: "Notes",
    info: "Optional details that help verify your agency: licence numbers, trade associations, or referrals.",
  },
} as const;

/** The marks beside a term, and what they say when opened. */
export const MARKS = {
  /** Prefix for the information mark's accessible name: "About Boards". */
  aboutPrefix: "About ",
} as const;

export const ACTIONS = {
  continueLabel: "Continue",
  submitLabel: "Submit request",
  submitPendingLabel: "Submitting",
  changeLabel: "Change",
  chooseOne: "Select one.",
  chooseAny: "Select all that apply.",
  counterSeparator: " / ",
} as const;

/** What pressing the button does, beside it. */
export const SEND_NOTE =
  "Every request is reviewed individually. Your access link will be delivered by email upon approval.";

export const FORM_MESSAGES = {
  validation: "Some fields are missing or invalid.",
} as const;

export const FIELD_ERRORS = {
  required: "Required",
  invalidWebsite: "Enter a valid agency website.",
  invalidEmail: "Enter a valid work email.",
} as const;

export const ALREADY_ACCESS = {
  heading: "This account already has agency access.",
  signedInAs: (email: string) => `You are signed in as ${email}.`,
  requestsAreFor: "This form is for agencies that are not on Pholio yet.",
  openDashboard: "Open the agency dashboard",
  signOutPrompt: "Requesting for a different agency? Sign out.",
} as const;

export const SUCCESS = {
  heading: "Request received.",
  bodyBefore: "Pholio will review it and email ",
  bodyAfter: " if it is approved. You will not receive a confirmation email.",
  correctionBefore: "To add or correct something, write to ",
  correctionAfter: " from that address.",
  backToPholio: "Back to Pholio",
} as const;

/**
 * What happens after you submit. Collapsed by default: it is for the agency
 * that wants to know before or after sending, and it is not needed to send.
 * Each line is a fact from the app: manual review, the call some agencies
 * get, one email on approval with a link that expires, nothing on a decline.
 */
export const PROCESS = {
  id: "after",
  summary: "What happens after you submit",
  steps: [
    "A person at Pholio reviews the request and checks it against the agency's website and public records.",
    "Some agencies are asked for a short call first, usually those with a large roster or boards that include minors.",
    "If the request is approved, the contact named on it receives one email with a link to set up the agency. The link is valid for one hour.",
    "If it is not approved, no email is sent. Pholio does not reply to every request.",
  ],
  contactBefore: "Questions or corrections: ",
  contactAfter: ". Write from the email address on the request.",
} as const;
