# Industry reference

How the modelling, talent-representation and creative-fashion space actually
sets a website. Every measurement here was taken off the live rendered page in a
real browser, from computed styles, not from press about the site or from
memory. Where a site could not be read, that is stated rather than guessed.

Read this before designing a surface. It answers the question the ban list
cannot: `03-banned-ui.md` says what not to build, and this says what the space
Pholio sells into actually does.

---

## Why this document exists

`lessons.md` §3 records the correction that produced it. A monospace copyright
line was rejected as "too techy and generic", with the general rule that any
treatment at home in a developer tool is wrong here even when it is consistent
with the token system.

A prohibition is not a design brief. This file is the positive statement.

It does not override `03-banned-ui.md`. Where an industry convention collides
with a Pholio rule, the collision is named in place and the winner is stated.

---

## 1. What makes a site read as "of this industry"

### 1.1 The front door is one to two screens, not eight

This is the single most mechanical difference and it is not close.

| Site | Full document height, 1440px viewport |
|---|---|
| Elite Model, Wilhelmina, Kult, Viviens, Next Management, The Society Management, Art Partner, Cargo, The Dots | 900px (exactly one viewport, no scroll) |
| The Row | 1,870px |
| Toteme | 2,352px |
| System Magazine | 2,960px |
| Behance | 4,407px |
| Contra | 5,780px |
| Backstage | 5,945px |
| Casting Networks | 6,177px |
| Format | 16,775px |

Seven of the ten agencies studied serve a single non-scrolling screen as their
homepage: full-bleed imagery, a wordmark, and a way in. The Row, one of the most
expensive brands in the world, closes its entire homepage in under two screens.
Format, a portfolio SaaS aimed at photographers, runs 16,775px.

The tell is not a specific section. It is the *length*. A long page is a page
that is arguing, and this industry does not argue on the homepage. It shows.

This is already Pholio's position, and it is worth defending against pressure to
add sections: the ban list's §1.1 rejection of the default page skeleton and the
industry's two-screen front door are the same instinct arriving from different
directions.

### 1.2 Almost no text

IMG Models' homepage carries 21 images and roughly forty words of chrome, most
of them navigation. There is no positioning statement, no explainer paragraph,
no supporting sentence anywhere on the page. Captions do all the writing, and a
caption is four words: `Anok Yai Ferragamo FW26`.

The image-to-text ratio is not "high". It is close to total. Text on these sites
exists to name things: a person, a client, a season, a city, a document.

### 1.3 Everything is flush left, in equal columns

Across every site read, exactly one block of centred text appeared
(System Magazine's newsletter sign-up). Everything else is left-aligned into
columns of equal width, with group labels stacked above their lists. No centred
headline, no centred paragraph, no text floating out of the grid.

### 1.4 One type size does most of the work

Celine's entire footer is 10px. IMG's entire footer is 12px, including the
copyright. The Row's entire footer is 13px including the copyright, with a
single 11px exception on a privacy consent line. Wilhelmina's is 12px
throughout.

These are not lazy footers. They are a deliberate refusal of hierarchy on a
surface that does not need it. The whole page's hierarchy was spent on
photographs.

### 1.5 Weight 400, almost everywhere

Resting link weight in the fashion sample is 400 without exception: IMG, The
Row, Celine, SSENSE, Toteme, Art + Commerce, Wilhelmina, Storm, Next, System
Magazine, Vogue's link rows. Weight only rises for a group label (IMG's header
nav at 600, Art + Commerce's 700 uppercase group labels, BoF's 700 column
headings).

The SaaS sample does the opposite: Contra sets every resting footer link at
weight 500, Behance at 400 with 700 headings and a blue accent, Backstage at
400 on a coloured field. Medium-weight resting body links are a tech signature.

---

## 2. Typography

### 2.1 Serif versus sans is not the dividing line

The assumption that fashion means serif does not survive contact with the
evidence. Of the sites read:

**Sans-dominant:** IMG Models (Lay Grotesk), Ford (Aktiv Grotesk), Wilhelmina
(Futura PT), Elite (Söhne), Storm, Premier (Portrait, with Proxima Nova in the
footer), The Row (Basic Commercial), Celine (Neue Haas Grotesk Text), Jil Sander
(a custom Futura), Toteme (Toteme Sans), SSENSE (Favorit), i-D (Univers Next),
Art + Commerce's chrome (Akzidenz Grotesk).

**Serif-dominant:** Next Management (Chronicle Display, sitewide, including the
copyright), System Magazine (Times Ten and Times Eighteen, sitewide), Business
of Fashion's masthead (Chronicle Display), Vogue's article type (Adobe Garamond
Pro), Art + Commerce's roster of names (Adobe Garamond), Tyler Mitchell (Marion),
Campbell Addy (Arno Pro Display).

