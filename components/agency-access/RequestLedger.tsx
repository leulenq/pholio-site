"use client";

/**
 * The request, drawn up as a record.
 *
 * Four groups: the agency, its profile, the person asking, and what Pholio
 * would be used for first. One group is open at a time and set at display
 * scale; the groups already answered settle above it into the same rows with
 * the answers as text, and can be reopened. Groups not yet reached are not on
 * the page. There is no numbering and no panel: the page grows as the request
 * does, and what the reviewer will read is what the agency watches take shape.
 *
 * The first group is the door. Completing it is the one event the page turns
 * on: the parent lights the room (index.tsx) and the next group arrives on
 * the workspace's paper.
 */

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";

import { usePholioAuth } from "@/lib/pholio-auth/PholioAuthProvider";
import {
  AGENCY_TYPES,
  BOARDS,
  CONTACT_ROLES,
  FIELD_LIMITS,
  ROSTER_SIZES,
  TEAM_SIZES,
  USE_CASES,
  submitAgencyAccessRequest,
  type AgencyAccessRequest,
} from "@/lib/agency-access-request";

import { Arrive } from "./Arrive";
import {
  ACTIONS,
  ALREADY_ACCESS,
  FIELD_COPY,
  FIELD_ERRORS,
  FORM_MESSAGES,
  GROUP_IDS,
  SEND_NOTE,
  SUCCESS,
  type GroupId,
} from "./content";
import {
  Action,
  ActionLink,
  Answer,
  QuietAction,
  ROW_GRID,
  Choice,
  Term,
  TypesetArea,
  TypesetInput,
  noteIdFor,
} from "./kit";

interface FormValues {
  agencyName: string;
  websiteUrl: string;
  primaryMarketCity: string;
  primaryMarketCountry: string;
  agencyType: string;
  primaryBoards: string[];
  rosterSizeRange: string;
  teamSizeRange: string;
  contactName: string;
  contactEmail: string;
  contactRole: string;
  contactRoleOther: string;
  firstUseCases: string[];
  notes: string;
  /** Honeypot. Never sent. Named so no browser autofill heuristic targets it. */
  refcode: string;
}

type Field = keyof FormValues;
type Errors = Partial<Record<Field, string>>;

const INITIAL_VALUES: FormValues = {
  agencyName: "",
  websiteUrl: "",
  primaryMarketCity: "",
  primaryMarketCountry: "",
  agencyType: "",
  primaryBoards: [],
  rosterSizeRange: "",
  teamSizeRange: "",
  contactName: "",
  contactEmail: "",
  contactRole: "",
  contactRoleOther: "",
  firstUseCases: [],
  notes: "",
  refcode: "",
};

/** Which fields each group owns, in DOM order. Validation and focus follow it. */
const GROUP_FIELDS: Record<GroupId, readonly Field[]> = {
  agency: ["agencyName", "websiteUrl"],
  profile: [
    "primaryMarketCity",
    "primaryMarketCountry",
    "agencyType",
    "primaryBoards",
    "rosterSizeRange",
    "teamSizeRange",
  ],
  contact: ["contactName", "contactEmail", "contactRole", "contactRoleOther"],
  use: ["firstUseCases", "notes"],
};

const OPTIONAL: ReadonlySet<Field> = new Set(["primaryMarketCountry", "notes", "refcode"]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeWebsite(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProtocol = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return withProtocol;
  } catch {
    return null;
  }
}

function isEmpty(value: string | string[]): boolean {
  return Array.isArray(value) ? value.length === 0 : value.trim().length === 0;
}

function validateGroup(group: GroupId, values: FormValues): Errors {
  const errors: Errors = {};
  for (const field of GROUP_FIELDS[group]) {
    if (field === "contactRoleOther") {
      if (values.contactRole === "Other" && isEmpty(values.contactRoleOther)) {
        errors.contactRoleOther = FIELD_ERRORS.required;
      }
      continue;
    }
    if (!OPTIONAL.has(field) && isEmpty(values[field])) {
      errors[field] = FIELD_ERRORS.required;
    }
  }
  if (group === "agency" && !errors.websiteUrl && !normalizeWebsite(values.websiteUrl)) {
    errors.websiteUrl = FIELD_ERRORS.invalidWebsite;
  }
  if (group === "contact" && !errors.contactEmail && !EMAIL_PATTERN.test(values.contactEmail.trim())) {
    errors.contactEmail = FIELD_ERRORS.invalidEmail;
  }
  return errors;
}

