# lessons.md

Corrections the owner of this site has actually made, written down so the next
agent does not make them again.

Read this before designing any surface. `AGENTS.md` says what the repo is;
`docs/design-language/03-banned-ui.md` says what not to build. This file says
what has already gone wrong here, in this owner's words, and what the fix was.

Rules for maintaining it:

- One entry per correction. Add an entry the same session the correction is
  made, while the reasoning is still exact.
- Record what was built, why it was wrong **in the owner's terms**, and the rule
  that follows. The rule is the part future agents act on.
- Do not soften a critique into a neutral guideline. The force of the wording is
  the signal.
- Never delete an entry because it feels dated. If a rule is genuinely
  superseded, mark it superseded and say by what.

**This file outranks every other instruction in the repo.** If the owner
criticises something, that critique becomes a rule here, and it wins over
`CLAUDE.md`, `AGENTS.md`, `docs/design-language/*`, and any installed skill,
even when one of those documents explicitly recommends the criticised thing.
When that happens, say so in the entry and name the document being overruled,
so the next agent inherits a decision rather than a contradiction. The
overruled document should then be corrected to match.

**Documenting the critique is not optional.** Any agent that receives a
correction writes the entry in the same session, before or alongside the fix.
An undocumented critique gets made again.

---

## 1. Inheriting a design language is not copying components

**Date:** 2026-08-04
**Surface:** the first four footer directions

**What was built.** Four footer prototypes assembled out of the header's own
components: `Wordmark`, `Kicker`, `NavLink`, `ActionLink`, `GoldSweep`, the
header's field tokens, the header's container geometry. One direction, "The
Ledger", reproduced the header's full-screen index panel lying down: the same
serif entries at display scale with the same mono margin notes beside them.

**What was wrong.**

> "These are still not unique. They're trying to imitate the header, and that's
> not what I need."

> "In `footer=ledger`, you basically copied the header directly into the footer.
> That is not design continuity, that is duplication. The footer should feel
> related to the header, but not dependent on it, and definitely not like a
> mirrored version of it."

> "When I say follow a design language, I do not mean copy-paste components
> across the site. I mean inherit the visual system — typography, spacing, tone,
> restraint, hierarchy — and then design each component appropriately for its
> role."

The agent had also written the sharing of primitives into the code as a virtue,
with a comment arguing that reimplementing them would cause brand drift. That
reasoning is what produced the failure. Shared primitives protect against drift
in *values*. They do not license reusing a surface's *composition*.

**The rule.** Inherit the system, design the component.

- **Inherit:** the palette, the three typefaces and what each one is for,
  spacing rhythm, hairline-not-card grouping, gold as a state rather than a
  surface, hover as colour plus a 1px rule, the level of restraint.
- **Do not inherit:** another surface's layout, its hierarchy, its type scale,
  its furniture, or its structural gestures.

Before building any new surface, write down the design problem it solves and how
that problem differs from the neighbouring surface's. The header's problem is to
be present without intruding over changing imagery while the page moves. The
footer's problem is to end the page and hold the whole site at rest, all visible
at once, with nothing after it. Those are different problems and they must
produce different compositions.

**The test.** If you can describe the new surface as "the header, but at the
bottom" or "X, laid down", you have duplicated rather than designed. Start over.

**Related:** this is the failure the clean-slate reset was meant to prevent.

> "This is the same issue we had with the old pholio-landing, and it's exactly
> why we started from a clean slate. Something from that mindset clearly carried
> over."

---

## 2. A brand accent used twice stops being an accent

**Date:** 2026-08-04
**Surface:** the footer's top edge

**What was built.** Every footer direction opened with the gold sweep across its
top edge, on the argument that the header closes its band with the same gradient
and so the page would read as bracketed by one piece of furniture.

**What was wrong.**

> "We also do not need the gold sweep in the footer, at least not in the way it
> is currently being used. Right now it conflicts with the header."

> "The footer needs its own visual resolution, and if there is any shared accent
> language, it should be interpreted in a quieter, more appropriate way rather
> than repeated literally."

Symmetry is not resolution. Two identical gold gradients on one screen compete;
neither reads as special, and the header's edge loses the distinctiveness that
made it worth preserving.

**The rule.** The gold sweep is the header's. It stays a brand asset, and it
stays scarce. A surface that needs to signal an ending finds its own way to end:
spacing, a plain hairline, the composition simply stopping. If a shared accent
appears on a second surface, it must be reinterpreted at lower volume, not
pasted.

Generalise it: **before repeating any brand element on a new surface, ask
whether repeating it makes the original weaker.** If yes, do not repeat it.

---

## 3. Monospace is not the house voice for legal and copyright lines

**Date:** 2026-08-04
**Surface:** the footer imprint

**What was built.** `© 2026 Pholio Studio, Inc.` set in JetBrains Mono at 10px
with wide tracking, matching the header's `Kicker`.

**What was wrong.**

> "I also want you to discontinue the font currently being used for
> '© 2026 Pholio Studio, Inc.' It feels too techy and generic. Find a better
> font treatment that feels more editorial, more industry-aligned, and more at
> home in the industry we're in (modeling, creative etc.)."

**The rule.** Mono is for labels on real data: a date, a measurement, a document
ordinal, a field name. A copyright line is none of those. It is the site's
signature, and it is read by an audience from fashion and casting, not from
engineering. Set it editorially.

More broadly: **the industry this site sells into is modelling and creative, not
software.** Any treatment that would look at home in a developer tool is wrong
here even when it is technically consistent with the token system. See
`docs/design-language/05-industry-reference.md`.

