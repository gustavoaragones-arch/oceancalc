import { notFound } from "next/navigation";
import { getCalculatorBySlug } from "@/lib/contentLoader";
import { getArticlesForTool } from "@/lib/internalLinker";
import { generateContent } from "@/lib/contentGenerator";
import {
  getVariantPageCopy,
  isToolVariantId,
  type ToolVariantId,
} from "@/lib/toolVariants";
import { siteConfig } from "@/config/site";
import CalculatorSchema from "@/components/schema/CalculatorSchema";
import FAQSchema from "@/components/schema/FAQSchema";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { CalculatorRenderer } from "@/components/CalculatorRenderer";

interface CalculatorToolPageProps {
  slug: string;
  variant?: string | null;
}

export function CalculatorToolPage({ slug, variant }: CalculatorToolPageProps) {
  const calculator = getCalculatorBySlug(slug);
  if (!calculator) notFound();

  const generated = generateContent(calculator);
  const variantId: ToolVariantId | null =
    variant && isToolVariantId(variant) ? variant : null;
  const variantCopy = variantId ? getVariantPageCopy(calculator, variantId) : null;

  const learnMoreItems = getArticlesForTool(slug);
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Calculators", href: "/tools/" },
    { label: variantCopy?.pageTitle ?? calculator.title },
  ];

  const base = siteConfig.url.replace(/\/$/, "");
  const mainToolUrl = `${base}/tools/${slug}/`;

  return (
    <>
      <CalculatorSchema
        name={calculator.title}
        description={calculator.description}
        url={mainToolUrl}
      />
      <FAQSchema faqs={generated.mergedFaq} />
      <CalculatorLayout
        calculator={calculator}
        breadcrumbItems={breadcrumbItems}
        learnMoreItems={learnMoreItems}
        displayTitle={variantCopy?.pageTitle ?? calculator.title}
        variantIntro={variantCopy?.lead ?? null}
        generated={generated}
        faqItems={generated.mergedFaq}
      >
        <CalculatorRenderer calculator={calculator} />
      </CalculatorLayout>
    </>
  );
}
