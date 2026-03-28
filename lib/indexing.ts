/**
 * Stage 6 — Freshness timestamps, extended sitemap URLs (articles, knots, legal),
 * and Search Console notes. Main tool + variant URLs live in `app/sitemap.ts`.
 */
import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import {
  getKnots,
  getNavigationArticles,
  getWindWavesArticles,
  getMeasurementsArticles,
  getSailingArticles,
} from "@/lib/contentLoader";

const WEEKLY = "weekly" as const;

/**
 * Build-time timestamp for freshness signals. Override with SITE_LASTMOD_ISO for reproducible builds.
 */
export function getBuildLastModified(): Date {
  const iso = process.env.SITE_LASTMOD_ISO;
  if (iso) {
    const d = new Date(iso);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

/** Visible “Last updated” line on tool pages. */
export function formatIndexingDisplayDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function baseUrl(): string {
  return siteConfig.url.replace(/\/$/, "");
}

function pushPath(
  list: MetadataRoute.Sitemap,
  path: string,
  priority: number,
  lastModified: Date
): void {
  const base = baseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  const normalized = p.endsWith("/") ? p : `${p}/`;
  list.push({
    url: `${base}${normalized}`,
    lastModified,
    changeFrequency: WEEKLY,
    priority,
  });
}

/**
 * Article, knot, and secondary static URLs (everything except homepage, category hubs, and tools).
 */
export function getContentSitemapSlice(lastModified: Date): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  const staticPages: Array<[string, number]> = [
    ["/about/", 0.6],
    ["/contact/", 0.6],
    ["/privacy/", 0.4],
    ["/terms/", 0.4],
    ["/cookies/", 0.4],
    ["/disclaimer/", 0.4],
    ["/affiliate/", 0.4],
  ];
  for (const [path, pri] of staticPages) {
    pushPath(out, path, pri, lastModified);
  }

  for (const a of getNavigationArticles()) {
    pushPath(out, `/navigation/${a.slug}/`, 0.75, lastModified);
  }
  for (const a of getWindWavesArticles()) {
    pushPath(out, `/wind-waves/${a.slug}/`, 0.75, lastModified);
  }
  for (const a of getMeasurementsArticles()) {
    pushPath(out, `/maritime-measurements/${a.slug}/`, 0.75, lastModified);
  }
  for (const a of getSailingArticles()) {
    pushPath(out, `/sailing/${a.slug}/`, 0.75, lastModified);
  }
  for (const k of getKnots()) {
    pushPath(out, `/knots/${k.slug}/`, 0.75, lastModified);
  }

  return out;
}

export function getSitemapAbsoluteUrl(): string {
  return `${baseUrl()}/sitemap.xml`;
}