What actually separates the space from SaaS is not the family but the *pairing*
and the *restraint*: one voice for names and running text, one voice for micro
labels, and nothing else. Art + Commerce is the clearest case, and it is also
the closest analogue to Pholio's job: Adobe Garamond for every person's name,
Akzidenz Grotesk at 10px uppercase for every structural label. Two faces, two
jobs, no third.

Pholio's three-voice system with the mono pushed back to labels-on-real-data is
inside this convention, not outside it.

### 2.2 Tracked uppercase belongs to small type only, and the tracking is tight

Measured tracking on uppercase micro-labels:

| Site | Element | Size | Tracking |
|---|---|---|---|
| Celine | every footer link | 10px | 0.03em |
| Art + Commerce | group label `Photographers` | 10px | 0.03em |
| Ford | footer links | 13px | 0.02em |
| Semplice | `Tips & Tricks` | 16px | 0.06em |
| Kult | footer links | 11.2px | 0.09em |
| Premier | footer imprint row | 11.4px | 0.10em |
| Contra | `For independents` | 12px | 0.10em |
| Vogue | footer link rows | 12px | 0.12em |

The band is **0.03em to 0.12em**. Nothing in the sample tracks wider than that.

Pholio's mono `Kicker` sits at 0.28em. That is more than double the widest value
anywhere in the industry sample, and it is exactly the value range that reads as
terminal UI, technical drawing and brutalist web. This is an independent,
measured confirmation of the owner's instinct in `lessons.md` §3, arrived at
without reference to it: the problem with the mono kicker is not only the face,
it is the tracking.

Above roughly 16px, uppercase essentially stops. The exceptions are Ford's
full-screen overlay navigation (22.4px bold uppercase) and Campbell Addy's
wordmark (19px, 0.05em). Everything larger is sentence case or capitalised.

**This validates two fixed points directly.** The Pholio wordmark, set in the
display serif in tracked uppercase at 15 to 24px, is precisely the treatment
Campbell Addy uses at 19px in Arno Pro Display: a small tracked serif capital
wordmark is a photographer-and-agency convention, not a general web one. And the
header index's entries, set capitalised in the serif at
`clamp(2.4rem, 5.4vw, 4.4rem)`, are correctly *not* uppercase: at that scale the
industry never is.

### 2.3 Small type is set small and left plain

Micro type in this space is 10 to 13px, weight 400, at 55% to 70% of ink
strength, with no other treatment. No underline, no border, no background, no
icon. IMG's copyright is `rgb(117,117,117)` on white. SSENSE's is
`rgb(136,136,136)`. Toteme's is `rgb(158,157,155)` at weight 300. Vogue's is
`rgb(99,99,99)`.

Muting is done with colour alone. Pholio's `MUTED` token (58% alpha) sits in the
middle of that band and is correct.

### 2.4 Legal and copyright lines: the researched verdict

This is the question `lessons.md` §3 opened. Here is every copyright line
readable in the sample, as rendered.

| Site | String | Face | Size | Case | Colour |
|---|---|---|---|---|---|
| Next Management | `Copyright © 2026 Next Management. Reg No. 26-6767Y-LSFW` | Chronicle Display Light (**serif**) | 16.6px | sentence | white on ink |
| Storm | `STORM © 1987-2023` | site sans | 16px | as typed | black |
| Casting Networks | `© 2026 Casting Networks®, LLC. Casting Networks® is a registered trademark…` | IBM Plex Sans | 16px | sentence | white |
| Backstage | `© 2026 Backstage. All rights reserved.` | Matter | 14px | sentence | #D5D4D0 |
| Toteme | `Copyright © 2026` | Toteme Sans 300 | 14px | sentence | #9E9D9B |
| The Row | `The Row © 2026` | Basic Commercial | 13px | sentence | #212121 |
| Behance | `© 2026 Adobe Inc. All rights reserved.` | Acumin Pro Wide | 13px | sentence | white |
| Format | `© 2026 Ideaform Inc., All Rights Reserved.` | Untitled Sans | 13px | sentence | white |
| IMG Models | `Copyright IMG Worldwide, LLC` (no year) | Lay Grotesk | 12px | uppercase | #757575 |
| Vogue | `© 2026 Condé Nast. All rights reserved.` with *Vogue* italic mid-line | Vogue Avant Garde | 12px | sentence | #636363 |
| Business of Fashion | `© 2026 The Business of Fashion. All rights reserved.` | Helvetica Neue | 12px | sentence | white |
| Premier | `© 1981-2026 Premier Models` | Proxima Nova | 11.4px | uppercase, 0.10em | #222 |
| SSENSE | `© 2026 ssense.com` | Favorit SSENSE | 11px | sentence | #888 |
| Ford | `All rights reserved - Copyright © 2026` | Aktiv Grotesk 300 | 11px | sentence | black |
| Art + Commerce | `© 2024 ART + COMMERCE. ALL RIGHTS RESERVED` | Akzidenz Grotesk | 8px | uppercase, 0.04em | black |