---

## 4. A sitewide surface cannot carry a statement

**Date:** 2026-08-05
**Surface:** the footer's closing line

**What was built.** Both footer directions opened on
*"Every book here belongs to a real person."* in the display serif with one
italic gold verdict word, sized as the surface's focal element.

**What was wrong.**

> "I don't like the 'Every book here belongs to a real person.' text since this
> footer shows in every page."

A line that is good once is wallpaper on the ninetieth reading. The footer
appears under the home page, under `/talent`, under every legal document; a
statement in that position is not a statement, it is furniture that happens to
contain words.

Independently confirmed by measurement: across roughly thirty-five sites in the
space, the largest element in a footer is the company's name, the company's
people, or one instruction, and **never a statement**
(`docs/design-language/05-industry-reference.md` §3.2).

**The rule.** Copy that argues belongs on a page, where it is read in a context
and read once. A sitewide surface carries names, destinations, and facts. If a
footer needs a focal element, it is the mark, a real address, or a single verb,
never a sentence about what the company believes.

---

## 5. Trim the standing links; a route does not need one

**Date:** 2026-08-05
**Surface:** the footer's legal column

**What was wrong.**

> "The legal section is too long, some don't need to be linked, they could just
> exist and we access them when they're hyperlinked somewhere."

Eight legal documents made the corpus the footer's longest column on every page
of the site, which spent the most space on the least interesting thing in it.

**The rule.** Publishing a route and giving it a standing sitewide link are two
different decisions. Most legal documents are reached from the context that
raises them, not from a masthead of them. `LEGAL_NAV` in
`lib/marketing-nav-links.ts` now carries an `inFooter` flag for exactly this:
every document stays live, routed and crawlable, and four carry the standing
link.

The same reasoning killed `Get scouted` in the footer:

> "Don't think we need get scouted in the footer."

The header index already carries the action. A conversion path repeated at the
bottom of every page is not twice as persuasive.

---

## 6. Pholio is not an agency, and has no address

**Date:** 2026-08-05

Research recommended printing a registered address or jurisdiction in the
footer, on the strength of Wilhelmina printing a street address and Next
printing a company registration number.

> "Address is not needed, pholio is not an agency we don't have a location,
> pholio is not legalized yet but will probably be a ccorp or an llc."

**The rule.** Pholio is a platform, not a roster with a building. Do not import
agency conventions that depend on being an agency: offices, city lists, a
representation board, a street address. The company is also **not yet
incorporated**, so nothing on this site may state or imply an entity, a
jurisdiction, a registration, or a founding date. Revisit only when the entity
actually exists, and then only from `lib/legal-constants.ts`.

---

## 7. A surface needs its own field, not just its own layout

**Date:** 2026-08-05
**Surface:** the footer's background

**What was wrong.**

> "We need some unique divider or something unique in the background of the
> footer. I don't like that it's just pure black. It needs some personality."

The footer printed on `#050505`, the same ink as the page above it. Correct type
on identical paper reads as the page running out of content rather than as a
page ending.

**The rule.** A surface with its own job is allowed its own paper. The footer
prints on a warmed, lifted ink that is not the document's, carries a coarser
grain than the sitewide utility, and divides its groups with *vertical*
hairlines, since anything horizontal at its top edge competes with the header's
gold sweep (see §2). None of that is a fourth colour and none of it is
decoration: the field change is the divider, which is also the most common
closing device in the industry sample.

Where a surface needs personality, reach for **field, texture and structure**
before reaching for an added element. Adding things is what made the earlier
versions basic.

---

## 8. The footer is a closing panel, not a footer

**Date:** 2026-08-05
**Surface:** the whole footer

**The direction.** The owner supplied a reference and a brief: the mark spanning
the top at scale, the groups beneath it, and the surface taking the viewport as
a destination with the header standing down while it does.

> "It should not read like a standard website footer. It should feel like a
> statement panel that closes the site with confidence."

**What that changed, structurally.** The panel is a viewport tall
(`min-h-mobile-screen`), an IntersectionObserver in the header hides the bar once
the panel owns the top 40% of the screen, and the mark is the composition rather
than an element in one. Four groups: Product, Company, Legal, Contact, with the
social channels under Contact.

**Two research findings deliberately overruled.** Both are recorded so nobody
"corrects" the panel back later by citing the document:

- `05-industry-reference.md` §3.9 refuses an oversized wordmark at the bottom of
  a page as a portfolio-template move. That finding is about a *footer*. At
  panel scale, with the header gone and the surface owning the screen, the mark
  is the composition, not an ornament on one.
- §5.3 found that no footer in the sample animates on entry. This one does,
  once, on a single observer. A takeover that simply appears is a jump cut; the
  motion is what makes the ending feel chosen.

**The rule that generalises.** Research describes what the space does. It does
not decide what this site is. When a brief and a finding disagree, the brief
wins and the disagreement gets written down here with the reasoning, so the next
agent inherits a decision rather than a contradiction.

---

## 9. Reference-grade surfaces

**Date:** 2026-08-04

These already feel right and are the standing reference for the brand. Study
them before designing something new, and do not change them without being asked:

- The gold sweep, as a scarce brand asset.
- The Pholio wordmark.
- The header and its full-screen index menu.
- The display-serif headline treatment on the 404 in `app/page.tsx`, including
  the single italic gold verdict word.
- The motion language of the legal pages
  (`components/legal/LegalDocumentLayout.tsx`), which is the register for
  secondary pages generally.
