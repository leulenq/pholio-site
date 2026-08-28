---
name: pholio-site-language
description: The language system for Pholio's marketing site (pholio-site, www.pholio.studio). Use whenever writing, reviewing, naming, or judging ANY user-facing language on the marketing surface - headlines, heroes, section copy, CTAs, metadata, requirement pages, agency-facing pages, parent/guardian copy, footer, About, pricing/Studio+ copy. Covers persuasion, positioning, storytelling, trust, and conversion done honestly. Also use when a copy problem is actually a proposition or information-architecture problem. Product/in-app copy belongs to pholio-app-language in the pholio-app repo.
---

# Pholio site language

The marketing surface's job: make the right audience understand why Pholio
matters and act, without becoming manipulative, gimmicky, scammy, or
generic. It persuades as **the honest insider**: every persuasion mechanism
in this system was screened against the banned levers (no scarcity, no
urgency, no flattery, no outcome promises), and several exist precisely to
replace one.

This skill and `pholio-app-language` (in pholio-app) are two registers of
one brand. `references/foundation.md` §4 is the contract for what is
identical across both and what deliberately differs. This skill owns the
*why* surfaces; the app skill owns the *what now* surfaces. Marketing
language never leaks into functional product UI; product limits never get
sold here except on the labeled pricing surfaces.

**Load before writing:**

| Task | Read |
|---|---|
| Anything at all | `references/foundation.md` (voice, precedence, contract), `references/banned-language.md` (the screen) |
| How to persuade on this surface | `references/persuasion.md` |
| Registers, sentence tools, page architecture, CTAs | `references/site-mechanics.md` |
| Industry terms, glossing, stats | `references/lexicon.md` |
| Product names, features, compliance facts, pricing | `references/product-facts.md` |
| Understanding the reader | `references/audience.md` |
| Critiquing existing copy | `references/judgment.md` |

## The marketing principles (on top of the shared spine)

The shared principles live in foundation.md §3. The site adds:

1. **Lead with mechanism, never outcome.** The constraint made house
   style: say what the product does, never what will happen to the
   reader.
2. **Spend the copy budget on anxiety, not incentive.** Motivation is
   fixed and incentives are banned; the winnable terms are clarity and
   the suspicious reader's unasked questions, answered where they arise
   (Why free? Who pays? Who sees my photos? What about minors?).
3. **Steelman the doubt; blemish last.** Two-sided pages beat one-sided
   with this audience. Voluntary, small, strength-correlated admissions.
4. **Standards, never exclusivity; readiness, never urgency.** Gate work,
   not people; publish the bar and the way to meet it. The only clock on
   the site is the reader's own.
5. **The artifact argues; the success arc is banned.** Real cards, real
   specs, real dated requirements. No fictional or forward-looking talent
   narratives.
6. **Pholio is never the subject of a transformation sentence.** The
   talent applies; the agency decides; Pholio makes materials and rails.
7. **Teach the scam; let the law name the villain.** Inoculation content
   is first-class marketing. Name practices, never firms.
8. **Every trust claim is a costly signal or a checkable fact.** Show the
   labor, with dates. Precise real numbers over round ones. Explain
   "free" every time it appears.
9. **Clarity before beauty.** Editorial restraint must still pass the
   five-second test: what this is, who it is for, what it costs, first
   screen. Restraint is a style; vagueness is a bug.
10. **Match the page to the awareness stage.** Problem-aware pages are
    useful before they ask anything; solution-aware pages compare
    approaches honestly; no page assumes an already-convinced reader.

## Writing procedure

1. **Frame:** surface, primary audience (and who else reads it), the one
   job, the awareness stage. Assign the register from site-mechanics.md
   §6.
2. **Gather facts:** shipped labels, real numbers, dates, mechanisms
   (product-facts.md or code). A needed fact that does not exist is a
   stop, not an invention.
3. **Check the proposition:** can the claim be stated as a mechanism
   Pholio controls, cashable by a product screen (the aspiration
   ceiling)? If not, the problem is above copy; say so (judgment.md L4).
4. **Draft** in the assigned register with the toolkit
   (site-mechanics.md §3), the persuasion prescriptions
   (persuasion.md §6), native vocabulary (lexicon.md), mined audience
   diction (never mined hopes).
5. **Screen:** banned-language.md §7, the dark-pattern lint
   (persuasion.md §3), then the pre-flight below.
6. **Read every string cold, once, alone.**

## Judging procedure

Use `references/judgment.md`: the six-level ladder (wording, register,
claim, proposition, IA, product truth), deepest level reported, severity
order compliance > truth > trust > fluency > polish, exact strings quoted,
fixes at the right level, Level 4+ decisions named as the owner's.

## Pre-flight (mechanical)

- [ ] No outcome promise or implication, in any wording (speech-act test).
- [ ] No payment-to-reach implication; Studio+ sold only on labeled
      pricing surfaces, as craft and property.
- [ ] No urgency, scarcity, flattery, dream vocabulary, exclusivity, or
      dark-pattern shape (countdowns, confirmshaming, fake activity).
- [ ] Every "free" explained within reach; every "verified/vetted" with
      its mechanism; every number real, precise, sourced; every date
      maintained.
- [ ] Five-second test passes on the first screen.
- [ ] One page, one job; register matches the map; awareness stage
      matches the page.
- [ ] Owner display rules hold: one CTA label, one verdict word, 20-word
      support cap, zero em-dashes, no eyebrows, no emoji, no exclamation.
- [ ] "Recipients" where contract scope applies; "guardian" not "parent";
      no entity/address/founding-date implications.
- [ ] Terms native and exact; glossing matches the audience; stats in
      convention order.
- [ ] Something true is refused or confessed where the surface carries
      trust weight.
- [ ] Every promise has a product screen that cashes it.
- [ ] Every string read cold.

## Scope notes

- The design system owns display devices (the gold italic verdict word,
  mono-on-real-data, the banned-UI list). This skill supplies words;
  `docs/design-language/` governs their setting; `lessons.md` outranks
  everything including this skill, and new owner corrections are written
  back there.
- The legal corpus is versioned contract text: never edited for style.
- When a brief asks for banned language, name the rule and offer the
  alternative before writing anything.
