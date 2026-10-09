const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const path = require("node:path");

async function check(expected) {
  const loadConfig = require("next/dist/server/config").default;
  const { PHASE_PRODUCTION_BUILD } = require("next/constants");
  const config = await loadConfig(PHASE_PRODUCTION_BUILD, process.cwd());
  // Next's config transpiler has loaded this TypeScript module into the require cache.
  const seo = require(path.join(process.cwd(), "lib/seo.ts"));
  assert.equal(seo.INDEXING_ENABLED, expected);
  const metadata = seo.pageMetadata("/talent");
  assert.equal(metadata.robots.index, expected);
  assert.equal(metadata.alternates.canonical, "https://www.pholio.studio/talent");
  const headers = await config.headers();
  const global = headers.find((rule) => rule.source === "/:path*").headers;
  assert.equal(global.some((header) => header.key === "X-Robots-Tag" && header.value.includes("noindex")), !expected);
  const redirect = (await config.redirects())[0];
  assert.equal(redirect.has[0].value, "pholio.studio");
  assert.equal(redirect.permanent, true);
}
if (process.argv[2]) {
  check(process.argv[2] === "index").catch((error) => { console.error(error); process.exitCode = 1; });
} else {
  for (const [label, overrides, expected] of [
    ["production", {}, true],
    ["Netlify production", { CONTEXT: "production" }, true],
    ["Netlify deploy preview", { CONTEXT: "deploy-preview" }, false],
    ["Netlify branch deploy", { CONTEXT: "branch-deploy" }, false],
    ["Vercel preview", { VERCEL_ENV: "preview" }, false],
    ["Vercel development", { VERCEL_ENV: "development" }, false],
    ["explicit staging override", { PHOLIO_INDEXING: "disabled" }, false],
  ]) {
    const env = { ...process.env, CONTEXT: "", VERCEL_ENV: "", PHOLIO_INDEXING: "", ...overrides };
    execFileSync(process.execPath, [__filename, expected ? "index" : "noindex"], { env, stdio: "pipe" });
    console.log(`PASS ${label}`);
  }
}
