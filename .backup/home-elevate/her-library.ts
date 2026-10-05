/**
 * Her library: sixty of Ola Szkolda's own photographs, as she uploads them
 * to Unsplash (@olaszkolda), from ten sittings: studio and location,
 * colour and monochrome, portrait and landscape, beauty to full length.
 * This is the material a talent brings to Pholio. Pholio did not make any
 * of it (`lessons.md` §49).
 *
 * `shot` is the framing each photograph actually is, in pholio-app's own
 * taxonomy (`src/shared/constants/frame-taxonomy.js`), tagged by hand
 * against the picture the way PITS classifies it: the photograph, never
 * the person.
 *
 * `role` marks the frames the comp card is composed from: the Cover
 * Story's hero, and the four complementary frames on its back
 * (`scripts/comp-cards-ola/render.cjs`).
 *
 * Files: public/home/library/<id>.webp, 720px tall.
 */

export type Shot =
  | "headshot"
  | "half_body"
  | "three_quarter"
  | "full_length"
  | "profile"
  | "back"
  | "detail";

export type LibraryItem = {
  /** Unsplash photo id. */
  id: string;
  shot: Shot;
  /** Width over height. */
  aspect: number;
  role?: "hero" | "back";
};

/** The order the piles stand in, and the label each carries. */
export const SHOTS: { shot: Shot; label: string }[] = [
  { shot: "headshot", label: "Headshot" },
  { shot: "half_body", label: "Half body" },
  { shot: "three_quarter", label: "Three-quarter" },
  { shot: "full_length", label: "Full length" },
  { shot: "profile", label: "Profile" },
  { shot: "back", label: "Back" },
  { shot: "detail", label: "Detail" },
];

export const librarySrc = (id: string) => `/home/library/${id}.webp`;

export const LIBRARY: LibraryItem[] = [
  { id: "C4FiV6JCA4Y", shot: "headshot", aspect: 0.8 },
  { id: "an-zckGQiDU", shot: "headshot", aspect: 0.8 },
  { id: "4wU52Mi1MKA", shot: "headshot", aspect: 0.8 },
  { id: "dtneDawQn9s", shot: "headshot", aspect: 0.8 },
  { id: "t29xtYbNvLQ", shot: "headshot", aspect: 0.667 },
  { id: "gUZApw7sR_w", shot: "headshot", aspect: 0.8 },
  { id: "YRFzBvyrHfI", shot: "headshot", aspect: 0.8 },
  { id: "9V9qS-dgGzE", shot: "headshot", aspect: 0.667, role: "back" },
  { id: "Y7Z11Dhre6E", shot: "headshot", aspect: 0.667 },
  { id: "Q7o-22z-yQw", shot: "headshot", aspect: 0.667 },
  { id: "rQ6NqGFWoX0", shot: "headshot", aspect: 0.667 },
  { id: "U0QrIfsGFc4", shot: "headshot", aspect: 0.662 },
  { id: "eo1ZFYlx4MA", shot: "headshot", aspect: 0.662 },
  { id: "zWvQ7tPaQHw", shot: "headshot", aspect: 0.662 },
  { id: "p250tH4k74A", shot: "headshot", aspect: 0.662 },
  { id: "T7RvhpZsqGU", shot: "headshot", aspect: 0.662 },
  { id: "wSpCmF1PYRY", shot: "headshot", aspect: 0.667 },
  { id: "vx_KGS9LhDk", shot: "headshot", aspect: 0.667 },
  { id: "nYL1Eh2q2fA", shot: "headshot", aspect: 0.667, role: "back" },
  { id: "hVKq6TpfYsQ", shot: "headshot", aspect: 1.508 },
  { id: "4g8S87dVQ98", shot: "half_body", aspect: 0.667 },
  { id: "OUzZ2vbALsQ", shot: "half_body", aspect: 0.8, role: "back" },
  { id: "mbZGk188GJA", shot: "half_body", aspect: 0.8 },
  { id: "RZq30SQCTW8", shot: "half_body", aspect: 0.667 },
  { id: "8PNDUQtixvs", shot: "half_body", aspect: 0.662 },
  { id: "ltv3QTrEM2U", shot: "half_body", aspect: 0.667 },
  { id: "fBsn-7LlsN0", shot: "half_body", aspect: 0.8 },
  { id: "lcOK0Q-72is", shot: "three_quarter", aspect: 0.667 },
  { id: "riHmBtbm-JE", shot: "three_quarter", aspect: 0.667 },
  { id: "K8T29zb8f8Y", shot: "three_quarter", aspect: 0.667 },
  { id: "Q-4Xq4919xk", shot: "three_quarter", aspect: 0.662 },
  { id: "tw50-AerHOg", shot: "three_quarter", aspect: 0.662 },
  { id: "QNnhd54SVAA", shot: "three_quarter", aspect: 0.667 },
  { id: "zqKUzrDZpG8", shot: "three_quarter", aspect: 0.662 },
  { id: "rT4CrEMZNPQ", shot: "full_length", aspect: 0.667 },
  { id: "SU3iUmmtjq0", shot: "full_length", aspect: 0.667 },
  { id: "XaSmLh9VeRA", shot: "full_length", aspect: 0.667 },
  { id: "T6QKnkoltks", shot: "full_length", aspect: 0.667 },
  { id: "bov3dwNWm-4", shot: "full_length", aspect: 0.667 },
  { id: "KveoS7HvXq8", shot: "full_length", aspect: 0.667 },
  { id: "yAxlj92R9Xg", shot: "full_length", aspect: 0.667, role: "back" },
  { id: "4Zwp8O3Zmos", shot: "full_length", aspect: 0.667, role: "hero" },
  { id: "XGvrHo4DSuw", shot: "full_length", aspect: 0.667 },
  { id: "sOYqoWidOFU", shot: "full_length", aspect: 0.662 },
  { id: "eo_eBIDuJkQ", shot: "full_length", aspect: 0.732 },
  { id: "f1bGNPDeDO0", shot: "full_length", aspect: 0.732 },
  { id: "VYyAaOqctHc", shot: "full_length", aspect: 0.667 },
  { id: "WTXNjg-vNH0", shot: "full_length", aspect: 0.667 },
  { id: "y-0iCW0qQhA", shot: "full_length", aspect: 0.667 },
  { id: "r4gxJYebyWA", shot: "profile", aspect: 1.56 },
  { id: "m60lHgYnxAI", shot: "profile", aspect: 0.662 },
  { id: "dMhwMXAvPao", shot: "profile", aspect: 0.8 },
  { id: "Wgk4ZPIYqos", shot: "profile", aspect: 1.365 },
  { id: "NxWXzGbZU-o", shot: "back", aspect: 0.667 },
  { id: "ZQ3NxUwRJrQ", shot: "back", aspect: 0.662 },
  { id: "T1sohRer5hg", shot: "back", aspect: 0.662 },
  { id: "NpBfwUPnDK4", shot: "detail", aspect: 0.667 },
  { id: "2CzjHAuVJ_s", shot: "detail", aspect: 0.667 },
  { id: "0FapEC6FwtA", shot: "detail", aspect: 0.667 },
  { id: "gKEFqs0tYAc", shot: "detail", aspect: 0.667 },
];
