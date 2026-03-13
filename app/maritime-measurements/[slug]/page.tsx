import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getMeasurementsArticleBySlug,
  getAllMeasurementsSlugs,
} from "@/lib/contentLoader";
import {
  getRelatedToolsForArticle,
  getArticlesInCategory,
} from "@/lib/internalLinker";
import { buildArticleSEO } from "@/lib/seoBuilder";
import { buildArticleSchema, buildFAQSchema } from "@/lib/schemaBuilder";
import { ArticleLayout } from "@/components/ArticleLayout";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllMeasurementsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getMeasurementsArticleBySlug(slug);
  if (!article) return { title: "Not Found" };
  const seo = buildArticleSEO({
    title: article.title,
    description: article.description,
    path: `/maritime-measurements/${slug}/`,
  });
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    openGraph: seo.openGraph,
  };
}

export default async function MeasurementsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getMeasurementsArticleBySlug(slug);
  if (!article) notFound();

  const relatedTools = getRelatedToolsForArticle(article);
  const sameCategoryArticles = getArticlesInCategory("maritime-measurements").filter(
    (a) => a.slug !== article.slug
  );

  const articleSchema = buildArticleSchema(
    article.title,
    article.description,
    `/maritime-measurements/${slug}/`
  );
  const faqSchema =
    article.faq.length > 0 ? buildFAQSchema(article.faq) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ArticleLayout
        article={article}
        relatedTools={relatedTools}
        category="maritime-measurements"
        sameCategoryArticles={sameCategoryArticles}
      />
    </>
  );
}