function buildPayload(values: FormValues): AgencyAccessRequest {
  const website = normalizeWebsite(values.websiteUrl) ?? values.websiteUrl.trim();
  const contactRole =
    values.contactRole === "Other" ? values.contactRoleOther.trim() : values.contactRole;

  const payload: AgencyAccessRequest = {
    agencyName: values.agencyName.trim(),
    websiteUrl: website,
    primaryMarketCity: values.primaryMarketCity.trim(),
    agencyType: values.agencyType,
    primaryBoards: values.primaryBoards,
    rosterSizeRange: values.rosterSizeRange,
    teamSizeRange: values.teamSizeRange,
    firstUseCases: values.firstUseCases,
    contactName: values.contactName.trim(),
    contactEmail: values.contactEmail.trim().toLowerCase(),
    contactRole,
  };

  const country = values.primaryMarketCountry.trim();
  if (country) payload.primaryMarketCountry = country;

  const notes = values.notes.trim();
  if (notes) payload.notes = notes;

  return payload;
}

function groupOf(field: Field): GroupId {
  return GROUP_IDS.find((group) => GROUP_FIELDS[group].includes(field)) ?? "agency";
}

function firstErrorField(errors: Errors): Field | null {
  for (const group of GROUP_IDS) {
    for (const field of GROUP_FIELDS[group]) {
      if (errors[field]) return field;
    }
  }
  return null;
}

/** The settled text for a group, from what was typed. */
function settledRows(group: GroupId, values: FormValues): Array<{ term: string; value: string }> {
  switch (group) {
    case "agency":
      return [
        { term: FIELD_COPY.agencyName.term, value: values.agencyName.trim() },
        { term: FIELD_COPY.websiteUrl.term, value: values.websiteUrl.trim() },
      ];
    case "profile":
      return [
        {
          term: FIELD_COPY.primaryMarketCity.term,
          value: [values.primaryMarketCity.trim(), values.primaryMarketCountry.trim()]
            .filter(Boolean)
            .join(", "),
        },
        { term: FIELD_COPY.agencyType.term, value: values.agencyType },
        { term: FIELD_COPY.primaryBoards.term, value: values.primaryBoards.join(", ") },
        { term: FIELD_COPY.rosterSizeRange.term, value: values.rosterSizeRange },
        { term: FIELD_COPY.teamSizeRange.term, value: values.teamSizeRange },
      ];
    case "contact":
      return [
        { term: FIELD_COPY.contactName.term, value: values.contactName.trim() },
        { term: FIELD_COPY.contactEmail.term, value: values.contactEmail.trim() },
        {
          term: FIELD_COPY.contactRole.term,
          value:
            values.contactRole === "Other" ? values.contactRoleOther.trim() : values.contactRole,
        },
      ];
    case "use":
      return [
        { term: FIELD_COPY.firstUseCases.term, value: values.firstUseCases.join(", ") },
        ...(values.notes.trim()
          ? [{ term: FIELD_COPY.notes.term, value: values.notes.trim() }]
          : []),
      ];
  }
}

