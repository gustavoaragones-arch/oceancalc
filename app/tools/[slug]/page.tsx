import type { Metadata } from "next";
import { getCalculatorBySlug, getAllCalculatorSlugs } from "@/lib/contentLoader";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";
import { formatSlugToTitle } from "@/lib/format";
import { CalculatorToolPage } from "@/components/CalculatorToolPage";

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
  return <CalculatorToolPage slug={slug} />;
}
