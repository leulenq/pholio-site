"use strict";

/**
 * The one talent record the home page's product renders are driven from.
 *
 * The comp cards and the Studio+ portfolio are the same person on the same
 * page, so they read the same record. Two copies would eventually disagree,
 * and a page whose card says one thing and whose website says another fails
 * the standard the rest of this sequence was held to (`lessons.md` §21).
 *
 * MEASUREMENTS ARE UNRESOLVED. They are the one thing here that cannot be
 * derived from the photographs; they have to come from the model or her
 * agency. Every field marked PROVISIONAL below is `null` on purpose: the
 * comp-card engine and the portfolio's stats formatter both omit what they are
 * not given, so a null renders as an absent line rather than an invented one.
 * Inventing figures for a real, named person is a misrepresentation of her.
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
  height_cm: null, // PROVISIONAL
  bust_cm: null, // PROVISIONAL
  waist_cm: null, // PROVISIONAL
  hips_cm: null, // PROVISIONAL
  dress_size: null, // PROVISIONAL
  shoe_size: null, // PROVISIONAL
  city: null, // PROVISIONAL

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
  { file: "05-editorial-standing.jpg", shot_type: "half_body", is_primary: true, label: "Editorial standing" },
  { file: "02-full-body-columns.jpg", shot_type: "full_length", label: "Full length" },
  { file: "03-leaning-three-quarter.jpg", shot_type: "three_quarter", label: "Three quarter" },
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
const HERO_PHOTO = "05-editorial-standing.jpg";

module.exports = { TALENT, ARCHETYPE, PHOTOS, HERO_PHOTO };
