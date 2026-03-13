const SITE_URL = "https://oceancalc.com";

export type SoftwareApplicationSchema = {
  "@context": "https://schema.org";
  "@type": "SoftwareApplication";
  name: string;
  description: string;
  applicationCategory: "UtilitiesApplication";
  offers?: { "@type": "Offer"; price: "0"; priceCurrency: "USD" };
  url?: string;
};

export type FAQSchema = {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }>;
};

export function buildSoftwareApplicationSchema(
  name: string,
  description: string,
  path: string
): SoftwareApplicationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory: "UtilitiesApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: `${SITE_URL}${path}`,
  };
}

export function buildFAQSchema(
  items: Array<{ question: string; answer: string }>
): FAQSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question" as const,
      name: question,
      acceptedAnswer: { "@type": "Answer" as const, text: answer },
    })),
  };
}
