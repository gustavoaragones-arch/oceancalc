import { generateMetadata, generateArticleMetadata } from "./seo";
import type { Metadata } from "next";

export interface ToolSEOProps {
  title: string;
  description: string;
  path: string;
}

export interface ArticleSEOProps {
  title: string;
  description: string;
  path: string;
  topic?: string;
}

export interface KnotSEOProps {
  name: string;
  description?: string;
  path: string;
}

function metadataToLegacy(m: Metadata): {
  title: string;
  description: string;
  canonical: string;
  openGraph: NonNullable<Metadata["openGraph"]>;
} {
  const titleObj = m.title;
  const title =
    typeof titleObj === "object" &&
    titleObj !== null &&
    "absolute" in titleObj &&
    typeof titleObj.absolute === "string"
      ? titleObj.absolute
      : String(titleObj ?? "");
  const description = m.description ?? "";
  const canonical =
    (typeof m.alternates?.canonical === "string"
      ? m.alternates.canonical
      : m.alternates?.canonical?.toString()) ?? "";
  return {
    title,
    description,
    canonical,
    openGraph: m.openGraph ?? {},
  };
}

/** @deprecated Prefer `generateMetadata` from @/lib/seo */
export function buildToolSEO(props: ToolSEOProps) {
  return metadataToLegacy(
    generateMetadata({
      title: props.title,
      description: props.description,
      path: props.path,
    })
  );
}

/** @deprecated Prefer `generateArticleMetadata` from @/lib/seo */
export function buildArticleSEO(props: ArticleSEOProps) {
  return metadataToLegacy(
    generateArticleMetadata({
      headline: props.title,
      description: props.description,
      path: props.path,
    })
  );
}

/** @deprecated Prefer `generateMetadata` from @/lib/seo with openGraphType: "article" */
export function buildKnotSEO(props: KnotSEOProps) {
  const description =
    props.description ??
    `How to tie the ${props.name}. Step-by-step tutorial for sailors and boaters.`;
  return metadataToLegacy(
    generateMetadata({
      title: props.name,
      description,
      path: props.path,
      openGraphType: "article",
    })
  );
}

/** @deprecated Prefer `generateMetadata` from @/lib/seo */
export function buildHubSEO(title: string, description: string, path: string) {
  return metadataToLegacy(
    generateMetadata({ title, description, path })
  );
}
