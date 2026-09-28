/**
 * The colour Safari and Chrome paint into the bands around the browser
 * chrome. iOS 26 Safari ignores `theme-color` for that tint and reads the
 * root background instead, so a velvet document canvas shows up as black
 * bars on a cream page. One value, written onto `html`, is the policy.
 *
 * Legal documents open on cream paper. Everything else opens on velvet.
 * The live sampler in `components/ViewportCanvas.tsx` replaces this once
 * the page under the chrome is actually measurable.
 */

export const VIEWPORT_INK = "#050505";
export const VIEWPORT_CREAM = "#FAF7F2";

export const CREAM_ROUTE_PREFIXES = [
  "/terms",
  "/privacy",
  "/cookies",
  "/dmca",
  "/ai-notice",
  "/community-guidelines",
  "/take-it-down",
  "/legal",
] as const;

export function fieldForPath(pathname: string | null): "ink" | "cream" {
  if (!pathname) return "ink";
  return CREAM_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
    ? "cream"
    : "ink";
}

export function canvasForPath(pathname: string | null): string {
  return fieldForPath(pathname) === "cream" ? VIEWPORT_CREAM : VIEWPORT_INK;
}

/** `rgb(r, g, b)` so hex hints and sampled computed colours compare equal. */
export function canonicalCanvasColor(color: string): string | null {
  const hex = color.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split("").map((channel) => channel + channel).join("");
    const n = Number.parseInt(h, 16);
    return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
  }

  const rgb = color.match(
    /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i,
  );
  if (!rgb) return null;
  return `rgb(${Math.round(Number(rgb[1]))}, ${Math.round(Number(rgb[2]))}, ${Math.round(Number(rgb[3]))})`;
}

/** Same threshold the header uses to decide ink against cream. */
export function colorSchemeFor(color: string): "light" | "dark" {
  const canonical = canonicalCanvasColor(color);
  if (!canonical) return "dark";
  const parts = canonical.match(/rgb\((\d+), (\d+), (\d+)\)/);
  if (!parts) return "dark";
  const r = Number(parts[1]);
  const g = Number(parts[2]);
  const b = Number(parts[3]);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.55 ? "light" : "dark";
}

/**
 * Paint the document canvas and the `theme-color` meta (still read by
 * Android Chrome and older iOS). No-ops when the canonical colour has not
 * changed, so a sampler and a route hint cannot thrash each other.
 */
export function applyViewportCanvas(color: string) {
  if (typeof document === "undefined") return;
  const canonical = canonicalCanvasColor(color);
  if (!canonical) return;

  const root = document.documentElement;
  if (root.dataset.viewportCanvas !== canonical) {
    root.dataset.viewportCanvas = canonical;
    root.style.backgroundColor = canonical;
    root.style.setProperty("--viewport-canvas", canonical);
    root.style.colorScheme = colorSchemeFor(canonical);
    if (document.body) document.body.style.backgroundColor = canonical;
  }

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta && meta.content !== canonical) meta.content = canonical;
}

/**
 * Runs from the root layout before first paint, so a cream route does not
 * flash the velvet canvas into the status-bar and toolbar bands.
 */
export function viewportBootScript(): string {
  const routes = JSON.stringify(CREAM_ROUTE_PREFIXES);
  return `!function(){try{var cream=${routes};var path=location.pathname;var ink=1;for(var i=0;i<cream.length;i++){var r=cream[i];if(path===r||path.indexOf(r+"/")===0){ink=0;break}}var color=ink?"${VIEWPORT_INK}":"${VIEWPORT_CREAM}";var root=document.documentElement;root.dataset.viewportCanvas=color;root.style.backgroundColor=color;root.style.setProperty("--viewport-canvas",color);root.style.colorScheme=ink?"dark":"light";var meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute("content",color);}catch(e){}}();`;
}