- The typography and tone of the header index's clerical column
  ("More / About / Careers / Contact / Press") and the INDEX trigger.

"Reference-grade" means study the *judgement* in them: the restraint, the scale
relationships, the tone. It does not mean lift the markup. See lesson 1.

---

## 10. The intelligence section is about the model, not the feature list

**Superseded in part by §11.** The principle below still holds. The execution it
describes was rejected: the annotation words became a vertical list, which is
the specific thing §11 bans.

**Date:** 2026-08-06
**Surface:** home intelligence beat (`components/intelligence/index.tsx`)

**What was built.** A four-beat scroll sequence that keeps the model footage as
its anchor. Each beat is a single headline. Sparse mono words drift in around her
like contact-sheet labels: `expression`, `pose`, `headshot`, `editorial`. Those
words are taken from the actual portfolio classifier in `pholio-app`, not added
as decoration.

**Why.** The brief was to reveal Pholio's intelligence without defaulting to the
generic three-card SaaS section or a wall of dashboard screenshots. The model is
the person being understood; the typography is the system's attention. That
relationship is the section's whole argument.

**The rule.** When translating product intelligence to the marketing site, lead
with what the talent experiences and keep the visual anchor human. Use type as
annotation or signal, not as a list of features. If the section could be
replaced by a feature grid, it is not designed yet.

---

## 11. Copy is not the design. The type is.

**Date:** 2026-08-06
**Surface:** the home intelligence section, second attempt
(`components/intelligence/`)

**What was built.** Six scroll-driven claims in a left-hand column at display
scale, a twenty-token vertical ledger of product vocabulary in the gutter beside
the model, a vertical hairline separating the two, and a horizontal reading band
that travelled down the stage crossing her figure.

**What was wrong.**

> "The current version is too crowded and too text-heavy. The text sits almost
> entirely on the left, and there is too much of it. The messaging is vague
> marketing language that doesn't say much."

> "The long vertical list and the horizontal lines are obstructive, visually
> cheap, and they overpower the model shot instead of supporting it."

> "The background text has promise, but it needs much more motion, animation,
> and creative treatment."

> "The section has potential, but the current execution is too safe."

Four separate failures, and they are worth separating because they have
different fixes.

**11.1 Volume.** Six headlines of eight to twelve words each is a page of copy
pretending to be a scroll sequence. Long copy also produced awkward and
nonsensical lines, named directly:

> "Digitals expire at twelve weeks. Pholio counts from day one."
> "Not how many looked. Who."
> "One move next, and the number that asked for it."
> "When there is nothing to report, Pholio reports nothing."

Every one of those is a sentence trying to carry a feature. That is the tell.

**The rule.** A cinematic section gets **one line of prose, at most**. Everything
else is either a single word, a real product term, or nothing. If a claim needs
a sentence to land, it belongs on a page that is read, not on a stage that is
watched. Write the section's vocabulary first and the sentence last; if the
sentence turns out to be unnecessary, that is the correct outcome.

**11.2 The list.** Stacking classifier vocabulary vertically produced exactly
the thing §10 was written to avoid, one layer down. A list of `full length` /
`three-quarter` / `headshot` is a feature grid rotated ninety degrees.

**The rule.** No vertical stack of short labels beside a subject, in any
treatment, at any opacity, however real the data behind it is. Product
vocabulary belongs at display scale, one term at a time, as the composition.

**11.3 Rules and hairlines cheapen this surface.** This directly overrules
`docs/design-language/03-banned-ui.md` §3.9, which calls hairlines "the site's
primary organising furniture", and lesson §7, which reached for them in the
footer.

> "Vertical and horizontal rules that cheapen the composition."

**The rule.** **No hairlines, rules, ticks, bands, or leader marks in the home
scroll sequence.** Not as dividers, not as instruments, not as scan lines, not
at eight percent opacity. The ban list's carve-out for "a rule with content on
both sides of it" does not license them here. Where a composition needs
structure, it comes from type scale, position, occlusion and timing. This is
scoped to the cinematic home surfaces; the legal documents and the footer keep
their existing treatment until the owner says otherwise.

**11.4 Nothing may obstruct the model.** She is the emotional anchor, and every
element competing for the same pixels weakens her.

**The rule.** In the home sequence, **all display typography sits behind the
figure.** She occludes it, never the reverse. Type being cut by her silhouette
is the effect worth having; type laid over her body is not. Anything that must
sit in front of her is small, and it sits in space she does not occupy.

**11.5 Safe is a failure state here.** The background type was the one element
called promising, and the note on it was that there was not enough of it.

**The rule.** Background type is the section's primary instrument, not its
atmosphere. It travels, scales, layers, overlaps in time, bleeds off both edges
of the frame, and hands off between planes at different depths and speeds. A
word that only fades in and out has not been designed. "Restraint scores" from
`04-scroll-craft.md` §6 is about not adding *elements*; it is not permission to
under-animate the one element the section is made of.

**The test.** Freeze the section at any scroll position. If what you see could
be described as "a headline and some labels", start over. It should be
describable as a composition with one subject and one word in it.

---

## 12. Do not fix too much copy by removing the message

**Date:** 2026-08-06
**Surface:** the home intelligence section, third attempt
(`components/intelligence/`)

**What was built.** §11 said "far less copy", so the section was rebuilt with
almost none: eleven giant product terms travelling behind the model
(`HEADSHOT`, `DIGITALS`, `TWELVE WEEKS`, `WHO LOOKED`, market names), two type
planes moving against each other, and one closing sentence.

**What was wrong.**

