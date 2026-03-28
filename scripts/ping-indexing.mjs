#!/usr/bin/env node
/**
 * Post-deploy indexing reminder (Stage 6).
 *
 * After static export, open:
 *   https://oceancalc.com/api/ping
 * for JSON with sitemap URL + Search Console link (pre-rendered at build).
 *
 * Google’s legacy sitemap ping is deprecated (404). Rely on fresh `lastmod` in
 * sitemap.xml and GSC → Sitemaps.
 *
 * Env: NEXT_PUBLIC_SITE_URL (optional)
 */

const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://oceancalc.com").replace(
  /\/$/,
  ""
);

console.log("OceanCalc indexing checklist");
console.log("—".repeat(50));
console.log(`Sitemap (submit in GSC): ${base}/sitemap.xml`);
console.log(`Deploy trigger JSON:     ${base}/api/ping`);
console.log("Google Search Console:     https://search.google.com/search-console");
console.log("");
console.log(
  "In GSC: add property for oceancalc.com → Sitemaps → submit the sitemap URL above."
);
console.log(
  "Optional: URL Inspection → request indexing for homepage and priority /tools/ pages."
);
console.log("");
console.log(
  "Note: Automated Google sitemap ping URLs are deprecated; use Search Console."
);
