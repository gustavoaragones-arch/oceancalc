import { organization } from "@/config/siteOwner";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oceancalc.com";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org" as const,
    "@type": "Organization" as const,
    name: organization.name,
    url: organization.url,
    description: organization.description,
    foundingLocation: {
      "@type": "Place" as const,
      addressCountry: organization.foundingCountry,
    },
    contactPoint: {
      "@type": "ContactPoint" as const,
      email: organization.email,
      contactType: "customer support" as const,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org" as const,
    "@type": "WebSite" as const,
    name: "OceanCalc",
    url: SITE_URL,
    publisher: {
      "@type": "Organization" as const,
      name: organization.name,
      url: organization.url,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