> "The current intelligence section has been pushed too far in the wrong
> direction. I do like the background text, but it should be a subtle addition,
> not the main design move. Right now it feels crowded and overworked."

> "The motion is also very clunky and there's no concrete message, just a bunch
> of words that are not legible."

> "This section should be high quality, premium, luxurious, and motion-led. It
> should be award winning."

> "You have a high-quality video of a model, use it. There's so much you could
> do."

**12.1 A correction is a direction, not a limit to run to.** §11 said the
section had too much copy. The response deleted the message entirely, which
failed the same brief from the opposite side. Both versions were wrong for the
same underlying reason: the copy was never designed, it was only sized.

**The rule.** When a critique names a quantity, change the *quality* first and
the quantity second. Ask what the surface has to say, write that in as few
words as it honestly takes, and set those words well. A section with no message
is not a restrained section, it is an empty one.

**12.2 Background type is subtle or it is not background.** Eleven display
words arriving and leaving is a foreground pretending to be atmosphere.

**The rule.** If type sits behind the subject it stays behind her: one element,
one continuous movement, low enough that it never competes for the glance. Type
that pops in and out is not a background, whatever its opacity.

**12.3 Illegible is not a style.** Display type bled off both edges of the
frame so phrases read as `WELVE WEE` and `MILAN LO`. That was defended as an
editorial crop. It is not.

**The rule.** **Every word on the stage must be readable, whole, at every scroll
position it appears in.** Scale serves the word; the word does not serve the
scale. If a phrase does not fit, it is the wrong size or the wrong phrase.

**12.4 Fading things in and out is not motion design.** Each element appearing
and disappearing on its own timer read as clunky, because a dozen independent
fades have no through-line.

**The rule.** A cinematic section needs **one continuous movement that runs its
whole length**, and everything else is timed against that. Elements should
already be moving when they arrive and still be moving when they leave. Nothing
parks, nothing pops.

**12.5 The footage is the asset. Use it.**

> "Keep the model as the anchor."

**The rule.** The frame sequence is a camera, not a backdrop. It can push in,
pull back, and reframe, and that move is the section's spine. A sequence where
the model holds one size for the whole section while type does all the work has
wasted the only real thing on the stage.

**12.6 The message, stated once so it stops being re-derived.** Pholio sees the
talent and knows her. It understands her deeply, and that understanding is what
makes the product feel intelligent. It is not "AI-powered" anything. Any future
version of this section is judged against that sentence.

---

## 13. The confirmed direction for the intelligence section

**Date:** 2026-08-06
**Surface:** the home intelligence section, fourth pass

**What was accepted.**

> "I love that the text on the left and the video now match, and the message is
> clear. The video is finally supporting the copy. This is the right direction."

**The parts that are now settled.** Do not reverse these without being asked:

- **The camera is the spine.** The frame sequence pulls back onto the
  full-length shot, then pushes in to a close portrait, and every other element
  is timed against that one move.
- **The message, in twelve words.** `Pholio sees the frame.` /
  `Then it sees you.` / `Understood before you send.` Gold falls once, on `you`.
- **Copy and camera move together.** Type placement, scale and pacing are
  derived from where she is and how close the camera has come, never chosen
  independently.

**What still had to change.**

> "It feels a little pale."

> "The left-side text is too limited in its current placement. Don't think of
> typography as only living on the left. Be more creative with how the copy is
> placed, revealed, layered, and paced. You have a lot of space, use it."

> "But keep it sparse. I do not want more text for the sake of filling space."

> "The background text can stay if it helps. If it weakens the section, remove
> it entirely. If it stays, it needs better motion and more finesse. It should
> feel like it belongs in the composition, not like an afterthought."

**13.1 Sparse is not the same as small.** "Pale" was a scale problem, not a
colour one: three blocks all set within one narrow range of sizes, none of them
big enough to carry a frame.

**The rule.** Within a beat, the scale jump between the largest and smallest
fragment should be at least three to one. Drama comes from that ratio, not from
adding elements and not from raising opacity.

**13.2 A sentence is a composition, not a block.** The same twelve words, set as
three stacked paragraphs, is positioning. Split into fragments placed against
each other, it is typography.

**The rule.** Break each line into two fragments at different scales and
different positions, and let the space between them be part of the design.
**No two beats may use the same composition.** Left column, split across the
frame, and hanging indent are three; a fourth beat would need a fourth.

**13.3 Copy does not live on the left.** The left edge is one option among the
whole frame, and locking to it makes the model look like an illustration beside
a caption.

**The rule.** Use the full stage. A fragment may sit right, high, low, or
indented into the field, as long as it never covers the figure and never has to
be hunted for. Where the composition allows it, let the figure sit *inside* the
sentence rather than beside it.

**13.4 Reveal, do not fade.** Opacity was doing all the entrance work.

**The rule.** Type enters by wipe, from behind a mask, staggered per fragment,
so a line assembles rather than appears. Fades are for things leaving.

**13.5 Background type belongs to the camera or it does not belong.** The
archetype ribbon drifted sideways on its own timeline while the camera pushed
in, which is exactly why it read as an afterthought.

**The rule.** Anything living behind the figure shares the camera's move,
damped: it scales and travels with the push, less than she does. A background
element on its own independent timeline is pasted on, whatever its opacity.

---

## 14. Polish is specific

**Date:** 2026-08-06
**Surface:** the home intelligence section, fifth pass

**What was accepted, again.** The core is settled and stays: the camera push in,
the twelve-word message, copy composed against where she is.

