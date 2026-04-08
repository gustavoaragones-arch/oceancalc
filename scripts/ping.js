#!/usr/bin/env node
/**
 * Phase 6.4.2 — Post-deploy indexing trigger.
 * Phase 6.4.3 — Manual GSC priority hints (below).
 * Phase 6.4.4 — Run after each deploy (e.g. CI: npm run ping).
 * Phase 6.4.5 — Logs HTTP status from Google’s response.
 *
 * Pings Google’s legacy sitemap endpoint (may return non-2xx; still used as a crawl nudge).
 *
 * Env: NEXT_PUBLIC_SITE_URL (optional) — defaults to https://oceancalc.com
 *
 * --- Priority pages for Search Console → URL Inspection (6.4.3) ---
 * Tools (high priority):
 *   …/tools/nautical-mile-converter/
 *   …/tools/knots-to-kmh/
 *   …/tools/hull-speed-calculator/
 * Also request indexing for: / (home), /tools/, /navigation/, /knots/,
 * /wind-waves/, /sailing/, /maritime-measurements/
 *
 * --- Crawl strategy (6.4.4) ---
 * After deploy: npm run ping, confirm sitemap.xml updated, homepage lists latest tools.
 * Frequency: daily early launch (7–10 days), then weekly.
 */

const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://oceancalc.com").replace(
  /\/$/,
  ""
);
const sitemapUrl = `${base}/sitemap.xml`;
const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
const sitePingUrl = `${base}/ping/`;

async function pingGoogle() {
  const res = await fetch(googlePingUrl);
  console.log("[ping] Google sitemap ping HTTP status:", res.status);
  console.log("[ping] Sitemap:", sitemapUrl);
  return res;
}

async function probeSitePing() {
  try {
    const res = await fetch(sitePingUrl);
    const body = await res.text();
    console.log("[ping] Site", sitePingUrl, "HTTP:", res.status);
    if (body.length > 0 && body.length < 500) {
      console.log("[ping] Body:", body);
    }
  } catch (e) {
    console.log("[ping] Optional GET", sitePingUrl, "failed:", e?.message || e);
  }
}

pingGoogle()
  .then(() => {
    console.log("Pinged Google");
    return probeSitePing();
  })
  .catch(() => {
    console.log("Ping failed");
    process.exitCode = 1;
  });
