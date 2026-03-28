import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getWindWavesArticleBySlug,
  getAllWindWavesSlugs,
} from "@/lib/contentLoader";
import {
  getRelatedToolsForArticle,
  getArticlesInCategory,
} from "@/lib/internalLinker";
import { generateArticleMetadata } from "@/lib/seo";
import { getBuildLastModified } from "@/lib/indexing";
import { buildArticleSchema } from "@/lib/schemaBuilder";
import FAQSchema from "@/components/schema/FAQSchema";
import { ArticleLayout } from "@/components/ArticleLayout";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllWindWavesSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getWindWavesArticleBySlug(slug);
  if (!article) return { title: "Not Found" };
  return generateArticleMetadata({
    headline: article.title,
    description: article.description,
    path: `/wind-waves/${slug}/`,
    lastModified: getBuildLastModified(),
  });
}

export default async function WindWavesArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getWindWavesArticleBySlug(slug);
  if (!article) notFound();

  const relatedTools = getRelatedToolsForArticle(article);
  const sameCategoryArticles = getArticlesInCategory("wind-waves").filter(
    (a) => a.slug !== article.slug
  );

  const articleSchema = buildArticleSchema(
    article.title,
    article.description,
    `/wind-waves/${slug}/`
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <FAQSchema faqs={article.faq} />
      <ArticleLayout
        article={article}
        relatedTools={relatedTools}
        category="wind-waves"
        sameCategoryArticles={sameCategoryArticles}
      />
    </>
  );
}