Celine prints no copyright line at all; its footer is two rows of 10px uppercase
links and nothing else.

**Finding one: zero monospace, in fifteen out of fifteen.** Not one site in the
sample — agency, house, publication, or portfolio platform — sets its imprint in
a monospaced face. Including the SaaS-shaped ones. The owner's correction is not
a matter of taste that happens to differ from the industry; monospace here is
simply outside the space entirely.

**Finding two: the imprint is set in the face the site reads in.** Every site
sets the copyright in its own running-text face at or near the footer's smallest
step. Next Management sets it in Chronicle Display because Next Management sets
*everything* in Chronicle Display. The Row sets it in Basic Commercial because
that is the whole site. Nobody introduces a face for the imprint, and nobody
reaches for a "technical" face to signal that this line is administrative.

**Finding three: serif imprints are set larger.** The one true serif imprint in
the sample sits at 16.6px. The sans imprints run 8 to 14px, clustering at 11 to
13px. Serif at small sizes needs the extra millimetre, and the industry gives it.

**The verdict on the current build.** Setting `© 2026 Pholio Studio, Inc.` in
the display serif is right, and the mono was wrong. Keep the serif. But 12.5px
is the wrong size for it, for two reasons the research makes specific:

1. It is smaller than every serif imprint observed and smaller than the median
   sans imprint. It is at the bottom of the band while carrying a face that
   needs the top of it.
2. Noto Serif Display is an optical-size *display* cut. Its hairline strokes are
   tuned for headline sizes. At 12.5px, muted to 58% alpha on `#050505`, the
   thins fall below a device pixel and the line renders as a soft sans. The
   editorial quality the owner asked for is in the stroke contrast, and at
   12.5px the stroke contrast is not being delivered.

**Set the imprint in Noto Serif Display at 13.5 to 14px**, keeping the existing
positive tracking (0.012em is right for a serif at that size) and the existing
muted colour. If it still reads soft on velvet, take the colour to full ink
strength and let the size alone carry the demotion, as The Row does at 13px in
near-black.

A note on the string itself, which is copy and therefore the owner's call. Two
forms exist in the space: the standard `© YEAR Company`, and a brand-first form
that reads as a signature rather than a notice: `The Row © 2026`,
`STORM © 1987-2023`. The second is distinctly of this industry. IMG drops the
year entirely. Premier and Storm print a founding-to-present range, which does
real trust work by stating how long the company has existed — that specific move
is unavailable to Pholio and would be a liability, since a range starting in
2025 or 2026 advertises newness to an audience screening for it.

---

## 3. Footers

The immediate application, and the section with the most in it.

### 3.1 There are two footer species, and only one of them has an idea

**The imprint footer.** Small, flat, obligation-discharging, no hierarchy at all.

| Site | Footer height |
|---|---|
| Toteme | 40px (one line: `Copyright © 2026`) |
| Celine | 82px (two rows of 10px uppercase links) |
| Premier | 99px |
| harleyweir.com | 113px |
| Wilhelmina | 239px |
| Storm | 244px |
| The Row | 250px |
| IMG Models | 385px |

**The index footer.** Tall, with one large element and a real structure.

| Site | Footer height | Largest element |
|---|---|---|
| Business of Fashion | 614px | `The Business of Fashion`, 36px Chronicle Display serif |
| Backstage | 925px | column headings at 14px (no focal point; it is an SEO matrix) |
| Semplice | 987px | a numbered index, 48px |
| Art + Commerce | 1,035px | the roster of photographers, 16px Adobe Garamond |
| Contra | 1,094px | column headings at 14px (SEO matrix) |
| System Magazine | (in-flow, ~600px) | `Sign up to the System newsletter`, 39.6px Times Eighteen Bold |

Note where the tall footers fall. Contra and Backstage are tall for the same
reason Format is tall: eight columns of keyword links. Height is not the quality
signal. **The presence of a single large element is.**

### 3.2 What the largest element in a great footer is, and what it is doing

In the sample it is exactly one of three things, and never anything else.

**The company's name.** Business of Fashion closes on `The Business of Fashion`
at 36px in Chronicle Display, with one 14px sentence beneath it: *"Agenda-setting
intelligence, analysis and advice for the global fashion community."* It is
doing attribution. After eight thousand pixels of other people's headlines, it
restates who was speaking.

