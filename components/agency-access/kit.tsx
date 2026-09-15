"use client";

/**
 * The request page's form language.
 *
 * Every field is one line: a term, a rule, a value. A typed answer is set in
 * the display serif; a chosen answer is set the same way, and its options
 * exist only in a panel that opens while the choice is being made. So the
 * form reads as the record it will become before it is filled, and the
 * states a field can be in are carried by the one rule and the one value:
 *
 *   unanswered     the hairline, and a muted prompt where the value will go
 *   interacting    the rule turns gold, the term turns gold, a panel is open
 *   answered       the value, in ink, in the serif
 *   required       the term carries a gold asterisk
 *   optional       the term is muted with no asterisk
 *   wrong          the rule turns ink and one line says what is wrong
 *
 * Explanation is available exactly when someone wants it: a field that needs
 * a note carries a small mark beside its term that opens the note on hover,
 * focus or tap, and the note is also the control's accessible description,
 * so it is never hover-only. Nothing sits permanently under a field except
 * an error.
 *
 * Every colour is a CSS variable set on the page root, because the page's
 * paper changes while the request is being drawn up (see index.tsx).
 *
 * Every control that can hold a value gets an `id` equal to its field name,
 * so the submit handler can focus the first invalid control by id.
 */

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { ChevronDown, Info } from "lucide-react";

import { ACTIONS, MARKS } from "./content";

/* ── Row grammar ──────────────────────────────────────────────────────── */

/** Term left, value right. The same grid whether the value is a control or
    a settled answer. `group` lets the term follow the field's focus. */
export const ROW_GRID =
  "group grid grid-cols-1 gap-y-3 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-x-12";

/** Inside the lit room every answer is this size; the door's two are larger. */
const ANSWER_SIZE = { fontSize: "clamp(1.5rem, 2.2vw, 2rem)", lineHeight: 1.2 };
const DOOR_SIZE = { fontSize: "clamp(1.6rem, 2.6vw, 2.4rem)", lineHeight: 1.2 };

const RULE_TRANSITION = "border-color 0.32s cubic-bezier(0.22,1,0.36,1)";

/** The rule under an answer: gold while it is being worked on, ink while it
    is wrong, the hairline otherwise. */
const ruleColor = (active: boolean, error?: string) =>
  active ? "var(--gold)" : error ? "var(--type)" : "var(--rule)";

function describedBy(...ids: Array<string | undefined>): string | undefined {
  const list = ids.filter(Boolean);
  return list.length ? list.join(" ") : undefined;
}

/** The id of a term's note, shared by the mark that opens it and the control
    it describes. */
export const noteIdFor = (termId: string) => `${termId}-note`;

/**
 * The term, and the two things that can sit with it, in order of weight.
 *
 * The label is the only thing set in ink. The required mark is part of the
 * word, not a badge beside it: an 11px superscript asterisk in the label's
 * own colour at 70%, so `Agency*` reads as one word and the mark is found by
 * anyone looking for it and noticed by no one else. Optional terms are muted
 * and carry no mark; their absence of the mark is the convention.
 *
 * The information mark is a control, so it stands apart from the word (a
 * clear gap), smaller than the type, and rests at 75%. It comes up to full
 * presence when the row is hovered or has focus, when it is hovered or
 * focused itself, and while its note is open. It is available, not
 * mandatory.
 */
export function Term({
  id,
  htmlFor,
  required,
  optional,
  info,
  children,
}: {
  id: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  /** The note the information mark opens; its id is `noteIdFor(id)`. */
  info?: string;
  children: string;
}) {
  const className =
    "font-sans text-[14px] leading-[1.4] transition-colors duration-300 group-focus-within:text-(--gold)";
  const color = optional ? "var(--muted)" : "var(--type)";
  const labelContent = (
    <>
      {children}
      {required && (
        <span
          aria-hidden="true"
          className="relative -top-[0.35em] ml-[1px] select-none text-[11px] leading-none opacity-70"
        >
          *
        </span>
      )}
    </>
  );

  const label = htmlFor ? (
    <label id={id} htmlFor={htmlFor} className={className} style={{ color }}>
      {labelContent}
    </label>
  ) : (
    <span id={id} className={className} style={{ color }}>
      {labelContent}
    </span>
  );

  return (
    <div className="flex items-center gap-2.5 md:pt-[0.55em]">
      {label}
      {info && (
        <InfoMark noteId={noteIdFor(id)} term={children}>
          {info}
        </InfoMark>
      )}
    </div>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-3 font-sans text-[13px]" style={{ color: "var(--type)" }}>
      {children}
    </p>
  );
}

