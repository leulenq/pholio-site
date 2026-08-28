# reference-capture

Helpers for the procedure in
[`docs/design-language/06-reference-capture.md`](../../docs/design-language/06-reference-capture.md).

Nothing here ships. These run against third-party sites in a headless browser,
never against this site's build.

- **`motion-forensics.js`** — page init script. Registered *before* first
  navigation, it wraps `addEventListener`, `requestAnimationFrame`,
  `IntersectionObserver`, `Element.animate` and `window.scrollTo`, and records
  what the page registers into `window.__forensics`, with the call site of each
  registration. Read it after driving the page.

  ```bash
  agent-browser --session fx open --init-script "$PWD/scripts/reference-capture/motion-forensics.js" <url>
  ```
