import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  const p = path.startsWith("/") ? path : `/${path}`;
  return p.endsWith("/") ? p : `${p}/`;
}

function canonicalUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const n = normalizePath(path);
  if (n === "/") return `${base}/`;
  return `${base}${n}`;
}

export interface GenerateSeoMetadataInput {
  title: string;
  description: string;
  path: string;
  openGraphType?: "website" | "article";
  /** If set, `alternates.canonical` points here (e.g. main tool URL for `/tools/[slug]/[variant]/`). */
  canonicalPath?: string;
  /** Freshness signal for crawlers (Open Graph `modifiedTime`). */
  lastModified?: Date;
}

/**
 * Central SEO metadata for Next.js App Router pages.
 * Full document title: `${title} | OceanCalc`
 */
export function generateMetadata({
  title,
  description,
  path,
  openGraphType = "website",
  canonicalPath,
  lastModified,
}: GenerateSeoMetadataInput): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const canonical = canonicalUrl(canonicalPath ?? path);
  const pageUrl = canonicalUrl(path);

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical },
    ...(lastModified
      ? {
          other: {
            "article:modified_time": lastModified.toISOString(),
          },
        }
      : {}),
    openGraph: {
      title: fullTitle,
      description,
      url: pageUrl,
      siteName: siteConfig.name,
      type: openGraphType,
      ...(lastModified ? { modifiedTime: lastModified.toISOString() } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

/**
 * Article-style titles: adds " Explained" when appropriate (legacy behavior).
 */
export function generateArticleMetadata({
  headline,
  description,
  path,
  lastModified,
}: {
  headline: string;
  description: string;
  path: string;
  lastModified?: Date;
}): Metadata {
  const title =
    headline.endsWith("Explained") || headline.includes("|")
      ? headline
      : `${headline} Explained`;
  return generateMetadata({
    title,
    description,
    path,
    openGraphType: "article",
    lastModified,
  });
}