**The company's people.** Art + Commerce closes on its entire roster: every
photographer's name, alphabetically, at 16px Adobe Garamond, in three columns,
under a 10px uppercase Akzidenz label reading `Photographers`. William
Abranowicz, Cass Bird, Malick Bodian, Richard Burbridge, Craig McDean, Steven
Meisel, Stephen Shore, Sølve Sundsbø. This is the best footer in the sample and
the reason is simple: **the largest thing in it is the thing the company is.**
The footer is not a site map with a decoration on top. It is the business,
restated as a list.

**One instruction.** System Magazine closes on `Sign up to the System newsletter`
at 39.6px in Times Eighteen Bold, with a plain 19px `Submit` beneath it. No
explainer sentence, no benefit copy, no button fill.

What it is never: a slogan, a mission statement, a giant CTA, a repeated
headline, an oversized logotype used as ornament, or a photograph.

### 3.3 How the focal point avoids becoming a second hero

Four mechanisms, all present in every good example.

**The ratio is 2.2 to 2.6, not 5 or 10.** Measured, focal element against the
footer's own body step:

- Business of Fashion: 36 / 14 = 2.6
- System Magazine: 39.6 / 15.8 = 2.5
- Semplice: 48 / 22 = 2.2
- Art + Commerce: 16 / 10 = 1.6, but the 10px is a *label*, not a body step, and
  every other text element in that footer is the 16px name

This is the number worth carrying away. A footer's focal point is roughly two
and a half times its own small type. Well below the page's headline scale, well
above its list scale.

**It is set in reading type, not display type.** BoF's 36px is a fraction of the
article headlines above it. Nothing in a footer is set at hero scale, so nothing
in a footer competes with a hero.

**It is left-aligned into the same column the links use.** No centring, no full
bleed, no separate treatment. It is the first item in the grid, at a larger size.

**It has no furniture.** No button fill, no border, no icon, no pill. System's
newsletter submit is a word. The Row's is a `>` glyph at 13px.

### 3.4 Closing statements, addresses, imagery: who does it and how much

**Addresses and real contact.** More common than anything else, and it is what
separates a footer that establishes a company from a footer that decorates one.

- Wilhelmina's New York footer is essentially just this:
  `192 Lexington Ave | Floor 15 | New York, NY 10016 | T. (212) 473-0700`, at
  12px grey, beside two short link columns. No brand block, no statement.
- System Magazine prints two working, named email addresses in its footer, one
  for advertising and one for worldwide distribution, at 15.8px — larger than
  most sites set anything in a footer.
- Storm uses its two offices, `Storm UK` and `Storm LA`, as the footer's group
  labels, with the group structure following the company's actual geography.
- Next Management prints its company registration number inside the copyright
  line: `Reg No. 26-6767Y-LSFW`.

**Closing statements.** Rare, and short when present. BoF's one-sentence
descriptor is the only true example among the tall footers. The one site that
closes on a paragraph is Cargo, whose entire single-screen homepage ends on
*"Cargo is a site builder for designers and artists. We are interested in two
main things: helping creative people secure…"* at 14.5px in 75% black, with a
`[more...]` link. Note the size: even when this space does write a paragraph, it
sets it at body scale and does not promote it. Nobody writes a manifesto. Nobody
signs off.

**Imagery in footers.** None. Across every footer read, not one carried a
photograph. The one place imagery reaches the bottom of a page is Tyler
Mitchell's portfolio, which is eleven thousand pixels of photographs and has no
footer at all.

`03-banned-ui.md` §7.1 says a text-only page is unfinished. That rule is about
the *page*. It does not reach the footer, and the industry is unanimous: do not
put a photograph in the footer.

### 3.5 How closure is achieved without a decorative rule

Four devices, in order of how often they appear.

**A field change.** Business of Fashion, Behance, Backstage, Casting Networks
and i-D all invert to a dark field for the footer while the page above is white.
This is the most common closing device in the sample by a wide margin. Pholio
already has this as a first-class system rather than a footer trick, which is a
structural advantage: the field polarity is real infrastructure, and using it to
close a page costs nothing.

**Terminal margin.** Art + Commerce ends on an 8px uppercase copyright with a
band of empty page beneath it. Celine simply stops after two rows. Toteme's
entire footer is one 14px line in 40px of height.

**The list bottoming out.** Art + Commerce's three name columns end within a few
pixels of one another and the composition stops because the register is
exhausted, not because something was drawn under it. This is exactly the
mechanism `VariantRegister`'s own comment claims, and it is correct.

**A plain hairline between the links and the imprint.** IMG and The Row both do
this, both with content on both sides, both 1px, both in the muted rule colour.

**Not one footer in the sample opens with a decorative accent rule across its
top edge.** The gold-sweep-in-the-footer instinct that `lessons.md` §2 already
ruled out has no support anywhere in the space. Confirmed by absence.

