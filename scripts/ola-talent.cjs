"use strict";

/**
 * The one talent record the home page's product renders are driven from.
 *
 * The comp cards and the Studio+ portfolio are the same person on the same
 * page, so they read the same record. Two copies would eventually disagree,
 * and a page whose card says one thing and whose website says another fails
 * the standard the rest of this sequence was held to (`lessons.md` §21).
 *
 * MEASUREMENTS ARE PUBLISHED, NOT DERIVED. They cannot be read off the
 * photographs; they come from the model or her agency. The figures below are
 * the ones published on her own profile and on her agency's post, checked
 * against each other on 2026-09-04:
 *
 *   height 169 cm, hair blonde, eyes blue
 *     https://cherrydeck.com/olaszkolda (her profile; Warsaw)
 *   height 169 cm, bust 77, waist 58, hips 84 cm, shoes EU 38, eyes blue
 *     https://www.deviantart.com/newclassicagency/art/OLA-SZKOLDA-POLISH-FASHION-TOP-MODEL-1236334814
 *     (posted by her agency's account, 2025-08-31)
 *
 * The height agrees across both, which is what lets the second source carry
 * the body measurements. Confirm them with her before print. Every field
 * still marked PROVISIONAL has no published source and stays `null`: the
 * comp-card back and the portfolio's stats formatter both omit what they are
 * not given, so a null renders as an absent line rather than an invented one.
 * Inventing a figure for a real, named person is a misrepresentation of her.
 */

const TALENT = {
  id: "ola-szkolda",
  slug: "ola-szkolda",
  user_id: "ola-szkolda",
  first_name: "Ola",
  last_name: "Szkolda",
  gender: "Female",

  age: null, // PROVISIONAL
  date_of_birth: null, // PROVISIONAL
  height_cm: 169,
  bust_cm: 77,
  waist_cm: 58,
  hips_cm: 84,
  dress_size: null, // PROVISIONAL
  shoe_size: 38, // EU
  city: "Warsaw",

  hair_color: "blonde",
  eye_color: "blue",

  bio_curated: null, // PROVISIONAL
  training: null,
  portfolio_url: null,
  instagram_handle: null,
  instagram_url: null,
  twitter_handle: null,
  twitter_url: null,
  tiktok_handle: null,
  tiktok_url: null,
  nationality: null,
  union_membership: null,
  ethnicity: null,
  tattoos: null,
  piercings: null,
  languages: null,
  availability_travel: null,
  availability_schedule: null,
  experience_level: null,

  is_pro: true,
  is_public: true,
  image_analysis: JSON.stringify({
    lookType: "editorial",
    marketSignals: ["editorial", "commercial"],
  }),
};

const ARCHETYPE = {
  label: "Editorial",
  verdict: "Editorial range with a commercial book.",
};

/**
 * Shot types are the app's own taxonomy (`shared/constants/frame-taxonomy.js`),
 * assigned by what each photograph actually is. The comp-card engine ranks
 * from these, so a wrong label here produces a wrong card.
 */
const PHOTOS = [
  { file: "05-editorial-standing.jpg", shot_type: "half_body", label: "Editorial standing" },
  { file: "02-full-body-columns.jpg", shot_type: "full_length", label: "Full length" },
  { file: "03-leaning-three-quarter.jpg", shot_type: "three_quarter", is_primary: true, label: "Three quarter" },
  { file: "07-studio-closeup-bw.jpg", shot_type: "headshot", label: "Studio headshot" },
  { file: "06-close-jewelry.jpg", shot_type: "detail", label: "Detail" },
  { file: "01-walking-columns.jpg", shot_type: "full_length", label: "Walking" },
  { file: "04-front-with-bag.jpg", shot_type: "three_quarter", label: "Front, commercial" },
];

/**
 * The hero, locked rather than ranked, and shared by both renders.
 *
 * The capture beat morphs this exact frame into the comp card, and the
 * portfolio's hero is the same photograph again, so the book and the site
 * open on one image.
 */
const HERO_PHOTO = "03-leaning-three-quarter.jpg";

module.exports = { TALENT, ARCHETYPE, PHOTOS, HERO_PHOTO };