/* ── Panels and marks ─────────────────────────────────────────────────── */

/** A small solid panel on the paper: the header's own panel treatment, a
    hairline and no shadow. Used by the note and by the option list. */
const PANEL_CLASS = "border font-sans";
const PANEL_STYLE = {
  background: "var(--panel)",
  borderColor: "var(--hair)",
  color: "var(--type)",
} as const;

/**
 * Closes on Escape and on a pointer landing outside `ref`. The handlers are
 * read through a ref so the document listeners are attached once per open,
 * not once per render.
 */
function useDismiss(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
  handlers: { onOutside: () => void; onEscape: () => void },
) {
  const latest = useRef(handlers);
  useEffect(() => {
    latest.current = handlers;
  });
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) latest.current.onOutside();
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") latest.current.onEscape();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, ref]);
}

/**
 * A mark that opens a note on hover, focus or tap. Hover and focus open it
 * for as long as they last; a click or tap pins it open until the next click,
 * Escape, or a pointer elsewhere. Pinning is what lets a tap on a phone (which
 * fires a hover first) and Enter on a keyboard (which fires a click on an
 * already-focused mark) both leave the note open rather than toggling it shut.
 * The note is always in the document as the mark's description; it is painted
 * only while open.
 */
function MarkWithNote({
  noteId,
  label,
  glyph,
  className = "",
  children,
}: {
  noteId: string;
  label: string;
  glyph: (open: boolean) => ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const [hovering, setHovering] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hovering || pinned;
  const ref = useRef<HTMLSpanElement>(null);
  const unpin = () => setPinned(false);
  useDismiss(pinned, ref, { onOutside: unpin, onEscape: unpin });

  return (
    <span ref={ref} className="relative inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-describedby={noteId}
        aria-expanded={open}
        onClick={() => setPinned((v) => !v)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => {
          setHovering(false);
          setPinned(false);
        }}
        className={`inline-flex h-5 w-4 items-center justify-center transition-colors duration-300 focus-visible:outline-none ${className}`}
        style={{ color: open ? "var(--gold)" : "var(--muted)" }}
      >
        {glyph(open)}
      </button>
      <span
        id={noteId}
        role="note"
        hidden={!open}
        className={`${PANEL_CLASS} absolute left-0 top-[calc(100%+4px)] z-30 w-max max-w-[38ch] px-3.5 py-2.5 text-[13px] font-light leading-relaxed`}
        style={PANEL_STYLE}
      >
        {children}
      </span>
    </span>
  );
}

/** The information mark. The note it opens is the field's description. */
function InfoMark({ noteId, term, children }: { noteId: string; term: string; children: ReactNode }) {
  return (
    <MarkWithNote
      noteId={noteId}
      label={`${MARKS.aboutPrefix}${term}`}
      glyph={() => <Info size={12} strokeWidth={1.5} aria-hidden="true" />}
      className="opacity-75 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 hover:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100"
    >
      {children}
    </MarkWithNote>
  );
}

/* ── Typed answers ────────────────────────────────────────────────────── */

export function TypesetInput({
  name,
  type = "text",
  inputMode,
  autoComplete,
  maxLength,
  required,
  error,
  noteId,
  value,
  onChange,
  onEnter,
  size = "answer",
}: {
  name: string;
  type?: string;
  inputMode?: "text" | "email" | "url" | "tel";
  autoComplete?: string;
  maxLength?: number;
  required?: boolean;
  error?: string;
  /** The term's note, if it has one, so the control is described by it. */
  noteId?: string;
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  size?: "door" | "answer";
}) {
  const errorId = error ? `${name}-error` : undefined;
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        required={required}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && onEnter) {
            event.preventDefault();
            onEnter();
          }
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-describedby={describedBy(noteId, errorId)}
        aria-invalid={error ? true : undefined}
        className="block w-full border-0 border-b bg-transparent py-2 font-editorial outline-none"
        style={{
          ...(size === "door" ? DOOR_SIZE : ANSWER_SIZE),
          color: "var(--type)",
          caretColor: "var(--gold)",
          borderBottomColor: ruleColor(focused, error),
          transition: RULE_TRANSITION,
        }}
      />
      {error && <FieldError id={errorId as string}>{error}</FieldError>}
    </div>
  );
}

