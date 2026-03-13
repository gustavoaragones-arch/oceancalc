import * as fs from "fs";
import * as path from "path";
import type { CalculatorEntry, KnotEntry, ArticleEntry } from "./types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oceancalc.com";
const DATA_DIR = path.join(process.cwd(), "data");

let calculatorsCache: CalculatorEntry[] | null = null;
let calculatorClustersCache: Record<string, string[]> | null = null;
let knotsCache: KnotEntry[] | null = null;
let navigationCache: ArticleEntry[] | null = null;
let windWavesCache: ArticleEntry[] | null = null;
let measurementsCache: ArticleEntry[] | null = null;
let sailingCache: ArticleEntry[] | null = null;

function loadJson<T>(filePath: string): T {
  const fullPath = path.join(DATA_DIR, filePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}

export function getCalculators(): CalculatorEntry[] {
  if (!calculatorsCache) {
    calculatorsCache = loadJson<CalculatorEntry[]>("calculators.json");
  }
  return calculatorsCache;
}

export function getCalculatorBySlug(slug: string): CalculatorEntry | null {
  return getCalculators().find((c) => c.slug === slug) ?? null;
}

export function getAllCalculatorSlugs(): string[] {
  return getCalculators().map((c) => c.slug);
}

function getCalculatorClusters(): Record<string, string[]> {
  if (!calculatorClustersCache) {
    calculatorClustersCache = loadJson<Record<string, string[]>>(
      "calculatorClusters.json"
    );
  }
  return calculatorClustersCache;
}

/**
 * Get related calculator slugs in the same cluster (circular ring).
 * Returns the next 3 calculators after the current one in the cluster array;
 * wraps from end to start. Used for tool-page internal linking.
 */
export function getRelatedCalculatorSlugsInCluster(
  currentSlug: string,
  count = 3
): { slugs: string[]; clusterLabel: string } {
  const clusters = getCalculatorClusters();
  const clusterLabels: Record<string, string> = {
    "maritime-measurements": "Maritime Measurements",
    "navigation-tools": "Navigation",
    "wind-weather": "Wind & Weather",
    "sailing-performance": "Sailing & Performance",
  };
  for (const [clusterKey, slugs] of Object.entries(clusters)) {
    const i = slugs.indexOf(currentSlug);
    if (i === -1) continue;
    const n = slugs.length;
    if (n <= 1) return { slugs: [], clusterLabel: clusterLabels[clusterKey] ?? clusterKey };
    const take = Math.min(count, n - 1);
    const out: string[] = [];
    for (let k = 1; k <= take; k++) {
      out.push(slugs[(i + k) % n]);
    }
    return {
      slugs: out,
      clusterLabel: clusterLabels[clusterKey] ?? clusterKey,
    };
  }
  return { slugs: [], clusterLabel: "" };
}

export function getKnots(): KnotEntry[] {
  if (!knotsCache) {
    knotsCache = loadJson<KnotEntry[]>("knots.json");
  }
  return knotsCache;
}

export function getKnotBySlug(slug: string): KnotEntry | null {
  return getKnots().find((k) => k.slug === slug) ?? null;
}

export function getAllKnotSlugs(): string[] {
  return getKnots().map((k) => k.slug);
}

export function getNavigationArticles(): ArticleEntry[] {
  if (!navigationCache) {
    navigationCache = loadJson<ArticleEntry[]>("navigation.json");
  }
  return navigationCache;
}

export function getNavigationArticleBySlug(slug: string): ArticleEntry | null {
  return getNavigationArticles().find((a) => a.slug === slug) ?? null;
}

export function getAllNavigationSlugs(): string[] {
  return getNavigationArticles().map((a) => a.slug);
}

export function getWindWavesArticles(): ArticleEntry[] {
  if (!windWavesCache) {
    windWavesCache = loadJson<ArticleEntry[]>("wind-waves.json");
  }
  return windWavesCache;
}

export function getWindWavesArticleBySlug(slug: string): ArticleEntry | null {
  return getWindWavesArticles().find((a) => a.slug === slug) ?? null;
}

export function getAllWindWavesSlugs(): string[] {
  return getWindWavesArticles().map((a) => a.slug);
}

export function getMeasurementsArticles(): ArticleEntry[] {
  if (!measurementsCache) {
    measurementsCache = loadJson<ArticleEntry[]>("measurements.json");
  }
  return measurementsCache;
}

export function getMeasurementsArticleBySlug(slug: string): ArticleEntry | null {
  return getMeasurementsArticles().find((a) => a.slug === slug) ?? null;
}

export function getAllMeasurementsSlugs(): string[] {
  return getMeasurementsArticles().map((a) => a.slug);
}

export function getSailingArticles(): ArticleEntry[] {
  if (!sailingCache) {
    sailingCache = loadJson<ArticleEntry[]>("sailing.json");
  }
  return sailingCache;
}

export function getSailingArticleBySlug(slug: string): ArticleEntry | null {
  return getSailingArticles().find((a) => a.slug === slug) ?? null;
}

export function getAllSailingSlugs(): string[] {
  return getSailingArticles().map((a) => a.slug);
}

/** Topic keywords to calculator slugs for internal linking. Used when an article doesn't define relatedToolSlugs. */
const TOPIC_TO_TOOL_SLUGS: Record<string, string[]> = {
  "true wind": ["apparent-wind-calculator", "knots-speed-converter"],
  "apparent wind": ["apparent-wind-calculator"],
  "wind": ["beaufort-scale-calculator", "apparent-wind-calculator", "knots-speed-converter"],
  "beaufort": ["beaufort-scale-calculator"],
  "nautical mile": ["nautical-mile-converter", "great-circle-distance-calculator"],
  "knots": ["knots-speed-converter", "sailing-time-calculator"],
  "distance": ["distance-to-horizon-calculator", "great-circle-distance-calculator", "nautical-mile-converter"],
  "horizon": ["distance-to-horizon-calculator"],
  "sailing time": ["sailing-time-calculator"],
  "passage": ["sailing-time-calculator", "great-circle-distance-calculator"],
  "anchor": ["anchor-scope-calculator"],
  "scope": ["anchor-scope-calculator"],
  "great circle": ["great-circle-distance-calculator"],
};

/**
 * Get related calculator slugs for internal linking. Uses article's relatedToolSlugs if present,
 * otherwise matches topic keywords against TOPIC_TO_TOOL_SLUGS.
 */
export function generateRelatedTools(article: ArticleEntry): string[] {
  if (article.relatedToolSlugs && article.relatedToolSlugs.length > 0) {
    return article.relatedToolSlugs;
  }
  const titleLower = article.title.toLowerCase();
  const descLower = article.description.toLowerCase();
  const combined = `${titleLower} ${descLower}`;
  const slugs = new Set<string>();
  for (const [topic, toolSlugs] of Object.entries(TOPIC_TO_TOOL_SLUGS)) {
    if (combined.includes(topic)) {
      toolSlugs.forEach((s) => slugs.add(s));
    }
  }
  return Array.from(slugs);
}

export function getCalculatorHref(slug: string): string {
  return `${SITE_URL}/tools/${slug}/`;
}

export function getKnotHref(slug: string): string {
  return `${SITE_URL}/knots/${slug}/`;
}

export function getArticleHref(category: string, slug: string): string {
  const path = category === "maritime-measurements" ? "maritime-measurements" : category;
  return `${SITE_URL}/${path}/${slug}/`;
}
