const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oceancalc.com";
const SITE_NAME = "OceanCalc";

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

/**
 * Tool page: "{Calculator Name} | OceanCalc"
 */
export function buildToolSEO(props: ToolSEOProps) {
  const title = `${props.title} | ${SITE_NAME}`;
  const canonical = `${SITE_URL}${props.path}`;
  return {
    title,
    description: props.description,
    canonical,
    openGraph: {
      title,
      description: props.description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website" as const,
    },
  };
}

/**
 * Article page: "{Topic} Explained | OceanCalc" or custom title
 */
export function buildArticleSEO(props: ArticleSEOProps) {
  const title = props.title.endsWith("Explained") || props.title.includes("|")
    ? `${props.title} | ${SITE_NAME}`
    : `${props.title} Explained | ${SITE_NAME}`;
  const canonical = `${SITE_URL}${props.path}`;
  return {
    title,
    description: props.description,
    canonical,
    openGraph: {
      title,
      description: props.description,
      url: canonical,
      siteName: SITE_NAME,
      type: "article" as const,
    },
  };
}

/**
 * Knot tutorial: "{Knot Name} | OceanCalc"
 */
export function buildKnotSEO(props: KnotSEOProps) {
  const title = `${props.name} | ${SITE_NAME}`;
  const description =
    props.description ??
    `How to tie the ${props.name}. Step-by-step tutorial for sailors and boaters.`;
  const canonical = `${SITE_URL}${props.path}`;
  return {
    title,
    description,
    canonical,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "article" as const,
    },
  };
}

/**
 * Hub page SEO (e.g. /tools/, /knots/)
 */
export function buildHubSEO(title: string, description: string, path: string) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonical = `${SITE_URL}${path}`;
  return {
    title: fullTitle,
    description,
    canonical,
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website" as const,
    },
  };
}