export function RequestLedger({
  onEnter,
  onSent,
}: {
  onEnter: () => void;
  onSent: (payload: AgencyAccessRequest) => void;
}) {
  const { session, isAuthenticated, logout, refresh, dashboardHref } = usePholioAuth();
  const reduce = useReducedMotion();

  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Errors>({});
  /** The group being drawn up now. */
  const [open, setOpen] = useState<GroupId>("agency");
  /** How far the request has been drawn up; groups past this are not on the page. */
  const [reached, setReached] = useState(0);
  const [status, setStatus] = useState<"idle" | "pending" | "sent">("idle");
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [sent, setSent] = useState<AgencyAccessRequest | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  const groupRefs = useRef<Partial<Record<GroupId, HTMLElement | null>>>({});
  /** Set when a group opens, so the effect below can bring it into view once. */
  const pendingFocus = useRef<{ group: GroupId; field?: Field } | null>(null);

  const openIndex = GROUP_IDS.indexOf(open);

  /* Bring a newly opened group into view and put the caret in its first
     control, after it has mounted. Focus never moves the page itself; the
     scroll is the one deliberate move, and reduced motion makes it a jump. */
  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    const node = groupRefs.current[target.group];
    if (!node) return;
    node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    const field = target.field ?? GROUP_FIELDS[target.group][0];
    const control = document.getElementById(field);
    if (control instanceof HTMLElement) {
      const delay = reduce ? 0 : 420;
      const timer = window.setTimeout(() => control.focus({ preventScroll: true }), delay);
      return () => window.clearTimeout(timer);
    }
  }, [open, reduce]);

  const setField = useCallback(<K extends Field>(field: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  function openGroup(group: GroupId, field?: Field) {
    pendingFocus.current = { group, field };
    setOpen(group);
  }

  /** Continue: validate the open group; settle it; open the next unfinished one. */
  function advance() {
    if (status === "pending") return;
    const groupErrors = validateGroup(open, values);
    if (Object.keys(groupErrors).length > 0) {
      /* The group's fresh result replaces its old one outright, so a field
         that stopped being wrong (a role no longer "Other") is not still
         marked when it comes back. */
      setErrors((prev) => {
        const next = { ...prev };
        for (const field of GROUP_FIELDS[open]) delete next[field];
        return { ...next, ...groupErrors };
      });
      setFormMessage(FORM_MESSAGES.validation);
      const first = firstErrorField(groupErrors);
      if (first) document.getElementById(first)?.focus();
      return;
    }
    setFormMessage(null);

    if (openIndex < reached) {
      /* Reopened an earlier group: on to the next group that is still wrong
         (a server can fault two groups at once), else back to the frontier. */
      const stillWrong = GROUP_IDS.find(
        (group, index) =>
          index > openIndex &&
          index <= reached &&
          GROUP_FIELDS[group].some((field) => errors[field]),
      );
      openGroup(
        stillWrong ?? GROUP_IDS[reached],
        stillWrong ? GROUP_FIELDS[stillWrong].find((field) => errors[field]) : undefined,
      );
      return;
    }
    if (openIndex === 0) onEnter();
    const next = openIndex + 1;
    setReached(next);
    openGroup(GROUP_IDS[next]);
  }

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await logout();
      await refresh();
    } finally {
      setSigningOut(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending") return;

    /* Enter inside an earlier group continues; only the last group sends. */
    if (open !== "use") {
      advance();
      return;
    }

    if (values.refcode.trim().length > 0) {
      const decoy = buildPayload(values);
      setSent(decoy);
      setStatus("sent");
      onSent(decoy);
      return;
    }

    const allErrors: Errors = {};
    for (const group of GROUP_IDS) Object.assign(allErrors, validateGroup(group, values));
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setFormMessage(FORM_MESSAGES.validation);
      const first = firstErrorField(allErrors);
      if (first) openGroup(groupOf(first), first);
      return;
    }

    const payload = buildPayload(values);
    setStatus("pending");
    setFormMessage(null);

    const result = await submitAgencyAccessRequest(payload);

    if (result.ok) {
      setSent(payload);
      setStatus("sent");
      onSent(payload);
      return;
    }

    if (result.kind === "validation") {
      /* The server's set replaces ours outright. When the role was typed
         under "Other", its error belongs to the text field the user can fix. */
      const nextErrors = { ...result.errors } as Errors;
      if (values.contactRole === "Other" && nextErrors.contactRole) {
        nextErrors.contactRoleOther = nextErrors.contactRole;
        delete nextErrors.contactRole;
      }
      setErrors(nextErrors);
      setFormMessage(FORM_MESSAGES.validation);
      const first = firstErrorField(nextErrors);
      if (first) openGroup(groupOf(first), first);
      setStatus("idle");
      return;
    }

    setFormMessage(result.message);
    setStatus("idle");
  }

  /* ── Already inside ─────────────────────────────────────────────────── */

  if (isAuthenticated && session?.role === "AGENCY") {
    return (
      <section id="request" className="scroll-mt-28">
        <h2 className="font-editorial text-3xl" style={{ color: "var(--type)" }}>
          {ALREADY_ACCESS.heading}
        </h2>
        <p
          className="mt-4 max-w-xl font-sans text-base font-light leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {session.user?.email ? `${ALREADY_ACCESS.signedInAs(session.user.email)} ` : ""}
          {ALREADY_ACCESS.requestsAreFor}
        </p>
        <div className="mt-8">
          <ActionLink href={dashboardHref}>{ALREADY_ACCESS.openDashboard}</ActionLink>
        </div>
        <QuietAction onClick={handleSignOut} disabled={signingOut} className="mt-6 block">
          {ALREADY_ACCESS.signOutPrompt}
        </QuietAction>
      </section>
    );
  }

  /* ── Received: the record, as sent. The title is the page's (index.tsx). ── */

  if (status === "sent" && sent) {
    return (
      <section id="request" className="scroll-mt-28">
        <Arrive>
          {GROUP_IDS.map((group, index) => (
            <SettledGroup key={group} rows={settledRows(group, values)} first={index === 0} />
          ))}
          <Link
            href="/"
            className="mt-6 inline-block font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-(--type) transition-colors duration-300 hover:text-(--gold)"
          >
            {SUCCESS.backToPholio}
          </Link>
        </Arrive>
      </section>
    );
  }

  /* ── The request ────────────────────────────────────────────────────── */

  const groupsOnPage = GROUP_IDS.slice(0, reached + 1);
  const describe = (field: Field) => `${field}-term`;

  return (
    <form id="request" noValidate onSubmit={handleSubmit} aria-busy={status === "pending"}>
      <span role="status" className="sr-only">
        {status === "pending" ? ACTIONS.submitPendingLabel : ""}
      </span>
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: -10000, width: 1, height: 1, overflow: "hidden" }}
      >
        <input
          type="text"
          name="refcode"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={values.refcode}
          onChange={(event) => setField("refcode", event.target.value)}
        />
      </div>

      {groupsOnPage.map((group, index) => {
        if (group !== open) {
          /* The frontier has never been completed; while an earlier group is
             reopened it is not on the page, and its values wait. */
          if (index === reached) return null;
          return (
            <SettledGroup
              key={group}
              rows={settledRows(group, values)}
              first={index === 0}
              onChange={() => openGroup(group)}
            />
          );
        }

        const isLast = group === "use";
        const label = isLast
          ? status === "pending"
            ? ACTIONS.submitPendingLabel
            : ACTIONS.submitLabel
          : ACTIONS.continueLabel;

        return (
          <Arrive key={group}>
            <section
              ref={(node) => {
                groupRefs.current[group] = node;
              }}
              className={`scroll-mt-40 ${index === 0 ? "" : "border-t pt-10 md:pt-12"}`}
              style={{ borderColor: "var(--hair)" }}
            >
              <div className="space-y-9 md:space-y-10">
                {group === "agency" && (
                  <>
                    <Row
                      term={FIELD_COPY.agencyName.term}
                      htmlFor="agencyName"
                      termId={describe("agencyName")}
                      info={FIELD_COPY.agencyName.info}
                    >
                      <TypesetInput
                        name="agencyName"
                        size="door"
                        autoComplete="organization"
                        maxLength={FIELD_LIMITS.agencyName}
                        required
                        value={values.agencyName}
                        error={errors.agencyName}
                        onChange={(value) => setField("agencyName", value)}
                        onEnter={advance}
                      />
                    </Row>
                    <Row term={FIELD_COPY.websiteUrl.term} htmlFor="websiteUrl" termId={describe("websiteUrl")} info={FIELD_COPY.websiteUrl.info}>
                      <TypesetInput
                        name="websiteUrl"
                        noteId={noteIdFor(describe("websiteUrl"))}
                        size="door"
                        inputMode="url"
                        autoComplete="url"
                        maxLength={FIELD_LIMITS.websiteUrl}
                        required
                        value={values.websiteUrl}
                        error={errors.websiteUrl}
                        onChange={(value) => setField("websiteUrl", value)}
                        onEnter={advance}
                      />
                    </Row>
                  </>
                )}

                {group === "profile" && (
                  <>
                    <Row
                      term={FIELD_COPY.primaryMarketCity.term}
                      htmlFor="primaryMarketCity"
                      termId={describe("primaryMarketCity")}
                      info={FIELD_COPY.primaryMarketCity.info}
                    >
                      <TypesetInput
                        name="primaryMarketCity"
                        noteId={noteIdFor(describe("primaryMarketCity"))}
                        autoComplete="address-level2"
                        maxLength={FIELD_LIMITS.primaryMarketCity}
                        required
                        value={values.primaryMarketCity}
                        error={errors.primaryMarketCity}
                        onChange={(value) => setField("primaryMarketCity", value)}
                        onEnter={advance}
                      />
                    </Row>
                    <Row
                      term={FIELD_COPY.primaryMarketCountry.term}
                      htmlFor="primaryMarketCountry"
                      termId={describe("primaryMarketCountry")}
                      info={FIELD_COPY.primaryMarketCountry.info}
                      optional
                    >
                      <TypesetInput
                        name="primaryMarketCountry"
                        autoComplete="country-name"
                        maxLength={FIELD_LIMITS.primaryMarketCountry}
                        value={values.primaryMarketCountry}
                        error={errors.primaryMarketCountry}
                        onChange={(value) => setField("primaryMarketCountry", value)}
                        onEnter={advance}
                      />
                    </Row>
                    <Row
                      term={FIELD_COPY.agencyType.term}
                      termId={describe("agencyType")}
                      info={FIELD_COPY.agencyType.info}
                    >
                      <Choice
                        mode="single"
                        name="agencyType"
                        labelledById={describe("agencyType")}
                        options={AGENCY_TYPES}
                        prompt={FIELD_COPY.agencyType.prompt}
                        value={values.agencyType}
                        error={errors.agencyType}
                        onChange={(value) => setField("agencyType", value as string)}
                      />
                    </Row>
                    <Row term={FIELD_COPY.primaryBoards.term} termId={describe("primaryBoards")} info={FIELD_COPY.primaryBoards.info}>
                      <Choice
                        mode="multi"
                        name="primaryBoards"
                        labelledById={describe("primaryBoards")}
                        options={BOARDS}
                        noteId={noteIdFor(describe("primaryBoards"))}
                        prompt={FIELD_COPY.primaryBoards.prompt}
                        value={values.primaryBoards}
                        error={errors.primaryBoards}
                        onChange={(value) => setField("primaryBoards", value as string[])}
                      />
                    </Row>
                    <Row term={FIELD_COPY.rosterSizeRange.term} termId={describe("rosterSizeRange")} info={FIELD_COPY.rosterSizeRange.info}>
                      <Choice
                        mode="single"
                        voice="figures"
                        name="rosterSizeRange"
                        labelledById={describe("rosterSizeRange")}
                        options={ROSTER_SIZES}
                        noteId={noteIdFor(describe("rosterSizeRange"))}
                        prompt={FIELD_COPY.rosterSizeRange.prompt}
                        value={values.rosterSizeRange}
                        error={errors.rosterSizeRange}
                        onChange={(value) => setField("rosterSizeRange", value as string)}
                      />
                    </Row>
                    <Row term={FIELD_COPY.teamSizeRange.term} termId={describe("teamSizeRange")} info={FIELD_COPY.teamSizeRange.info}>
                      <Choice
                        mode="single"
                        voice="figures"
                        name="teamSizeRange"
                        labelledById={describe("teamSizeRange")}
                        options={TEAM_SIZES}
                        noteId={noteIdFor(describe("teamSizeRange"))}
                        prompt={FIELD_COPY.teamSizeRange.prompt}
                        value={values.teamSizeRange}
                        error={errors.teamSizeRange}
                        onChange={(value) => setField("teamSizeRange", value as string)}
                      />
                    </Row>
                  </>
                )}

                {group === "contact" && (
                  <>
                    <Row
                      term={FIELD_COPY.contactName.term}
                      htmlFor="contactName"
                      termId={describe("contactName")}
                      info={FIELD_COPY.contactName.info}
                    >
                      <TypesetInput
                        name="contactName"
                        autoComplete="name"
                        maxLength={FIELD_LIMITS.contactName}
                        required
                        value={values.contactName}
                        error={errors.contactName}
                        onChange={(value) => setField("contactName", value)}
                        onEnter={advance}
                      />
                    </Row>
                    <Row term={FIELD_COPY.contactEmail.term} htmlFor="contactEmail" termId={describe("contactEmail")} info={FIELD_COPY.contactEmail.info}>
                      <TypesetInput
                        name="contactEmail"
                        noteId={noteIdFor(describe("contactEmail"))}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        maxLength={FIELD_LIMITS.contactEmail}
                        required
                        value={values.contactEmail}
                        error={errors.contactEmail}
                        onChange={(value) => setField("contactEmail", value)}
                        onEnter={advance}
                      />
                    </Row>
                    <Row
                      term={FIELD_COPY.contactRole.term}
                      termId={describe("contactRole")}
                      info={FIELD_COPY.contactRole.info}
                    >
                      <Choice
                        mode="single"
                        name="contactRole"
                        labelledById={describe("contactRole")}
                        options={CONTACT_ROLES}
                        prompt={FIELD_COPY.contactRole.prompt}
                        value={values.contactRole}
                        error={errors.contactRole}
                        onChange={(value) => setField("contactRole", value as string)}
                      />
                    </Row>
                    {values.contactRole === "Other" && (
                      <Row
                        term={FIELD_COPY.contactRoleOther.term}
                        htmlFor="contactRoleOther"
                        termId={describe("contactRoleOther")}
                      >
                        <TypesetInput
                          name="contactRoleOther"
                          maxLength={FIELD_LIMITS.contactRole}
                          required
                          value={values.contactRoleOther}
                          error={errors.contactRoleOther}
                          onChange={(value) => setField("contactRoleOther", value)}
                          onEnter={advance}
                        />
                      </Row>
                    )}
                  </>
                )}

                {group === "use" && (
                  <>
                    <Row
                      term={FIELD_COPY.firstUseCases.term}
                      termId={describe("firstUseCases")}
                      info={FIELD_COPY.firstUseCases.info}
                    >
                      <Choice
                        mode="multi"
                        name="firstUseCases"
                        labelledById={describe("firstUseCases")}
                        options={USE_CASES}
                        prompt={FIELD_COPY.firstUseCases.prompt}
                        value={values.firstUseCases}
                        error={errors.firstUseCases}
                        onChange={(value) => setField("firstUseCases", value as string[])}
                      />
                    </Row>
                    <Row term={FIELD_COPY.notes.term} htmlFor="notes" termId={describe("notes")} optional info={FIELD_COPY.notes.info}>
                      <TypesetArea
                        name="notes"
                        noteId={noteIdFor(describe("notes"))}
                        maxLength={FIELD_LIMITS.notes}
                        value={values.notes}
                        error={errors.notes}
                        onChange={(value) => setField("notes", value)}
                      />
                    </Row>
                  </>
                )}
              </div>

              <div className={`${ROW_GRID} mt-12`}>
                <span className="hidden md:block" aria-hidden="true" />
                <div>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    {isLast ? (
                      <Action type="submit" pending={status === "pending"}>
                        {label}
                      </Action>
                    ) : (
                      <Action onClick={advance}>{label}</Action>
                    )}
                    {isLast && (
                      <span className="font-sans text-[13px]" style={{ color: "var(--muted)" }}>
                        {SEND_NOTE}
                      </span>
                    )}
                  </div>
                  {formMessage && (
                    <p role="alert" className="mt-4 font-sans text-[13px]" style={{ color: "var(--type)" }}>
                      {formMessage}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </Arrive>
        );
      })}
    </form>
  );
}