### 3.6 On rationing accents

The gold sweep's scarcity has direct industry precedent. In this space a brand
colour is applied to at most one element per surface, and usually zero. Celine,
The Row, Jil Sander, Toteme, IMG, Wilhelmina, Storm, Art + Commerce and System
Magazine all resolve their footers in black, grey and white with no accent
colour at all. The accent colours that do appear are on the SaaS side: Format's
orange field, Behance's blue link, Format's brand-coloured social words.

An accent applied once is a brand asset. An accent applied to a header edge and
a footer edge is a border style. `lessons.md` §2 is correct and the space agrees
with it.

### 3.7 What the best footers include that ordinary ones leave out

**Consumer-protection and safety links, at the same size as everything else.**
This is the most important finding in the document for Pholio specifically.

IMG Models' footer carries, at exactly the same 12px as `About Us`:

- `Recruitment Warning`
- `Under 18 FAQs`
- `New York State Fashion Workers Act`
- `We Love Your Genes`
- `Do not sell my personal info`

Next Management goes further and puts a full-screen interstitial in front of the
site, before any content loads, headed `IMPORTANT NOTICE: BEWARE OF FRAUDULENT
INDIVIDUALS CLAIMING TO REPRESENT NEXT MANAGEMENT`, containing the sentences
*"NEXT Management will NEVER request nude or undergarment photos"* and *"will
NEVER ask for any monetary payment"*, with `Go to site` and `Get Scouted` as the
two exits.

The scam-adjacent modelling site is a known, named industry problem, and the
best-regarded agencies address it **in the chrome, in plain type, at ordinary
size**. Not as a badge, not as a trust seal, not as a marketing claim. As a link
that sits in the footer next to the terms.

Pholio's talent audience is described in the ban list's own preamble as arriving
having been burned by exactly this. The industry's answer to that audience is a
plain link in the footer. Pholio's footer does not currently have one.

**Real contact that reaches a person.** Covered above. An address, a phone
number, or a named email does more for an audience checking whether a company is
real than any adjective the ban list would ban anyway (§9.6).

### 3.8 What ordinary footers include that the best ones leave out

- **Social platform glyphs.** IMG, SSENSE, The Row, System Magazine and i-D all
  write the words: `Instagram`, `TikTok`, `Substack`, `YouTube`. No icons.
- **Newsletter blocks with placeholder copy and a filled button.** Only two
  sites in the sample have a newsletter capture, and both sell a mailing list as
  part of the product (System Magazine, The Row). Both set it as plain type.
- **Region and language pickers dressed as controls.** The Row's is two lines of
  13px text (`Choose language:` / `English`). Celine's is a 10px uppercase link.
  Nobody uses a styled dropdown.
- **Column counts above four.** The fashion sample runs two to four columns.
  Contra, Format, Backstage and Behance run five to eight, which is what an SEO
  matrix looks like.
- **Trust badges, app-store buttons, stats, awards, "made with" lines.** Zero
  across the entire sample.

### 3.9 The two directions in `components/footer/`, specifically

Both are correctly built. Neither has an idea in it, and the measurement says
precisely why.

**Where the flatness is.** `VariantRegister`'s largest element is a product link
at 17.5px against a 13px clerical step: a ratio of **1.35**. `VariantMasthead`
does better, with the address at `clamp(1.25rem, 2vw, 1.6rem)` — 20 to 25.6px
against 13px, a ratio of **1.5 to 2.0**. The industry band for a footer with a
focal point is **2.2 to 2.6**. Both directions sit under it, and `Register` sits
far under it. "Too basic" is the owner's word for a composition where nothing is
allowed to be the subject.

**Enhancement 1: give `Masthead`'s address the real ratio, and make it the
subject.** The address is already the right *choice* of focal element. It is the
one thing on the surface that does what Art + Commerce's roster does: it is what
the company is, not what the company says. Take it to roughly 30 to 34px against
the 13px clerical step and stop treating it as a supporting detail beside the
wordmark. Art + Commerce's model is instructive here — the roster is bigger than
the brand's own name in its footer.

**Enhancement 2: invert the label-to-item relationship.** In both directions the
group label (`GroupLabel`, serif, 15 to 16px) is *larger* than the clerical items
it heads (13px). Every site in the sample does the opposite: Art + Commerce sets
a 10px uppercase label over 16px names, IMG sets no label at all, BoF sets a 14px
bold uppercase label over 14px links. The label is never the biggest thing in its
own column. Take the group labels down below the items they head, or remove them
where the column is self-evident.

