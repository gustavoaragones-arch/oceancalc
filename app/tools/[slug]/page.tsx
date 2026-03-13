import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCalculatorBySlug, getAllCalculatorSlugs } from "@/lib/contentLoader";
import { getArticlesForTool } from "@/lib/internalLinker";
import { buildToolSEO } from "@/lib/seoBuilder";
import { buildSoftwareApplicationSchema, buildFAQSchema } from "@/lib/schemaBuilder";
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
  if (!calculator) return { title: "Not Found" };
  const seo = buildToolSEO({
    title: calculator.title,
    description: calculator.description,
    path: `/tools/${slug}/`,
  });
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    openGraph: seo.openGraph,
  };
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

  const appSchema = buildSoftwareApplicationSchema(
    calculator.title,
    calculator.description,
    `/tools/${slug}/`
  );
  const faqSchema =
    calculator.faq.length > 0
      ? buildFAQSchema(calculator.faq)
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
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
