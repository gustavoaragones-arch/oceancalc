import * as fs from "fs";
import * as path from "path";
import {
  getCalculators,
  getNavigationArticles,
  getWindWavesArticles,
  getMeasurementsArticles,
  getSailingArticles,
  getCalculatorBySlug,
} from "./contentLoader";
import type { ArticleEntry } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

let topicClustersCache: Record<string, string[]> | null = null;
let contentGraphCache: Record<
  string,
  { articles: string[]; categories?: string[] }
> | null = null;

function loadTopicClusters(): Record<string, string[]> {
  if (!topicClustersCache) {
    const raw = fs.readFileSync(
      path.join(DATA_DIR, "topicClusters.json"),
      "utf-8"
    );
    topicClustersCache = JSON.parse(raw) as Record<string, string[]>;
  }
  return topicClustersCache;
}

function loadContentGraph(): Record<
  string,
  { articles: string[]; categories?: string[] }
> {
  if (!contentGraphCache) {
    const raw = fs.readFileSync(
      path.join(DATA_DIR, "contentGraph.json"),
      "utf-8"
    );
    const parsed = JSON.parse(raw) as Record<
      string,
      { articles: string[]; categories?: string[] }
    >;
    contentGraphCache = parsed;
    return parsed;
  }
  return contentGraphCache;
}

const CATEGORY_ARTICLE_GETTERS: Record<
  string,
  () => ArticleEntry[]
> = {
  navigation: () => getNavigationArticles(),
  "wind-waves": () => getWindWavesArticles(),
  "maritime-measurements": () => getMeasurementsArticles(),
  sailing: () => getSailingArticles(),
};

/** Get calculator slugs related to a topic (e.g. "wind", "navigation"). Uses topicClusters.json. */
export function getRelatedTools(topic: string): string[] {
  const clusters = loadTopicClusters();
  const normalized = topic.toLowerCase().trim();
  const slugs = clusters[normalized];
  if (slugs && slugs.length > 0) return [...slugs];
  for (const [key, value] of Object.entries(clusters)) {
    if (normalized.includes(key)) return [...value];
  }
  return [];
}

/** Get related tools with full calculator entries (title, slug) for display. */
export function getRelatedToolsWithMeta(
  topic: string,
  limit = 8
): Array<{ slug: string; title: string }> {
  const slugs = getRelatedTools(topic);
  const calculators = getCalculators();
  const seen = new Set<string>();
  const result: Array<{ slug: string; title: string }> = [];
  for (const slug of slugs) {
    if (seen.has(slug) || result.length >= limit) continue;
    const calc = getCalculatorBySlug(slug) ?? calculators.find((c) => c.slug === slug);
    if (calc) {
      seen.add(slug);
      result.push({ slug: calc.slug, title: calc.title });
    }
  }
  return result;
}

/** Get article slugs related to a topic by scanning article title/description. */
export function getRelatedArticles(topic: string): Array<{ slug: string; title: string; category: string }> {
  const normalized = topic.toLowerCase();
  const result: Array<{ slug: string; title: string; category: string }> = [];
  const categories: Array<{ key: string; getter: () => ArticleEntry[] }> = [
    { key: "navigation", getter: getNavigationArticles },
    { key: "wind-waves", getter: getWindWavesArticles },
    { key: "maritime-measurements", getter: getMeasurementsArticles },
    { key: "sailing", getter: getSailingArticles },
  ];
  for (const { key, getter } of categories) {
    for (const a of getter()) {
      const text = `${a.title} ${a.description}`.toLowerCase();
      if (text.includes(normalized)) {
        result.push({ slug: a.slug, title: a.title, category: key });
      }
    }
  }
  return result;
}

/** Get all pages (calculators + articles) in a cluster category for hub listing. */
export function getClusterPages(category: string): {
  calculators: Array<{ slug: string; title: string; description: string }>;
  articles: Array<{ slug: string; title: string; description: string; category: string }>;
} {
  const calculators = getCalculators().filter(
    (c) => c.category === category || mapCategoryToPath(c.category) === category
  );
  const getter = CATEGORY_ARTICLE_GETTERS[category];
  const articles = getter
    ? getter().map((a) => ({
        slug: a.slug,
        title: a.title,
        description: a.description,
        category,
      }))
    : [];
  return {
    calculators: calculators.map((c) => ({
      slug: c.slug,
      title: c.title,
      description: c.description,
    })),
    articles,
  };
}

function mapCategoryToPath(cat: string): string {
  return cat === "maritime-measurements" ? "maritime-measurements" : cat;
}

/** Get article slugs and titles linked to a calculator (from contentGraph). */
export function getArticlesForTool(
  toolSlug: string
): Array<{ slug: string; title: string; category: string }> {
  const graph = loadContentGraph();
  const entry = graph[toolSlug];
  if (!entry || !entry.articles?.length) return [];
  const result: Array<{ slug: string; title: string; category: string }> = [];
  const categories = entry.categories ?? ["navigation", "wind-waves", "maritime-measurements", "sailing"];
  for (const articleSlug of entry.articles) {
    for (const cat of categories) {
      const getter = CATEGORY_ARTICLE_GETTERS[cat];
      if (!getter) continue;
      const article = getter().find((a) => a.slug === articleSlug);
      if (article) {
        result.push({ slug: article.slug, title: article.title, category: cat });
        break;
      }
    }
  }
  return result;
}

/** Get all articles in a category for sidebar/topic explorer. */
export function getArticlesInCategory(category: string): Array<{ slug: string; title: string; category: string }> {
  const getter = CATEGORY_ARTICLE_GETTERS[category];
  if (!getter) return [];
  return getter().map((a) => ({ slug: a.slug, title: a.title, category }));
}

/** Get related tools for an article: use article.relatedToolSlugs if set, else topic match from title/description. */
export function getRelatedToolsForArticle(article: ArticleEntry): Array<{ slug: string; title: string }> {
  if (article.relatedToolSlugs && article.relatedToolSlugs.length > 0) {
    const calculators = getCalculators();
    return article.relatedToolSlugs
      .map((slug) => {
        const calc = getCalculatorBySlug(slug) ?? calculators.find((c) => c.slug === slug);
        return calc ? { slug: calc.slug, title: calc.title } : null;
      })
      .filter((t): t is { slug: string; title: string } => t !== null);
  }
  const combined = `${article.title} ${article.description}`.toLowerCase();
  const clusters = loadTopicClusters();
  const slugs = new Set<string>();
  for (const [topic, toolSlugs] of Object.entries(clusters)) {
    if (combined.includes(topic)) toolSlugs.forEach((s) => slugs.add(s));
  }
  const calculators = getCalculators();
  return Array.from(slugs)
    .map((slug) => {
      const calc = getCalculatorBySlug(slug) ?? calculators.find((c) => c.slug === slug);
      return calc ? { slug: calc.slug, title: calc.title } : null;
    })
    .filter((t): t is { slug: string; title: string } => t !== null);
}
