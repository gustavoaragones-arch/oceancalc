#!/usr/bin/env node
/**
 * Post-deploy indexing reminder (Stage 6.4).
 *
 * Run `npm run ping` to hit Google’s sitemap ping + log status (see scripts/ping.js).
 *
 * Static export also pre-renders:
 *   GET {base}/ping/   — build-time ping result JSON (Phase 6.4.1)
 *   GET {base}/api/ping — checklist JSON (sitemap + GSC links)
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
console.log(`Live ping script:        npm run ping`);
console.log(`Build-time ping JSON:    ${base}/ping/`);
console.log(`Checklist JSON:          ${base}/api/ping`);
console.log("Google Search Console:   https://search.google.com/search-console");
console.log("");
console.log(
  "In GSC: Sitemaps → submit sitemap URL. URL Inspection → request indexing for priority tools."
);
console.log("");
console.log("Priority tools: /tools/nautical-mile-converter/, /tools/knots-to-kmh/, /tools/hull-speed-calculator/");