**Enhancement 3: add the safety link.** A footer link, in the Legal column, in
the same 13px as its siblings, saying plainly what IMG's `Recruitment Warning`
says. This is the highest-value single addition available and it is not an
invention: it is the convention of the best agency in the sample, and it speaks
directly to the audience the ban list's preamble describes. Copy and destination
are the owner's call; the point is that it belongs in the footer at ordinary
size.

**Enhancement 4: print a real registered address or jurisdiction**, if one can
be published. Wilhelmina's footer is essentially a street address and a phone
number. Next Management puts its registration number in the copyright line. For
an audience screening for whether a company exists, this outperforms every
adjective. It is also explicitly permitted by ban-list §9.12, which allows a real
contact address and bans only atmospheric place-dressing.

**Enhancement 5: set the imprint at 13.5 to 14px**, per §2.4.

**Refuse as overengineering:**

- **A photograph in the footer.** Zero precedent anywhere in the sample.
- **A newsletter capture with a field and a button.** Pholio's equivalent of an
  instruction is already present as a single CTA, `Apply free` (see §4.3 for why
  it isn't the industry's own verb).
- **An oversized wordmark as a bottom-of-page monument.** The giant footer
  logotype is a portfolio-template move, not an industry move. BoF's masthead
  restatement is 36px, which is a heading, not a monument. It also collides with
  ban-list §6.1: scale is not how this system signals importance.
