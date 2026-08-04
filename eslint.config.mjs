import next from "eslint-config-next";

/**
 * Native flat config.
 *
 * The previous site loaded the old `extends` format through the `FlatCompat`
 * shim from `@eslint/eslintrc`. That throws on ESLint 10 ("Converting circular
 * structure to JSON"), and `eslint-config-next`'s bundled
 * `eslint-plugin-react` is not ESLint 10 compatible either — hence ESLint 9
 * pinned in package.json. Don't bump ESLint until Next ships a compatible
 * config; you will get a confusing crash rather than a version error.
 */
const config = [
  { ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"] },

  ...next,

  {
    rules: {
      /**
       * KNOWN DEBT — downgraded, not dismissed.
       *
       * Six call sites trip this, all in surfaces carried over from the
       * previous site (components/header/kit.tsx, HeaderWrapper.tsx,
       * CookieConsentBanner.tsx). They fall into two groups:
       *
       *  1. Reading an external store on mount (sessionStorage for the
       *     `?header=` override, the consent cookie). This is close to a false
       *     positive — synchronising with an external system is what effects
       *     are for — but the read is synchronous in the effect body.
       *
       *  2. Genuine prop-to-state mirroring: `useEffect(() => setField(theme),
       *     [theme])` in useHeaderState and useFieldPolarity. The header field
       *     is synced in two places at once. That IS a smell and should be
       *     derived rather than mirrored.
       *
       * Group 2 is worth fixing. It is deliberately not fixed here because the
       * header's polarity machine drives scroll-tied colour flips that can only
       * be judged in a browser, and a clean-slate commit is the wrong place to
       * change behaviour that currently works. Fix it in its own change, with
       * a visual pass. Do not add new violations in new code.
       */
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default config;
