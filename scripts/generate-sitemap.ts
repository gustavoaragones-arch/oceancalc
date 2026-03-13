/**
 * Generates sitemap.xml by scanning all JSON content files.
 * Run: npx tsx scripts/generate-sitemap.ts
 * Output: public/sitemap.xml
 */

import * as fs from "fs";
import * as path from "path";

const SITE_URL = "https://oceancalc.com";
const DATA_DIR = path.join(process.cwd(), "data");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const OUT_FILE = path.join(PUBLIC_DIR, "sitemap.xml");

function loadJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function getSlugsFromArray(json: Array<{ slug: string }>): string[] {
  return json.map((entry) => entry.slug);
}

function main() {
  const urls: string[] = [];

  // Static pages
  urls.push(`${SITE_URL}/`);
  urls.push(`${SITE_URL}/tools/`);
  urls.push(`${SITE_URL}/knots/`);
  urls.push(`${SITE_URL}/navigation/`);
  urls.push(`${SITE_URL}/wind-waves/`);
  urls.push(`${SITE_URL}/maritime-measurements/`);
  urls.push(`${SITE_URL}/sailing/`);
  urls.push(`${SITE_URL}/about/`);
  urls.push(`${SITE_URL}/contact/`);
  urls.push(`${SITE_URL}/privacy/`);
  urls.push(`${SITE_URL}/terms/`);
  urls.push(`${SITE_URL}/disclaimer/`);
  urls.push(`${SITE_URL}/affiliate/`);

  // Calculators
  const calculators = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "calculators.json")
  );
  getSlugsFromArray(calculators).forEach((slug) => {
    urls.push(`${SITE_URL}/tools/${slug}/`);
  });

  // Knots
  const knots = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "knots.json")
  );
  getSlugsFromArray(knots).forEach((slug) => {
    urls.push(`${SITE_URL}/knots/${slug}/`);
  });

  // Navigation articles
  const navigation = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "navigation.json")
  );
  getSlugsFromArray(navigation).forEach((slug) => {
    urls.push(`${SITE_URL}/navigation/${slug}/`);
  });

  // Wind-waves articles
  const windWaves = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "wind-waves.json")
  );
  getSlugsFromArray(windWaves).forEach((slug) => {
    urls.push(`${SITE_URL}/wind-waves/${slug}/`);
  });

  // Measurements articles
  const measurements = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "measurements.json")
  );
  getSlugsFromArray(measurements).forEach((slug) => {
    urls.push(`${SITE_URL}/maritime-measurements/${slug}/`);
  });

  // Sailing articles
  const sailing = loadJson<Array<{ slug: string }>>(
    path.join(DATA_DIR, "sailing.json")
  );
  getSlugsFromArray(sailing).forEach((slug) => {
    urls.push(`${SITE_URL}/sailing/${slug}/`);
  });

  const lastmod = new Date().toISOString().split("T")[0];
  const urlEntries = urls
    .map(
      (loc) =>
        `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }
  fs.writeFileSync(OUT_FILE, xml, "utf-8");
  console.log(`Wrote ${urls.length} URLs to ${OUT_FILE}`);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

main();