> "The core idea is strong: the text and the model match, the message is clear,
> and the section finally feels like it is saying something meaningful."

**Six named defects, each with its own rule.**

**14.1 Do not print the brand name next to the brand mark.** The first beat read
`Pholio sees the frame.` directly under a hero whose entire composition is the
word PHOLIO at 28vw.

> "Saying 'Pholio' twice is unnecessary. Since the hero already has PHOLIO in
> it, use that more creatively instead of repeating the word plainly."

**The rule.** The wordmark is a typographic asset, not just a logo slot. Where
the brand needs to be the subject of a sentence, **set the mark and let it do
the work** rather than typing the name again in body voice. And never state in
copy what the composition above already says.

**14.2 A lockup is not two elements that happen to share an edge.**

> "The first beat is too separated, 'Pholio sees' and 'the frame' are too far
> apart."

**The rule.** Parts of one sentence belong in one block, spaced in ems of the
type they sit against, not positioned independently by percentage of the stage.
Negative space goes *around* a lockup, never through the middle of a phrase.

**14.3 The exit is a design decision.**

> "The text exit feels like a PowerPoint fade-out. Use a different motion
> language."
> "Avoid the current text fade-out behavior. The motion should feel designed,
> not preset."

**The rule.** **No opacity animation on display copy, in or out.** Type enters
and leaves by mask, word by word, staggered in reading order. If a line can
leave as one rectangle, it has not been choreographed. Opacity is for
background planes only.

**14.4 Check the descenders.** The tail of the italic `y` in `you.` was being
shaved by its own reveal mask.

**The rule.** Masked type carries its clearance as padding **on the moving
element**, not on the mask, so the wipe distance is a percentage of a box that
already contains the overhang. Then look at the lowest and highest glyph in
every fragment before calling it done, at the scroll position where it settles
and at the ones where it is halfway through.

**14.5 White on black is not emphasis.**

> "'Understood before you send' is good, but it needs a stronger typographic
> emphasis. Right now it is too plain and all white."

**The rule.** A beat needs a second treatment somewhere in it: a scale
inversion, a change of tracking, or the one gold verdict word. All-cream at one
size is the absence of a decision. The gold stays rationed to one word per
beat, and the beats that carry it should differ in scale so two gold moments
never read as a pair.

**14.6 "Pale" has been said three times. It means contrast, not colour.**

**The rule.** Before calling this section done, check that it carries: a scale
ratio of at least three to one inside every beat, at least one non-cream
treatment per beat, and a background plane that is genuinely out of focus rather
than merely faint. Faintness reads as washed out; softness reads as depth.

**14.7 Background type earns its place every pass.**

> "If the background text stays, it should be subtle and better animated. If it
> doesn't strengthen the section, remove it. It should never compete with the
> model or the main message."

**The rule.** It stays only while it is doing something the composition would
miss. It is depth: softened, eased rather than linear, riding the camera. A
background element travelling at constant speed in a straight line is the
default, and the default is what reads as undercooked.

---

## 15. The hero is finished. Connect to it, do not edit it.

**Date:** 2026-08-06
**Surface:** the home hero wordmark, and the hero to intelligence transition

**What was built.** Asked to make the hero's PHOLIO wordmark the connective
element into the intelligence section, the agent rewrote the wordmark's exit:
instead of rising and fading on her first movement, it shrank and travelled to
the upper left and held there as the subject of the first intelligence line.

**What was wrong.**

> "I need you to keep the hero section exactly as it is. Don't change the motion
> in which the motion scrolls up or anything else. Find an alternative way to
> connect the hero with the intelligence section."

**The rule.** **The hero is a finished surface.** Its wordmark, its exit, its
timing against her first movement, and its composition are not raw material for
a later section's problem. A section that needs to feel connected to the hero
solves that in its own code.

This is the same shape as §1, one layer subtler: there the mistake was reusing
the header's composition, here it was *editing* a finished one. Both come from
treating a settled surface as available.

**15.1 Connection is inheritance, not continuation of the same element.** The
brief was continuity, and the agent read that as "the same element keeps
moving". It does not have to be. A later scene can inherit a finished scene's
**treatment**, its **exit vector**, or its **material** without touching it.

**The rule.** To bridge two scenes, take something the first one leaves behind:

- the direction it left in, so the next thing arrives along the same axis
- the way it was drawn, so the next thing begins in that state and resolves out
  of it
- its colour, weight, or texture, carried at a different scale

What the intelligence section now does: the mark exits upward and is gone,
untouched. The first line then **descends from where it went**, drawn in the
mark's own 1px gold hairline with no fill, and fills to solid cream as it
lands. The hero's identity becomes the message without the mark being moved,
copied, or retyped.

**15.2 One motion per beat, chosen for meaning.** **Superseded by §17.** The
principle that a motion should mean something still holds. Giving each beat a
*different mechanism* does not follow from it, and in practice produced the
tech-demo feel §17 rejects.

> "Replace the current upward typography movement with a more premium
> transition. It should feel like a transformation, continuation, or unfolding.
> Use typography motion that's relevant and unique for each beat."

**The rule.** A section does not get a house transition applied to every beat.
Each beat states what it means and moves accordingly, with a beginning, a
transformation, and a landing. Reusing one entrance across a whole section is
the preset the brief is asking you to avoid, no matter how good the preset is.

---

## 16. The bridge starts in the hero, without touching the hero

**Date:** 2026-08-06
**Surface:** the hero to intelligence transition, and the animation stack

**The direction.**

