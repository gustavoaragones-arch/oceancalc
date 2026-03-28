import { createJsonLd } from "@/lib/schema";

export interface CalculatorSchemaProps {
  name: string;
  description: string;
  url: string;
}

export default function CalculatorSchema({
  name,
  description,
  url,
}: CalculatorSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    applicationCategory: "Utility",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={createJsonLd(data)}
    />
  );
}