/* ── Rows ───────────────────────────────────────────────────────────────── */

function Row({
  term,
  termId,
  htmlFor,
  required,
  optional,
  info,
  children,
}: {
  term: string;
  termId: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  info?: string;
  children: React.ReactNode;
}) {
  const isRequired = required ?? !optional;
  return (
    <div className={ROW_GRID}>
      <Term id={termId} htmlFor={htmlFor} required={isRequired} optional={optional} info={info}>
        {term}
      </Term>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/**
 * A group that has been drawn up. The same rows, the answers as text, and one
 * quiet action to reopen it. On the received page there is no action.
 */
function SettledGroup({
  rows,
  first,
  onChange,
}: {
  rows: Array<{ term: string; value: string }>;
  first: boolean;
  onChange?: () => void;
}) {
  return (
    <section
      className={`relative ${first ? "" : "border-t pt-8 md:pt-9"} pb-8 md:pb-9`}
      style={{ borderColor: "var(--hair)" }}
    >
      <div className="space-y-5">
        {rows.map((row) => (
          <div key={row.term} className={ROW_GRID}>
            <span className="block font-sans text-[14px] leading-[1.4] md:pt-[0.2em]" style={{ color: "var(--muted)" }}>
              {row.term}
            </span>
            <div className="min-w-0 md:pr-24">
              <Answer>{row.value}</Answer>
            </div>
          </div>
        ))}
      </div>
      {onChange && (
        <div className={`absolute right-0 ${first ? "top-0" : "top-8 md:top-9"}`}>
          <QuietAction onClick={onChange}>{ACTIONS.changeLabel}</QuietAction>
        </div>
      )}
    </section>
  );
}