> "'Sees the frame' should begin in the hero section and build into the
> intelligence section. The PHOLIO wordmark must first stand completely on its
> own in the hero. Do not attach the phrase to it too early, and do not turn the
> hero mark into an inline label. The hero should remain visually intact and
> confident."

> "The feeling should be that the intelligence message is emerging from the
> hero's identity, not that a second PHOLIO component has been added below it."

**16.1 A section may begin before its section does.** The mistake behind §15
and this one is the same assumption: that a beat's life has to fit inside the
scroll range of the component that owns it. It does not. The first intelligence
line is born at frame 14, while the hero is still the hero, and does not finish
resolving until frame 86.

**The rule.** Where two scenes need to feel like one move, let the later
scene's first element **start early and live across the boundary**, mounted in
the earlier scene's z-stack. What must not cross the boundary is *edits to the
finished scene*. Adding a sibling layer is allowed; changing the neighbour is
not.

**16.2 Nothing before the mark has had its moment.** The wordmark must be alone
at scroll zero, and alone until she moves.

**The rule.** An element that emerges from another starts at **scale zero**, not
at low opacity. Zero renders nothing, so the opening composition is provably
untouched, and growth from nothing is an emergence rather than a fade.

**16.3 Measure the thing you are connecting to.** The phrase's origin is not a
hardcoded coordinate; it reads the mark's own bounding box at mount, via a
`data-hero-wordmark` hook that adds no styling. If the hero's type scale ever
changes, the bridge follows it instead of drifting.

**The rule.** A connective element derives its geometry from the element it
connects to. Two hardcoded positions that happen to line up today are a bug
with a delay on it.

**16.4 The animation stack.**

> "Find a better animation dependency. I also want you to research and introduce
> a more distinctive animation library. Do not rely only on basic CSS fades,
> generic slide-ins, standard easing, or common template transitions."

**What was chosen and why.** GSAP 3.15, which since 3.13 ships every former
premium plugin in the free package: `CustomEase` for bezier curves that are not
in any easing menu, `SplitText` where character splitting is needed, `Flip` and
`Observer` if a later surface wants them.

**What was deliberately not adopted.** `ScrollTrigger`. This page already has
one scroll source of truth, the frame sequence, and a second scroll system
listening alongside it is how a scrubbed sequence starts to drift from its own
footage. GSAP timelines here are built paused and driven by
`timeline.progress()` from the existing scroll value.

**The rule.** **One scroll source per page.** Add an animation library for its
sequencing and its easing, never for a second opinion about where the page is.
Linear interpolation between keyframe stops is the tell that a scroll scene was
wired rather than authored; a scene should be a timeline with real curves.

`lenis` was evaluated for scroll smoothing and left out of this change: it is a
sitewide behaviour change, not a section one, and it belongs in its own
decision.

---

## 17. Quiet confidence, not novelty

**Date:** 2026-08-06
**Surface:** the hero to intelligence transition

**What was built.** `sees the frame` was born as fourteen characters at scale
zero, scattered across the wordmark's width, condensing into words on a custom
bezier, riding the mark upward, then filling from a gold hairline outline to
solid cream on a clipped left-to-right sweep. Beat II swept in from both edges;
beat III opened from an aperture in the middle of the word.

**What was wrong.**

> "The current transition is too over-engineered and it reads generic and
> template-like, especially the 'sees the frame' move. It feels gimmicky and
> techy, not restrained, premium."

> "The goal is not novelty. The goal is quiet confidence."

> "The motion should be felt as part of the composition, not noticed as the
> composition."

**17.1 Effort is not the same as quality, and it is usually the opposite.**
Every one of those mechanisms was individually defensible. Together they read as
a demo reel. The failure was cumulative, which is why each review pass adding
one more idea made it worse.

**The rule.** **Count the mechanisms in a section. If there is more than one,
justify each out loud.** A premium surface has one motion vocabulary and varies
placement, scale and pacing inside it. Different mechanics per beat is variety
for its own sake, and it is what makes a section read as a template demo.
This supersedes §15.2.

**17.2 Nothing appears from thin air.**

> "Nothing should appear from thin air."

**The rule.** Type does not fade up, scale up from zero, materialise, or
assemble. It **arrives** — from outside the frame, or from behind an edge that
is already part of the composition. If a viewer would ask "where did that come
from", the answer must be a place, not an effect.

This retires §16.2's scale-from-zero: the problem it solved (nothing visible
before the mark has its moment) is better solved by putting the element
**below the frame**, where it is genuinely not in shot.

**17.3 Do not literalise the connection.**

> "Do not use overly literal wordmark transformations."

**The rule.** The link between two scenes is compositional, not mechanical. The
phrase rises into the space the mark vacates, in the same typeface, as the mark
leaves. That is the whole relationship. Redrawing the phrase in the mark's own
hairline and filling it in was the idea being *explained* rather than felt.

**17.4 Character-level choreography is banned on this site.** Splitting a line
into letters and animating them individually is the single most recognisable
"look at me" move in the category, and it reads as techy no matter how good the
easing is.

**The rule.** **Animate lines, not words, and never characters.** A stagger
between two lines of one lockup is the most granularity this site permits.

**17.5 What a dependency is for.**

> "Choose it because it can make the motion feel invisible and elegant."

GSAP stays, and its footprint shrinks to one thing: `CustomEase`, to author a
deceleration with a long tail that `cubic-bezier()` cannot express, because the
difference between a slide-in and something settling into place is entirely in
the shape of that curve. No timelines, no `SplitText`, no DOM mutation. The
library is in the build for the curve, and the curve is the part nobody should
notice.

