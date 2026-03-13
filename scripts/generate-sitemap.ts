/**
 * Generates sitemap index + per-category sitemaps for SEO.
 * Run: npm run generate-sitemap (or npx tsx scripts/generate-sitemap.ts)
 * Reads NEXT_PUBLIC_SITE_URL from .env.local, falls back to https://oceancalc.com
 *
 * Output:
 *   public/sitemap.xml (index)
 *   public/sitemaps/sitemap-core.xml
 *   public/sitemaps/sitemap-tools.xml
 *   public/sitemaps/sitemap-knots.xml
 *   public/sitemaps/sitemap-navigation.xml
 *   public/sitemaps/sitemap-wind-waves.xml
 *   public/sitemaps/sitemap-measurements.xml
 *   public/sitemaps/sitemap-sailing.xml
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
const SITEMAPS_DIR = path.join(PUBLIC_DIR, "sitemaps");

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
  const outPath = path.join(SITEMAPS_DIR, filename);
  fs.writeFileSync(outPath, xml, "utf-8");
  console.log(`  ${filename}: ${entries.length} URLs`);
}

function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  if (!fs.existsSync(SITEMAPS_DIR)) fs.mkdirSync(SITEMAPS_DIR, { recursive: true });

  // --- sitemap-core.xml ---
  const coreUrls = [
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
  const coreEntries = coreUrls.map((u) =>
    urlEntry(`${BASE_URL}${u.path}`, "weekly", u.priority)
  );
  writeUrlset("sitemap-core.xml", coreEntries);

  // --- sitemap-tools.xml ---
  const calculators = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "calculators.json")
  );
  const toolEntries = getSlugs(calculators).map((slug) =>
    urlEntry(`${BASE_URL}/tools/${slug}/`, "monthly", "0.9")
  );
  writeUrlset("sitemap-tools.xml", toolEntries);

  // --- sitemap-knots.xml ---
  const knots = loadJson<Array<{ slug: string }>>(path.join(DATA_DIR, "knots.json"));
  const knotEntries = getSlugs(knots).map((slug) =>
    urlEntry(`${BASE_URL}/knots/${slug}/`, "monthly", "0.8")
  );
  writeUrlset("sitemap-knots.xml", knotEntries);

  // --- sitemap-navigation.xml ---
  const navigation = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "navigation.json")
  );
  const navEntries = getSlugs(navigation).map((slug) =>
    urlEntry(`${BASE_URL}/navigation/${slug}/`, "monthly", "0.8")
  );
  writeUrlset("sitemap-navigation.xml", navEntries);

  // --- sitemap-wind-waves.xml ---
  const windWaves = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "wind-waves.json")
  );
  const wwEntries = getSlugs(windWaves).map((slug) =>
    urlEntry(`${BASE_URL}/wind-waves/${slug}/`, "monthly", "0.8")
  );
  writeUrlset("sitemap-wind-waves.xml", wwEntries);

  // --- sitemap-measurements.xml ---
  const measurements = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "measurements.json")
  );
  const measEntries = getSlugs(measurements).map((slug) =>
    urlEntry(`${BASE_URL}/maritime-measurements/${slug}/`, "monthly", "0.8")
  );
  writeUrlset("sitemap-measurements.xml", measEntries);

  // --- sitemap-sailing.xml ---
  const sailing = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "sailing.json")
  );
  const sailEntries = getSlugs(sailing).map((slug) =>
    urlEntry(`${BASE_URL}/sailing/${slug}/`, "monthly", "0.8")
  );
  writeUrlset("sitemap-sailing.xml", sailEntries);

  // --- sitemap.xml (index) ---
  const indexEntries = [
    "sitemap-core.xml",
    "sitemap-tools.xml",
    "sitemap-knots.xml",
    "sitemap-navigation.xml",
    "sitemap-wind-waves.xml",
    "sitemap-measurements.xml",
    "sitemap-sailing.xml",
  ]
    .map(
      (name) =>
        `
  <sitemap>
    <loc>${escapeXml(`${BASE_URL}/sitemaps/${name}`)}</loc>
  </sitemap>`
    )
    .join("");

  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexEntries}
</sitemapindex>
`;
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), indexXml, "utf-8");

  console.log(`Sitemap index written to public/sitemap.xml (base URL: ${BASE_URL})`);
  console.log("Sitemaps written to public/sitemaps/:");
}

main();
