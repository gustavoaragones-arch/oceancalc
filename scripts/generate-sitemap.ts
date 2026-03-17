/**
 * Generates sitemap index + section sitemaps for SEO.
 * Run: npm run sitemap (or npx tsx scripts/generate-sitemap.ts)
 * Reads NEXT_PUBLIC_SITE_URL from .env.local, falls back to https://oceancalc.com
 *
 * Output in public/:
 *   sitemap.xml (index)
 *   sitemap-calculators.xml
 *   sitemap-navigation.xml
 *   sitemap-measurements.xml
 *   sitemap-knots.xml
 *   sitemap-wind-waves.xml
 *   sitemap-sailing.xml
 *   sitemap-pages.xml
 */

import * as fs from "fs";
import * as path from "path";

function loadEnvLocal(): void {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf-8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*NEXT_PUBLIC_SITE_URL\s*=\s*(.+)\s*$/);
    if (m) {
      process.env.NEXT_PUBLIC_SITE_URL = m[1].trim().replace(/^["']|["']$/g, "");
      break;
    }
  }
}

loadEnvLocal();
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oceancalc.com";
const DATA_DIR = path.join(process.cwd(), "data");
const PUBLIC_DIR = path.join(process.cwd(), "public");

function loadJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function getSlugs(json: Array<{ slug: string }>): string[] {
  return json.map((e) => e.slug);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc: string, changefreq: string, priority: string): string {
  return `
 <url>
  <loc>${escapeXml(loc)}</loc>
  <changefreq>${changefreq}</changefreq>
  <priority>${priority}</priority>
 </url>`;
}

function writeUrlset(filename: string, entries: string[]): void {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join("")}
</urlset>
`;
  const outPath = path.join(PUBLIC_DIR, filename);
  fs.writeFileSync(outPath, xml, "utf-8");
  console.log(`  ${filename}: ${entries.length} URLs`);
}

function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  // --- sitemap-calculators.xml (/tools/*, /calculators/*) ---
  const calculators = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "calculators.json")
  );
  const calcEntries = getSlugs(calculators).map((slug) =>
    urlEntry(`${BASE_URL}/tools/${slug}/`, "monthly", "0.9")
  );
  writeUrlset("sitemap-calculators.xml", calcEntries);

  // --- sitemap-navigation.xml (/navigation/*) ---
  const navigation = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "navigation.json")
  );
  const navEntries = getSlugs(navigation).map((slug) =>
    urlEntry(`${BASE_URL}/navigation/${slug}/`, "monthly", "0.8")
  );
  writeUrlset("sitemap-navigation.xml", navEntries);

  // --- sitemap-measurements.xml (/maritime-measurements/*) ---
  const measurements = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "measurements.json")
  );
  const measEntries = getSlugs(measurements).map((slug) =>
    urlEntry(`${BASE_URL}/maritime-measurements/${slug}/`, "monthly", "0.8")
  );
  writeUrlset("sitemap-measurements.xml", measEntries);

  // --- sitemap-knots.xml (/knots/*) ---
  const knots = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "knots.json")
  );
  const knotEntries = getSlugs(knots).map((slug) =>
    urlEntry(`${BASE_URL}/knots/${slug}/`, "monthly", "0.8")
  );
  writeUrlset("sitemap-knots.xml", knotEntries);

  // --- sitemap-wind-waves.xml (/wind-waves/*) ---
  const windWaves = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "wind-waves.json")
  );
  const wwEntries = getSlugs(windWaves).map((slug) =>
    urlEntry(`${BASE_URL}/wind-waves/${slug}/`, "monthly", "0.8")
  );
  writeUrlset("sitemap-wind-waves.xml", wwEntries);

  // --- sitemap-sailing.xml (/sailing/*) ---
  const sailing = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "sailing.json")
  );
  const sailEntries = getSlugs(sailing).map((slug) =>
    urlEntry(`${BASE_URL}/sailing/${slug}/`, "monthly", "0.8")
  );
  writeUrlset("sitemap-sailing.xml", sailEntries);

  // --- sitemap-pages.xml (about, contact, privacy, terms, disclaimer, cookies, affiliate + hub pages) ---
  const pageUrls = [
    { path: "/", priority: "1.0" },
    { path: "/tools/", priority: "0.9" },
    { path: "/knots/", priority: "0.8" },
    { path: "/navigation/", priority: "0.8" },
    { path: "/wind-waves/", priority: "0.8" },
    { path: "/maritime-measurements/", priority: "0.8" },
    { path: "/sailing/", priority: "0.8" },
    { path: "/about/", priority: "0.5" },
    { path: "/contact/", priority: "0.5" },
    { path: "/privacy/", priority: "0.4" },
    { path: "/terms/", priority: "0.4" },
    { path: "/disclaimer/", priority: "0.4" },
    { path: "/cookies/", priority: "0.4" },
    { path: "/affiliate/", priority: "0.4" },
  ];
  const pageEntries = pageUrls.map((u) =>
    urlEntry(`${BASE_URL}${u.path}`, "weekly", u.priority)
  );
  writeUrlset("sitemap-pages.xml", pageEntries);

  // --- sitemap.xml (index) ---
  const indexNames = [
    "sitemap-calculators.xml",
    "sitemap-navigation.xml",
    "sitemap-measurements.xml",
    "sitemap-knots.xml",
    "sitemap-wind-waves.xml",
    "sitemap-sailing.xml",
    "sitemap-pages.xml",
  ];
  const indexEntries = indexNames
    .map(
      (name) =>
        `
 <sitemap>
  <loc>${escapeXml(`${BASE_URL}/${name}`)}</loc>
 </sitemap>`
    )
    .join("");

  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexEntries}
</sitemapindex>
`;
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), indexXml, "utf-8");

  console.log(`\nSitemap index: ${BASE_URL}/sitemap.xml`);
  console.log("Section sitemaps in public/:");
}

main();