- **A numbered index** in the manner of Semplice's `01 Reviews / 02 Why
  Semplice`. Collides with §3.2 (no section-number eyebrows) and Semplice is the
  SaaS side of the sample anyway.
- **Any second gold sweep, hairline pair, or accent rule at the footer's top
  edge.** Already ruled by `lessons.md` §2, and confirmed by total absence in
  the sample.
- **A five-column link matrix.** The fashion band is two to four.
- **A closing slogan or sign-off sentence longer than BoF's single descriptor.**
- **An entrance animation on the footer.** See §5.

---

## 4. Navigation and secondary chrome

### 4.1 Navigation is a list of proper nouns

The primary navigation of the agency web is territory. IMG: New York, Los
Angeles, Paris, Sydney, London, Milan. Ford: New York, Paris, Los Angeles,
Chicago, Miami, Barcelona, plus Ford Digital, Ford Artists, Ford Brasil. Storm:
Storm UK, Storm LA. Next and Elite open on a city selector as the entire
homepage.

Pholio has no cities and should not invent any. The observation that transfers is
structural: **these navigations name things that exist, not capabilities.** No
"Features", no "Solutions", no "Platform", no "How it works". The header index's
clerical column (More / About / Careers / Contact / Press) is already built this
way and is correct.

### 4.2 Nav type is small, sans, and either uppercase or capitalised

- IMG: 12px, Lay Grotesk, weight 600, uppercase, no added tracking.
- Celine: 10px, Neue Haas Grotesk Text, uppercase, 0.03em.
- SSENSE: 11px, uppercase.
- Wilhelmina: 12px, Futura PT, 0.05em.
- Art + Commerce: 10px, Akzidenz Grotesk, uppercase, 0.03em.
- Campbell Addy: 14px, Arno Pro Display (**serif**), capitalised, 0.05em.
- Tyler Mitchell: 16px, Marion (**serif**), lowercase — `photography`, `films`,
  `exhibitions`, `books`.
- Ford, in its full-screen overlay: 22.4px, weight 700, uppercase.

Two registers, then. A persistent corner mark is 10 to 14px. An overlay index is
allowed to be much larger, and Ford's is the one place uppercase survives past
16px. Pholio's index panel, at serif capitalised
`clamp(2.4rem, 5.4vw, 4.4rem)`, is a more editorial version of Ford's move and
is inside the convention.

### 4.3 The industry's verb is off-limits; the CTA says the free claim instead

IMG, Ford and Next Management all use the exact string `Get Scouted` as their
talent-facing action, and it is genuinely the incumbent convention: it appears
in IMG's top navigation, in Ford's overlay, and as one of the two exits from
Next's fraud interstitial.

Pholio does not use it. The 2026-08 strategic analysis names `get scouted` (with
`get discovered` and `get signed`) as vocabulary the graveyard of predatory
talent platforms shares — Snapcast, ModelManagement.com, Get Scouted the
product — and adjacent to the "procuring auditions/representation" language
California's advance-fee statute regulates. Matching the incumbents on this one
word buys nothing and imports their risk.

The CTA is `Apply free` instead: it names the same action the industry verb
names, and it states the plan's actual differentiating claim (unlimited,
free, no quota lift) rather than a promise of getting found. Do not replace it
with a generic `Sign up` / `Get started` / `Join` either — those say nothing
Pholio is actually offering.

### 4.4 Search is a word, not a field

IMG and Ford both put the word `Search` in the header and open a surface on
click. No inline input, no magnifier glyph with a placeholder, no `⌘K` hint.

### 4.5 The single-screen splash is a live convention, not legacy

Seven agencies serve a non-scrolling front door. It is not neglect; Elite,
Wilhelmina, Kult and Viviens are all recently built and all deliberately stop at
one viewport. Worth knowing before assuming a marketing homepage must be a
scroll journey.

---

## 5. Motion

### 5.1 Half the space ships no motion library at all

Checked by inspecting the loaded scripts on each page:

| Site | Motion machinery |
|---|---|
| The Row, Celine, System Magazine, Next Management, Behance, Semplice, Format | none detected |
| Toteme | Barba (page transitions only) |
| IMG Models | Lenis (smooth scroll only) |
| Ford | GSAP + Barba |
| i-D | GSAP + ScrollTrigger |
| Contra | GSAP |

**Nothing in the fashion or agency half of the sample scrubs a scroll timeline.**
The two sites that carry ScrollTrigger are a magazine (i-D) and a freelance
marketplace (Contra). Where motion exists in the agency sample it is doing one of
exactly two jobs: fading between pages, or smoothing the scroll.

### 5.2 The register

Motion in this space is a *transition*, not a *performance*. A portrait
crossfades to a second frame on hover. A page fades to the next page. Nothing
loops, nothing parallaxes decoratively, nothing counts up, nothing floats.

This is consistent with what Pholio already holds: motion is arrival, one ease,
and `LegalDocumentLayout`'s register is the right default for secondary pages.
The research adds one rule the ban list does not currently state.

### 5.3 Where there is none

No footer in the sample animates on entry. Not one. Roster grids, index pages,
imprints and legal chrome are all static.

**Do not give the footer a staged entrance.** The footer's job is to be at rest.
A reveal on a surface whose purpose is stillness is motion without a
justification, which §8.1 already bans; the industry evidence just makes the
case unambiguous.

---

## 6. Imagery

### 6.1 Square corners, no filters, no overlays

Measured across IMG Models, Art + Commerce and Storm: `border-radius: 0px` on
every image above 120px, without exception. `filter: none` on every image,
without exception.

### 6.2 Portrait is the roster ratio; landscape is the editorial ratio

- IMG Models roster and campaign tiles: aspect ratios 0.67, 0.71, 0.75, 0.77,
  0.80 — that is 2:3 through 4:5. One full-bleed campaign image at 1.89.
- Art + Commerce: 0.75 (3:4) portraits interleaved with 1.28, 1.33 and 1.53
  landscape spreads, all sharing a common height of 797px so the run reads as a
  single band.
- Storm's model index: 1.05, near square.

A talent grid is portrait. An editorial run mixes ratios but holds one height.

### 6.3 Fitted, not cropped

Art + Commerce sets `object-fit: contain` on its portfolio images. The image is
fitted into its frame and never cropped to fill it. This is direct support for
ban-list §7.5 from the closest analogue in the sample.

IMG uses `object-fit: cover` on its grid tiles, which is the trade-off a
mixed-ratio thumbnail grid forces. Where the image is the subject rather than a
thumbnail, the space fits rather than crops.

### 6.4 Captions sit below the frame and name the facts

IMG's captions, exactly as rendered:

- `Anok Yai Ferragamo FW26`
- `Kaleema Donovan Vogue Australia July 2026`
- `Xiao Wen Ju & Paloma Elsesser MCQUEEN FW26`
- `Alex Consani , Anok Yai Gentle Monster x Google & Samsung 2026`

Person, client or publication, season or date. Nothing else. Always below the
image, never overlaid on it. Direct support for §4.9 and §4.10: a caption is a
record, and a real credit contains real names.

### 6.5 A conflict to raise: grayscale

`03-banned-ui.md` §7.3 describes the imagery register as "editorial fashion
photography: grayscale, warm grain, framed rather than cropped".

**Framed rather than cropped is confirmed.** **Grayscale is not.** Every image
in the sample renders in full colour with no CSS filter applied — IMG,
Art + Commerce, Storm, Tyler Mitchell, Campbell Addy, Vogue, i-D, System
Magazine. Grayscale is not this industry's default treatment; it is a website
convention borrowed from architecture and consultancy studios.

The ban list wins, because it is a brand decision and this document does not
overrule brand decisions. But the reason should be stated honestly: grayscale is
a Pholio choice, not an industry norm, and §7.3 currently reads as though the
industry justifies it. Someone should decide that on purpose rather than inherit
it as a research finding, particularly since the sanctioned talent imagery from
`GET /api/public/home` is presumably supplied in colour and a blanket
desaturation would place Pholio's imagery visibly outside the space it is
imitating.

---

## 7. What to avoid, because it reads as tech rather than fashion

Everything in this section was observed on Contra, Format, Behance, Backstage or
Casting Networks, and on none of the fashion or agency sites.

- **Monospace anywhere near a legal or copyright line.** Zero out of fifteen.
- **`system-ui` and `IBM Plex Sans` stacks.** Casting Networks' body font stack
  is `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue"…`, with IBM
  Plex Sans doing the actual footer work. A system stack is a decision not to
  have a typeface. (Business of Fashion's `<body>` also computes to
  `ui-sans-serif, system-ui`, but every element that renders text overrides it
  with Chronicle Display or Helvetica Neue, so the site does not read this way.)
