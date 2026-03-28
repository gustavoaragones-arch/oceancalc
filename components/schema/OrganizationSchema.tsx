import { createJsonLd } from "@/lib/schema";
import { siteConfig } from "@/config/site";
import { organization } from "@/config/siteOwner";

const base = siteConfig.url.replace(/\/$/, "");

export default function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organization.name,
    url: `${base}/`,
    logo: `${base}/logo.png`,
    description: organization.description,
    foundingLocation: {
      "@type": "Place",
      addressCountry: organization.foundingCountry,
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: organization.email,
      contactType: "customer support",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={createJsonLd(data)}
    />
  );
}
