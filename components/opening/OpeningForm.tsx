"use client";

import { useEffect, useState, type FormEvent } from "react";

import {
  EMAIL_MAX_LENGTH,
  EMAIL_PATTERN,
  fetchTalentLaunchStatus,
  submitLaunchNotify,
} from "@/lib/launch-notify";
import { PHOLIO_APP_ORIGIN } from "@/lib/pholio-app-origin";
import type { OpeningSource } from "@/lib/talent-launch";

type State = "idle" | "pending" | "done" | "invalid" | "failed" | "open";

/** The one field on /opening. Copy and its promise: lib/launch-notify.ts. */
export default function OpeningForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [source, setSource] = useState<OpeningSource>("talent");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("for") === "studio") setSource("studio");
    fetchTalentLaunchStatus().then((status) => {
      if (status?.open) setState("open");
    });
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) return setState("invalid");
    setState("pending");
    const result = await submitLaunchNotify(value, source);
    setState(result.ok ? "done" : result.kind === "validation" ? "invalid" : "failed");
  }

  if (state === "open") {
    return (
      <div className="op-form">
        <p className="op-note">Pholio is open.</p>
        <a className="op-act" href={`${PHOLIO_APP_ORIGIN}/onboarding`}>Apply free</a>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="op-form op-settled" aria-live="polite">
        <p className="op-field op-field--set">{email.trim()}</p>
        <p className="op-note">We will write once, on October 31.</p>
      </div>
    );
  }

  return (
    <form className="op-form" onSubmit={onSubmit} noValidate>
      <label className="op-label" htmlFor="op-email">Email</label>
      <input
        id="op-email"
        className="op-field"
        type="email"
        autoComplete="email"
        inputMode="email"
        maxLength={EMAIL_MAX_LENGTH}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (state === "invalid" || state === "failed") setState("idle");
        }}
        aria-invalid={state === "invalid"}
        aria-describedby="op-msg"
        required
      />
      <p id="op-msg" className="op-msg" aria-live="polite">
        {state === "invalid" && "Enter an email address."}
        {state === "failed" && "That didn't go through. Try again in a moment."}
      </p>
      {source === "studio" && (
        <p className="op-note">Studio+ starts the same day, with its fourteen days free.</p>
      )}
      <button className="op-act" type="submit" disabled={state === "pending"}>
        Email me on October 31
      </button>
    </form>
  );
}