**The rule.** Judge an animation dependency by the smallest useful thing you
take from it, not by its feature list.

---

## 18. No reveals. Only travel.

**Date:** 2026-08-06
**Surface:** the intelligence section's typography

**What was wrong.**

> "I still don't like the card like upwards transitioning."

Every line was rising out from behind a mask sized to itself. Because the mask
edge is a rectangle the width of the line, the eye reads a card sliding: the
type looks like it is coming out of a slot rather than moving through a space.
That was true whatever the easing was.

**The rule.** **A line is never revealed by an edge that belongs to it.** No
per-line masks, no `overflow-hidden` sized to the text, no clip. Type enters the
composition by **travelling into it from outside the frame** and leaves by
travelling out. The only clipping edge on this site is the stage itself, which
is a frame, not a card.

This absorbs §17.2 and finishes it: nothing appears from thin air *and* nothing
appears from behind a slot. Every element has a place it comes from and a place
it goes, both of them off screen.

**18.1 The type layer sits behind the figure.** Once type travels through the
frame rather than popping into a slot, it crosses space she occupies. That is a
reason to put it behind her, not a reason to route around her: she occludes it,
the layer gains depth, and the rule that nothing ever covers her is enforced by
the stacking order instead of by careful positioning.

**18.2 One mechanism means one file.** The bridge and the beats now move
identically, so the bridge stopped being a special component and became the
first beat with a longer entry. Two implementations of one idea is how the
second one drifts.

**Note on scope.** A white intelligence section was requested and then withdrawn
in the same message ("keep it dark"). Not built. Recorded only so nobody
resurrects it from a half-read transcript.

---

## 19. The opening figure can be tuned without retiming the sequence

**Date:** 2026-08-08
**Surface:** the home Hero opening state

**What was wrong.** The model's opening still held too much air above her head,
even though the later scroll-tied framing was already right.

**The rule.** Keep the authored `FIGURE_SCALE` sequence intact. If the opening
composition needs an optical size correction, apply it only while scroll
progress is exactly zero, and keep the mobile treatment unchanged unless it has
the same measured problem. A static-state correction must not become a new
camera move.

---

## 20. A resting scale is the sequence's calibration baseline

**Date:** 2026-08-08
**Surface:** the home Hero image sequence handoff

**What was wrong.** The opening figure was enlarged through a static-only
override, but the first scroll-derived scale still began at the old baseline.
That made the model jump backward when the sequence started.

**The rule.** The opening scale belongs to the entire authored camera curve.
Apply the same calibration factor to every figure-scale stop so the first
animated frame inherits the resting frame's scale and the original relative
push/pull remains intact. Never patch a scroll sequence with a one-frame scale
branch.

---

## 21. Section changes need a reason to happen

**Date:** 2026-08-08
**Surface:** the About page scrollytelling handoffs

**What was wrong.** A black-to-cream vertical gradient wipe was used to move
between the mission and Manifesto. The gradient read as default CSS and the
text simply rose into it, making the page feel like a template transition.

**The rule.** A transition must evolve from a visual element, type treatment,
image, object, or spatial rule established in the preceding scene. Do not add
an abstract gradient to fill the screen. For the About page, the Hero image
reappears as an editorial image plate before receding into the Manifesto's
existing cream/P composition: human context resolves into curation.

---

## 19. Grayscale stops at the product

**Date:** 2026-08-09
**Surface:** the comp-card beat's photography

**The question.** Grayscale is the site's standing imagery register
(`03-banned-ui.md` §7.3), and it was proposed for the comp-card beat on the
grounds that it would unify three different shoots and stop a white colonnade
and a high-key knit from blowing out against velvet.

**Why it does not apply here.** The comp-card engine's approval summary ends
with a **"Never"** list whose first item is **photo manipulation**, and the
edition catalog's `paper` column is `auto whites` / `warm` / `ivory` /
`pure white` for every edition except `ink-noir`. A desaturated card would
misrepresent what the product emits. And because these photographs *become*
the cards, desaturating them on the way in would change the lead image's
colour mid-transition.

**The rule.** §7.3's grayscale register governs **site art direction**. It stops
at any surface showing **product output**. Where the imagery is the artifact
the product actually produces, it appears exactly as the product produces it,
and the site's treatment yields. Note the one image that reads as monochrome
here is monochrome *as shot* (`07-studio-closeup-bw`), which is the
photographer's decision, not a filter.

---

## 20. Two pinned sections cannot be one scene

**Date:** 2026-08-09
**Surface:** the hero to comp-card transition

**What was wrong.**

> "The current comp card section feels disconnected from the Hero and
> Intelligence sections. Comp Cards needs to become the next beat in that same
> story, not a separate feature block."

The cause was structural, not photographic. Two `<section>`s, each with its own
`useScroll` and its own `position: sticky` child, means the first stage
**unpins and scrolls away** before the second pins. No amount of matching the
imagery hides that: the eye sees one scene leave and another begin.

**The rule.** Scenes that are one story share **one scroll container and one
pinned stage**. Derive a timeline per scene from the single scroll value
(`useTransform(stageProgress, [0, HERO_FRACTION], [0, 1], { clamp: true })`)
rather than giving each scene its own scroll. Then the scenes can overlap: the
figure travels out while the next scene's plates travel in, which is a hand
over rather than a cut.

**20.1 Stagger the hand over, in this order.** Copy first and fastest, then the
figure, then the arriving scene. Type dying on top of an arriving photograph is
the single thing that made this seam read as collage.