export function TypesetArea({
  name,
  maxLength,
  rows = 3,
  error,
  noteId,
  value,
  onChange,
}: {
  name: string;
  maxLength: number;
  rows?: number;
  error?: string;
  noteId?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const errorId = error ? `${name}-error` : undefined;
  const [focused, setFocused] = useState(false);
  const nearLimit = maxLength - value.length <= 50;

  return (
    <div>
      <textarea
        id={name}
        name={name}
        rows={rows}
        maxLength={maxLength}
        value={value}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-describedby={describedBy(noteId, errorId)}
        aria-invalid={error ? true : undefined}
        className="block w-full resize-none border-0 border-b bg-transparent py-2 font-editorial outline-none"
        style={{
          fontSize: "1.35rem",
          lineHeight: 1.4,
          color: "var(--type)",
          caretColor: "var(--gold)",
          borderBottomColor: ruleColor(focused, error),
          transition: RULE_TRANSITION,
        }}
      />
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          {error && <FieldError id={errorId as string}>{error}</FieldError>}
        </div>
        <span
          className="mt-3 shrink-0 font-mono text-[11px]"
          style={{ color: "var(--muted)" }}
          aria-live={nearLimit ? "polite" : undefined}
        >
          {value.length}
          {ACTIONS.counterSeparator}
          {maxLength}
        </span>
      </div>
    </div>
  );
}

/* ── Chosen answers ───────────────────────────────────────────────────── */

/**
 * A choice, single or multiple. At rest it is a line like any other: the
 * chosen value in the serif, or a muted prompt. Open, it is a panel of rows,
 * each wearing the square, filled when chosen. The panel's first line says
 * whether one or several may be chosen. Keyboard: arrows move, Space or
 * Enter chooses, Escape closes and returns to the line.
 */
export function Choice({
  mode,
  name,
  voice = "words",
  options,
  labelledById,
  noteId,
  prompt,
  error,
  value,
  onChange,
}: {
  mode: "single" | "multi";
  name: string;
  voice?: "words" | "figures";
  options: readonly string[];
  labelledById: string;
  noteId?: string;
  prompt: string;
  error?: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}) {
  const errorId = error ? `${name}-error` : undefined;
  const listId = `${name}-list`;
  const modeId = `${name}-mode`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const chosen = (option: string) =>
    mode === "single" ? value === option : (value as string[]).includes(option);
  const display = mode === "single" ? (value as string) : (value as string[]).join(", ");

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) trigger.current?.focus({ preventScroll: true });
  };
  useDismiss(open, root, { onOutside: () => close(false), onEscape: () => close(true) });

  /* The panel opens on the chosen row where there is one. */
  const show = () => {
    const first =
      mode === "single"
        ? options.indexOf(value as string)
        : options.findIndex((option) => (value as string[]).includes(option));
    setActive(Math.max(0, first));
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const node = list.current?.children[active] as HTMLElement | undefined;
    node?.focus({ preventScroll: true });
  }, [open, active]);

  const choose = (option: string) => {
    if (mode === "single") {
      onChange(option);
      close(true);
      return;
    }
    const current = value as string[];
    onChange(
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  };

  const onListKey = (event: KeyboardEvent<HTMLUListElement>) => {
    const last = options.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((i) => (i >= last ? 0 : i + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((i) => (i <= 0 ? last : i - 1));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(last);
        break;
      case " ":
      case "Enter":
        event.preventDefault();
        choose(options[active]);
        break;
      case "Tab":
        close(false);
        break;
    }
  };

  const wordClass =
    voice === "figures" ? "font-mono text-[14px] tracking-[0.06em]" : "font-editorial";
  const wordStyle =
    voice === "figures" ? { lineHeight: 1.2 } : { fontSize: "1.2rem", lineHeight: 1.25 };

  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        type="button"
        id={name}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${labelledById} ${name}-value`}
        aria-describedby={describedBy(noteId, errorId)}
        onClick={() => (open ? close(false) : show())}
        onKeyDown={(event) => {
          if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !open) {
            event.preventDefault();
            show();
          }
        }}
        className="flex w-full items-end justify-between gap-4 border-0 border-b bg-transparent py-2 text-left outline-none"
        style={{ borderBottomColor: ruleColor(open, error), transition: RULE_TRANSITION }}
      >
        <span
          id={`${name}-value`}
          className="font-editorial min-w-0 break-words"
          style={{ ...ANSWER_SIZE, color: display ? "var(--type)" : "var(--muted)" }}
        >
          {display || prompt}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
          className="mb-[0.5em] shrink-0 transition-colors duration-300"
          style={{ color: open ? "var(--gold)" : "var(--muted)" }}
        />
      </button>

      {open && (
        <div
          className={`${PANEL_CLASS} absolute left-0 right-0 top-[calc(100%+8px)] z-30`}
          style={PANEL_STYLE}
        >
          <p
            id={modeId}
            className="px-4 pb-2 pt-3 text-[12px] font-light"
            style={{ color: "var(--muted)" }}
          >
            {mode === "single" ? ACTIONS.chooseOne : ACTIONS.chooseAny}
          </p>
          <ul
            ref={list}
            id={listId}
            role="listbox"
            aria-labelledby={labelledById}
            aria-describedby={modeId}
            aria-multiselectable={mode === "multi" ? true : undefined}
            onKeyDown={onListKey}
            className="max-h-[60vh] overflow-y-auto pb-2"
          >
            {options.map((option, index) => {
              const isChosen = chosen(option);
              return (
                <li
                  key={option}
                  role="option"
                  aria-selected={isChosen}
                  tabIndex={index === active ? 0 : -1}
                  onClick={() => choose(option)}
                  className="flex cursor-pointer items-center gap-4 px-4 py-2.5 outline-none transition-colors duration-150 hover:bg-(--panel-hover) focus:bg-(--panel-hover) md:py-2"
                >
                  <span
                    aria-hidden="true"
                    className="block h-[10px] w-[10px] shrink-0 border transition-colors duration-150"
                    style={{
                      borderColor: isChosen ? "var(--type)" : "var(--muted)",
                      background: isChosen ? "var(--type)" : "transparent",
                    }}
                  />
                  <span
                    className={wordClass}
                    style={{ ...wordStyle, color: isChosen ? "var(--type)" : "var(--muted)" }}
                  >
                    {option}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && <FieldError id={errorId as string}>{error}</FieldError>}
    </div>
  );
}

/* ── Settled answers ──────────────────────────────────────────────────── */

/** A group's answers once it has been drawn up: the same row, the value set
    as text in the serif. */
export function Answer({ children }: { children: ReactNode }) {
  return (
    <p
      className="font-editorial break-words"
      style={{ fontSize: "clamp(1.2rem, 1.6vw, 1.5rem)", lineHeight: 1.3, color: "var(--type)" }}
    >
      {children}
    </p>
  );
}

/* ── Actions ──────────────────────────────────────────────────────────── */

/**
 * The one solid control on the page. It is the page's type colour filled,
 * so it inverts with the room: cream on velvet at the door, ink on paper
 * inside. Hover is a colour shift, never a scale.
 */
export function Action({
  type = "button",
  pending,
  onClick,
  children,
}: {
  type?: "button" | "submit";
  pending?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center justify-center font-sans text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 enabled:hover:text-(--gold-inverse) focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_var(--rule)] disabled:cursor-default disabled:opacity-50"
      style={{ padding: "15px 44px", background: "var(--type)", color: "var(--paper)" }}
    >
      {children}
    </button>
  );
}

export function ActionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center font-sans text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 hover:text-(--gold-inverse)"
      style={{ padding: "15px 44px", background: "var(--type)", color: "var(--paper)" }}
    >
      {children}
    </a>
  );
}

/** A quiet text action: the header index's clerical voice, as a control. */
export function QuietAction({
  onClick,
  disabled,
  children,
  className = "",
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`font-sans text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 enabled:hover:text-(--gold) focus-visible:text-(--gold) focus-visible:outline-none disabled:opacity-50 ${className}`}
      style={{ color: "var(--muted)" }}
    >
      {children}
    </button>
  );
}

/** A link whose feedback is colour and a 1px gold rule. */
export function RuleLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="underline underline-offset-4 transition-colors duration-300"
      style={{ color: "var(--gold)", textDecorationColor: "var(--rule)" }}
    >
      {children}
    </a>
  );
}
