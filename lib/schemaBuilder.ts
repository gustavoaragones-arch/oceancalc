const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oceancalc.com";

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Calculator pages: SoftwareApplication schema
 */
export function buildSoftwareApplicationSchema(
  name: string,
  description: string,
  path: string
) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "SoftwareApplication" as const,
    name,
    description,
    applicationCategory: "UtilitiesApplication" as const,
    offers: { "@type": "Offer" as const, price: "0", priceCurrency: "USD" },
    url: `${SITE_URL}${path}`,
  };
}

/**
 * Knot tutorials: HowTo schema
 */
export function buildHowToSchema(
  name: string,
  description: string,
  steps: string[],
  path: string
) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "HowTo" as const,
    name: `How to Tie the ${name}`,
    description,
    step: steps.map((text, i) => ({
      "@type": "HowToStep" as const,
      position: i + 1,
      text,
    })),
    url: `${SITE_URL}${path}`,
  };
}

/**
 * FAQ sections: FAQPage schema
 */
export function buildFAQSchema(items: FAQItem[]) {
  if (items.length === 0) return null;
  return {
    "@context": "https://schema.org" as const,
    "@type": "FAQPage" as const,
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question" as const,
      name: question,
      acceptedAnswer: { "@type": "Answer" as const, text: answer },
    })),
  };
}

/**
 * Article page: Article schema (optional, for rich results)
 */
export function buildArticleSchema(
  title: string,
  description: string,
  path: string
) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "Article" as const,
    headline: title,
    description,
    url: `${SITE_URL}${path}`,
  };
}