- **Weight 500 as the resting weight for links.** Contra sets every footer link
  at 500. The fashion sample is 400 throughout.
- **Coloured links.** Format's footer prints `YouTube` in `rgb(255,0,0)` and
  `Facebook` in `rgb(8,102,255)`. Behance's inline CTA is `rgb(0,87,255)`.
- **Brand-colour footer fields.** Format's footer background is `rgb(207,74,2)`.
- **Five-to-eight column keyword matrices**, especially with comparison links.
  Contra's footer contains `Gumroad alternative`, `Lemon Squeezy alternative`,
  `Polar alternative`. Format's contains `Online Portfolio Website`.
- **Trademark symbols repeated in body copy.** Casting Networks' copyright line
  prints `®` four times in a single sentence.
- **`Inc.` plus `All Rights Reserved.` in full.** Format:
  `© 2026 Ideaform Inc., All Rights Reserved.` The fashion form is shorter:
  `The Row © 2026`, `© 2026 ssense.com`, `Copyright IMG Worldwide, LLC`.
- **Social platform icons.** The space writes the word.
- **A free-trial or upgrade strip pinned above the footer.** Behance runs
  `Upgrade to Behance Pro today: Get advanced analytics… Start your 7 day free
  trial` immediately above its footer.
- **Uppercase micro-labels tracked past 0.12em.** See §2.2. This is the specific
  measurement that makes the existing mono `Kicker` read as a developer tool
  even before the face is considered.

---

## What could not be read

Stated so nobody assumes silence means absence.

- **The Society Management** returns a single-viewport page whose readable
  content was a cookie dialog only. No footer, navigation or type could be
  observed.
- **Elite Model, Kult, Viviens and Art Partner** serve one non-scrolling screen
  with no footer element on the homepage. Elite's and Wilhelmina's homepages
  carry only a `Mediaslide Model Agency Software` credit line. Elite's Paris page
  behaved identically. Wilhelmina's New York page did render a footer and is
  reported above.
- **Jil Sander** renders a 223px footer whose text could not be extracted from
  the DOM by the method used here. Its body face (a custom Futura cut) and cream
  field (`#FBFBF6`) were read; its footer content was not.
- **i-D** renders a tall dark footer of which only the social word list was
  extractable.
- **System Magazine** prints no copyright line that could be found.
- **The Dots** serves one non-scrolling screen whose text could not be
  extracted. Its body face resolves to Times, which is worth noting given it is
  a creative-industry network rather than a fashion house.
- **harleyweir.com** is currently a holding page reading
  `* Website Under Construction *` in Times Now at 20px.

---

## Sources

Live pages fetched and inspected in a headless Chrome at 1440x900, August 2026.

Agencies and talent representation:
- https://www.imgmodels.com/
- https://www.elitemodel.com/ and https://www.elitemodel.com/paris
- https://www.stormmanagement.com/ and https://www.stormmanagement.com/models
- https://www.nextmanagement.com/
- https://www.fordmodels.com/
- https://www.wilhelmina.com/ and https://www.wilhelmina.com/new-york
- https://www.premiermodelmanagement.com/
- https://www.kultmodels.com/ and https://www.kultmodels.com/berlin
- https://www.viviensmodels.com.au/ and https://www.viviensmodels.com.au/models
- https://www.thesocietymanagement.com/
- https://www.artpartner.com/
- https://www.artandcommerce.com/

Houses, retail and editorial:
- https://www.therow.com/
- https://www.celine.com/en-us/home
- https://www.jilsander.com/us/ and https://www.jilsander.com/us/women/
- https://toteme-studio.com/
- https://www.ssense.com/en-us
- https://www.vogue.com/fashion-shows
- https://www.businessoffashion.com/
- https://system-magazine.com/
- https://i-d.co/

Creative platforms and portfolio hosts:
- https://www.behance.net/
- https://cargo.site/
- https://www.format.com/
- https://semplice.com/
- https://contra.com/
- https://www.backstage.com/
- https://www.castingnetworks.com/
- https://the-dots.com/

Photographer and studio portfolios:
- https://tylermitchell.co/
- https://www.campbelladdy.com/
- https://harleyweir.com/
