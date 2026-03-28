import { createJsonLd } from "@/lib/schema";
import { siteConfig } from "@/config/site";
import { organization } from "@/config/siteOwner";

const base = siteConfig.url.replace(/\/$/, "");

export default function WebsiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: `${base}/`,
    publisher: {
      "@type": "Organization",
      name: organization.name,
      url: `${base}/`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={createJsonLd(data)}
    />
  );
}
