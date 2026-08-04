# CLAUDE.md

**Read [`AGENTS.md`](AGENTS.md) first. It is the operating contract for this
repo and it is not duplicated here.**

This file holds only the things specific to working with Claude Code in this
codebase.

---

## Order of operations

1. `AGENTS.md` — boundaries, structure, verification.
2. The design-language doc matching your task (the table in `AGENTS.md`).
3. `docs/design-language/03-banned-ui.md` — **always**, before writing any
   markup. It is 28 patterns, and most of them are the default output for their
   category, which means they are what you will produce if you do not check.

---

## The failure mode this repo was built to prevent

The previous site accumulated four sets of design directions, three retired
header variants, two retired footers, a prototypes folder, and 15,000 words of
notes describing decisions that had already been reversed. Agents reading it
produced confident work built on superseded premises.

So: **this repo's docs describe only what is true now.** There is no history in
them, no "we tried X and rejected it" narrative, and no alternatives folder. If
something is written down here, it is current. If it is not written down, it is
not established — ask rather than infer it from the archive.

Concretely, when you catch yourself about to:

- copy a pattern from `pholio-landing` → **stop**, it is the archive
- reconstruct a brand value from memory → **stop**, look it up in
  `02-preserved-surfaces.md`
- add a "supporting paragraph" under a headline → **stop**, read foundations §2
- reach for a card grid, an eyebrow label, or a CTA pill → **stop**, read the
  ban list

---

## Skills

Several design skills are installed. Two are worth knowing about here:

- **`design-taste-frontend`** — the general anti-slop frontend skill. Useful for
  the reasoning about layout diversification, image strategy, and AI tells.
  **Where it conflicts with this repo's docs, this repo wins** — it is written
  for generic briefs and will suggest palettes, fonts, and section shapes that
  are off-brand for Pholio. Notably it bans Inter, which this site uses
  deliberately as its clerical voice.
- **`high-end-visual-design`** — useful for spacing and hierarchy instincts,
  with the same precedence caveat.

Do not invoke image-generation skills to produce site imagery without asking.
Talent imagery on this site has a sanctioned source (`GET /api/public/home`,
which enforces minor-exclusion) and a compliance dimension.

---

## Verification, specifically

Typecheck and build passing means nothing about whether a scroll scene works.

For any visual change:

```bash
tmux new-session -d -s dev "npm run dev"
curl -s -o /dev/null -w "%{http_code}" localhost:3001
```

Then look at it. At a narrow viewport and a wide one. With
`prefers-reduced-motion` on and off. Scroll the whole page — the header samples
the paper beneath it and flips polarity mid-scroll, so a section with a
half-opaque background will visibly break the header two sections later.

## Committing

Never commit or push unless asked. If asked while on `main`, branch first.
