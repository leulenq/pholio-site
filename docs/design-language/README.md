# Design language

Four documents. Read in order the first time; after that, go to the one that
matches the task.

| | | |
|---|---|---|
| **01** | [Foundations](01-foundations.md) | Palette, type, field, furniture, motion, composition, copy. The system. |
| **02** | [Preserved surfaces](02-preserved-surfaces.md) | The four surfaces carried across the reset, with exact values. Foundations is derived from these. |
| **03** | [Banned UI](03-banned-ui.md) | 28 patterns that require human approval. The only text carried over from the previous site. |
| **04** | [Scroll craft](04-scroll-craft.md) | How to build scroll-driven sections that hold 60fps and mean something. |

Cross-repo contracts — auth, cookies, legal versioning — are in
[`../app-integration.md`](../app-integration.md), not here. They are not design
decisions and must not be changed as part of a visual change.

## The short version

The site is an editorial publication that behaves like a physical object.
Continuous paper rather than themed pages. Hairlines and negative space rather
than cards. Two type registers with nothing in between. Three colours, one of
which is a state and never a surface. Motion that only ever means arrival.

Prominence comes from colour, never from scale. That single rule kills the CTA
button, the feature card grid, and the oversized hero badge in one move, and it
is the fastest way to tell whether a composition belongs on this site.

## When these docs and a skill disagree

These docs win. The installed design skills are written for generic briefs and
will confidently suggest palettes, typefaces, and section shapes that are
off-brand here.

## When these docs and the code disagree

Say so. Do not silently follow either. A drift between the two is a bug in one
of them, and quietly picking a side is how the previous site accumulated the
contradictions that made this reset necessary.
