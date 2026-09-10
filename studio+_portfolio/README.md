# Studio+ portfolio

Zofia's site: a one-page personal website for a working fashion model, and the
evidence piece for the Studio+ beat of the home stage. It shows what Studio+
can make possible for a talent's own presence on the web: not a profile, a
site of her own.

It is deliberately not a Pholio surface. Its own paper, type, navigation,
image treatment and pacing. If it read as a small Pholio page it would have
failed its purpose.

## Where it lives

| What | Where |
|---|---|
| The site | `public/zofia/` (`index.html`, `assets/`). Served at `/zofia` (rewrite in `next.config.ts`). |
| The home-stage beat | `components/studio-site/` (`motion.ts`, `index.tsx`, `useSiteFrame.ts`), mounted by `components/hero/index.tsx` as the third timeline of the pinned stage. |
| This workspace | `studio+_portfolio/`: the inspirations, the image manifest, the cutout tool, this file. |

Open the site on its own:

```bash
tmux new-session -d -s dev "npm run dev"
open http://localhost:3001/zofia
```

It is a single self-contained document. Fonts come from Google Fonts,
photographs from the Unsplash CDN, GSAP and Lenis from cdnjs and jsdelivr. No
build step.

## The site, in order

1. **Masthead.** The subject is cut from her photograph and stands on the
   paper itself: no frame, no edge, the page is the background. "Zofia" is set
   behind her at the measure; "Nowicka" is printed across her in front,
   blending to bone where it crosses the black. Figure, name and negative
   space read as one object. On scroll the print holds while the next section
   slides up over it.
2. **Statement.** One italic sentence with two pictures set inside it.
3. **The Book.** Eleven frames on a horizontal track driven by the vertical
   scroll, at mixed heights and offsets, each with a slow inner drift.
4. **Tearsheets.** A typographic index; on a fine pointer the frame follows
   the hand, on touch a row opens in place.
5. **Digitals.** Seven honest frames from one sitting.
6. **Card.** Measurements as a ledger, with a sticky portrait.
7. **Contact.** One wide frame, the ways to reach her, the first name at
   full width.

Narrow viewports get the same page told top to bottom. Reduced motion gets a
static page with a native horizontal book.

## The Studio+ beat on the home stage

The beat changes worlds: from the card story into Zofia's, and through the
plus into her site. Everything before it is Pholio doing things with the
book; the subject becomes Zofia because what is shown from here is a site
of one's own. The object on stage is the real `/zofia`, framed same-origin
with `?embed`, never a picture of it.

One mechanism carries the entrance: a camera travelling forward. Nothing
fades, nothing wipes, nothing slides in from an edge.

1. **The push, into the card.** The card is held out to us at the close of
   its own beat. The move begins at the one part of it that is already blank
   stock, the masthead band its name is printed in, with the mark taking the
   place of the name. The band opens down the card's face, taking the
   photograph, and then the whole card comes toward the viewer, its rounded
   corners sweeping outward, until the card's own stock is the whole frame
   and we are inside it. Nothing is swapped for anything: the material never
   changes, only the distance. The card is paper, and the page it becomes is
   the same paper. STUDIO settles into its own size as the paper lands, set
   in caps of the display serif and filled with a navy duotone cut from the
   taffeta of the dress Zofia stands in when her site composes
   (`public/studio-plus/taffeta-navy.webp`). The Pholio header stands down
   as the paper takes the frame, and stays down until the closing panel.
2. **The plus.** Gold, the serif's own cross drawn geometrically from the
   glyph's measurements, in along the axis. Punctuation, until it is not.
3. **The plus opens.** Its arms extend until the cross divides the frame. As
   they extend the solid gold hollows to a hairline rim, and inside the rim
   is the first blank page of her site. The rim widens and turns as it
   widens, taking the letters from the centre outward, and inside it her
   masthead composes. When the rim has left the frame there is no mark and
   no plus. The visitor is on her page and never saw it arrive.
4. **The walk.** The scroll drives her page through the masthead, the
   statement and along the book.
5. **The step back.** The site recedes into a live window on the stage's own
   paper, and beside it only "Not a profile. A site." and one link.

The card's rest position is read off `[data-lead-card]`, a geometry hook on
the lead card carrying no styling, accepted only once six consecutive frames
agree and the reading matches the authored rest. The mark is SVG text with a
pattern fill rather than a clipped background, so the fabric travels with the
glyphs under any transform in every engine.

In `?embed` mode the site runs no smooth-scroll layer, holds its masthead
intro as a paused timeline, hides its scrollbar, and speaks three
origin-checked messages: `zn:scroll` and `zn:intro` in, `zn:ready` with the
scene marks out. The channel is documented in
`components/studio-site/useSiteFrame.ts`; every number the beat moves on is
in `components/studio-site/motion.ts`; the scroll budget is `SITE_VH` in
`components/hero/motion.ts`.

`next.config.ts` narrows the sitewide `X-Frame-Options: DENY` to `SAMEORIGIN`
for `/zofia` only. The document holds no credentials and never calls `/api`.

## The person and the facts

Every photograph is of **one person**, Ola Szkolda, a Polish fashion model
who publishes her own work on Unsplash (`@olaszkolda`). `images.json` maps
every frame to its Unsplash page and CDN path; Unsplash licence applies. The
comp-card beat before Studio+ prints her name; the Studio+ beat is the
intentional break, and its subject is the fictional **Zofia Nowicka**.

Everything on the site besides the photographs is fictional and recorded
here so nobody mistakes it for a claim about her:

- The name, the email, the Instagram handle.
- The agencies **Północ Models**, **Casa Lume**, **Rue Neuve**.
- Measurements, the availability date, the "measured on" date, the tearsheet
  categories and years, the frame titles and places.

If this site is ever shown publicly, swap the identity and facts for the
talent the page is actually about, or keep the fiction and say so.

The hero figure (`public/zofia/assets/figure-*.webp`) is Unsplash
`s_bnYNADA18` with its background removed on this machine by
`tools/cutout.swift`, a small Vision-framework tool:

```bash
swiftc -O -o cutout tools/cutout.swift && ./cutout in.jpg out.png
```

Pick frames whose silhouette is complete on every side except the one that
bleeds off the page; a fade along a cropped edge gives the cutout away.

## Studying it

The three inspirations in `inspirations/` and the Aura template were
references, not instructions. Kept: a name-as-masthead hero with the subject
layered through the type, a one-page structure with a cinematic pace.
Rejected: Inter, the six-card work grid, identical section shells, stat
tiles, "Let's work together", stock faces of different people, rounded
content panels, and a laptop mockup for the landing page.
