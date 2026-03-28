import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCalculatorBySlug, getAllCalculatorSlugs } from "@/lib/contentLoader";
import { getArticlesForTool } from "@/lib/internalLinker";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";
import { formatSlugToTitle } from "@/lib/format";
import { siteConfig } from "@/config/site";
import CalculatorSchema from "@/components/schema/CalculatorSchema";
import FAQSchema from "@/components/schema/FAQSchema";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { CalculatorRenderer } from "@/components/CalculatorRenderer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCalculatorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);
  if (!calculator) {
    const title = formatSlugToTitle(slug);
    return buildSeoMetadata({
      title,
      description: `Use the ${title} to perform maritime calculations quickly and accurately.`,
      path: `/tools/${slug}/`,
    });
  }
  return buildSeoMetadata({
    title: calculator.title,
    description: calculator.description,
    path: `/tools/${slug}/`,
  });
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);
  if (!calculator) notFound();

  const learnMoreItems = getArticlesForTool(slug);
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Calculators", href: "/tools/" },
    { label: calculator.title },
  ];

  const base = siteConfig.url.replace(/\/$/, "");

  return (
    <>
      <CalculatorSchema
        name={calculator.title}
        description={calculator.description}
        url={`${base}/tools/${slug}/`}
      />
      <FAQSchema faqs={calculator.faq} />
      <CalculatorLayout
        calculator={calculator}
        breadcrumbItems={breadcrumbItems}
        learnMoreItems={learnMoreItems}
      >
        <CalculatorRenderer calculator={calculator} />
      </CalculatorLayout>
    </>
  );
}
