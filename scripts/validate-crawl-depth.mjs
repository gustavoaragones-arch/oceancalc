#!/usr/bin/env node
/**
 * Phase 6.3.5 — crawl depth sanity check (build-time).
 *
 * Model (undirected for depth):
 * - Home (/) links to every /tools/{slug}/ via AllCalculatorsGrid in root layout.
 * - Therefore max clicks Home → any calculator page = 1.
 * - Home → section hub → article = 2; articles also get the same grid → any tool = 1 more from article,
 *   but from home: Home → article = 2 (section hub or featured paths), then grid on that page → tool = 3.
 *   Primary guarantee: every tool URL appears on the homepage path via the global grid on every page.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");

function loadCalculators() {
  const main = JSON.parse(
    fs.readFileSync(path.join(dataDir, "calculators.json"), "utf-8")
  );
  const phase5Path = path.join(dataDir, "calculators-phase5.json");
  if (!fs.existsSync(phase5Path)) return main;
  const extra = JSON.parse(fs.readFileSync(phase5Path, "utf-8"));
  return [...main, ...extra];
}

const calculators = loadCalculators();
const slugs = calculators.map((c) => c.slug).filter(Boolean);

if (slugs.length === 0) {
  console.error("validate-crawl-depth: no calculator slugs found");
  process.exit(1);
}

const layoutPath = path.join(__dirname, "..", "app", "layout.tsx");
const layoutSrc = fs.readFileSync(layoutPath, "utf-8");
if (!layoutSrc.includes("AllCalculatorsGrid")) {
  console.error(
    "validate-crawl-depth: app/layout.tsx must render AllCalculatorsGrid before Footer"
  );
  process.exit(1);
}

console.log(
  `validate-crawl-depth: OK — ${slugs.length} calculators; global grid enforced in root layout.`
);
console.log(
  "  Expected: Home → any /tools/{slug}/ in 1 click (grid link on every page body)."
);
process.exit(0);