**20.2 Measure the exit against the subject's size.** She ends the push in at
scale 1.72, roughly 1.7 viewports tall. A 150vh exit left her boots hanging in
the top of the next beat. Exits are computed from how big the thing is, not
guessed.

**20.3 Captions at one position never cross-fade.** Every beat caption in the
comp-card scene sat at the same coordinates and overlapped its neighbour by
0.05 of the timeline, so each hand over briefly stacked two headlines. Sequence
them with a gap; cross-fade only things that occupy different space.

---

## 21. Cities are not a comp-card variable

**Date:** 2026-08-09
**Surface:** the comp-card beat's copy and labels

**What was wrong.** The beat read *"One book. Different rooms."* over four cards
labelled NEW YORK / PARIS / MILAN / LONDON.

> "I don't see how the comp card designs themselves reflect the cities.
> Shouldn't it be editorial, commercial etc? Make sure every little detail is
> accurate and true."

Correct, and the product says so. A card varies by **edition** — the engine's
top-level creative unit, nine named art directions that each own composition,
image hierarchy, typography, palette, ornament and back program. A city is an
**intel** concept (`intel/market-resolve.js`, where *attention* resolves to a
market) and touches nothing about how a card is composed. The labels described
a variable that does not exist.

**The rule.** **A label names the axis the artwork actually varies on.** Before
captioning a set of product outputs, find the field in the product that
produced the difference and use its own vocabulary.

**21.1 Read labels out of shipped code, not the spec.** The editions spec's
catalog and `composition/editions.js` have already drifted: `fresh-commercial`
/ The Commercial in the spec is `the-strip` / The Strip in code. The site
renders each card by requesting its edition id explicitly and takes the label
from the shipped catalog, so the caption and the artwork cannot disagree.

**21.2 Generate the artifact, do not mock it.** `scripts/render-comp-cards.cjs`
drives `composeCompCard` from `pholio-app` directly with `aiAdvice: false` — no
database, no network, no key. The cards on the home page are the same bytes the
product's PDF route would emit.

---

## 22. A morph target must share its source's structure

**Date:** 2026-08-10
**Surface:** the comp-card capture beat

**What was wrong.**

> "Address the comp card rotating motion as well as the first beat where the
> picture turns into a comp card. Check the previous elara keats version, the
> transitions were smoother and more aligned and accurate then."

Three separate causes, all mine:

**22.1 The morph target was matted.** The source plate is a full-bleed
photograph; the card it turned into was `gallery-monograph`, a small photo
inset on a wide ivory mat. A full-bleed rectangle cannot become an inset
without the crop visibly jumping. The earlier version worked because its card
was full-bleed with the name set into the foot.

**The rule.** When one element morphs into another, they must share
**structure**, not just content. Match the target's frame to the source's
before tuning any easing; no curve rescues a crop that moves.

**22.2 The hero was ranked, not locked.** The engine picked the headshot as
every edition's hero, so the plate and the card were different photographs.

**The rule.** Use `locks.heroId`. Anything the site morphs into a product
artifact must pin the artifact's hero to the same asset.

**22.3 A headshot is the wrong hero for a comp card.** Ranking chose the tight
studio close-up, which made all nine editions read as one flat card. The
industry front is a body shot with the name integrated. Switching the lead to
the editorial standing frame is what made the four directions look like four
directions.

**22.4 Transforms applied inside a scaled element are scaled too.** `y: -122`
passed into a wrapper at `scale: 0.46` lands at −56px, which is why the lead
card sat lower than its neighbours in the narrow grid. Position and scale
belong on the same element.

---

## 23. A researched industry convention can still be the wrong word

**Date:** 2026-08-15
**Surface:** the sitewide CTA (`components/header/kit.tsx`,
`components/talent-hero/kit.tsx`, `lib/hero-variants.ts`)

**What was built.** `05-industry-reference.md` §4.3 researched the incumbent
agency web (IMG, Ford, Next Management all use the exact string `Get Scouted`
as their talent-facing action) and recommended Pholio match it, explicitly
warning future agents not to soften it to a generic `Sign up` / `Get started`.
That recommendation shipped as the one CTA label used everywhere on the site.

**What was wrong.** The owner reviewed the 2026-08-15 strategic analysis
(`pholio-app/docs/pholio-strategic-analysis-2026-08.md`) against this site's
copy and confirmed the label should change. The analysis's evidence: `get
scouted` / `get discovered` / `get signed` is the exact vocabulary shared by
every predatory talent platform in its competitor research (Snapcast,
ModelManagement.com, a product literally named Get Scouted), and it sits
adjacent to the "represents that it helps procure employment, auditions, or
engagements" language California's advance-fee statute (Lab. Code §1702.1)
regulates. Matching three incumbents on this one word bought nothing and
imported their risk and their reputation.

**The rule.** Researching what the industry actually does (05's whole method)
is still correct and still the right way to avoid inventing conventions from
nowhere. But **industry-convention evidence and compliance/trust evidence can
point opposite directions on the same word, and when they do, compliance
wins.** A convention is a data point about what reads as native to the
category, not a license to import a phrase the category's worst actors are
also using. Check new copy against the product plan's banned-vocabulary list
even when a design-language doc has independently blessed it.

**What replaced it.** `Apply free` — same action the industry verb names, but
it states the plan's actual differentiating claim (unlimited, free, no quota
lift) instead of promising to get the applicant found. `05-industry-reference.md`
§4.3 is corrected in place to record why, per this repo's own rule that docs
describe only what is true now.
