import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCalculatorBySlug, getAllCalculatorSlugs } from "@/lib/contentLoader";
import { generateMetadata as buildSeoMetadata } from "@/lib/seo";
import { formatSlugToTitle } from "@/lib/format";
import {
  toolVariants,
  isToolVariantId,
  getVariantPageCopy,
} from "@/lib/toolVariants";
import { CalculatorToolPage } from "@/components/CalculatorToolPage";

interface PageProps {
  params: Promise<{ slug: string; variant: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllCalculatorSlugs();
  return slugs.flatMap((slug) =>
    toolVariants.map((variant) => ({ slug, variant }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, variant } = await params;
  const calculator = getCalculatorBySlug(slug);
  if (!calculator || !isToolVariantId(variant)) {
    const title = formatSlugToTitle(slug);
    return buildSeoMetadata({
      title: title + (variant ? ` (${variant})` : ""),
      description: `Maritime calculator variant for ${title}.`,
      path: `/tools/${slug}/${variant}/`,
      canonicalPath: `/tools/${slug}/`,
    });
  }
  const copy = getVariantPageCopy(calculator, variant);
  return buildSeoMetadata({
    title: copy.pageTitle,
    description: copy.description,
    path: `/tools/${slug}/${variant}/`,
    canonicalPath: `/tools/${slug}/`,
  });
}

export default async function ToolVariantPage({ params }: PageProps) {
  const { slug, variant } = await params;
  if (!isToolVariantId(variant)) notFound();
  if (!getCalculatorBySlug(slug)) notFound();
  return <CalculatorToolPage slug={slug} variant={variant} />;
}
