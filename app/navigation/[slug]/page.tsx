import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getNavigationArticleBySlug,
  getAllNavigationSlugs,
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
  return getAllNavigationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getNavigationArticleBySlug(slug);
  if (!article) return { title: "Not Found" };
  return generateArticleMetadata({
    headline: article.title,
    description: article.description,
    path: `/navigation/${slug}/`,
    lastModified: getBuildLastModified(),
  });
}

export default async function NavigationArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getNavigationArticleBySlug(slug);
  if (!article) notFound();

  const relatedTools = getRelatedToolsForArticle(article);
  const sameCategoryArticles = getArticlesInCategory("navigation").filter(
    (a) => a.slug !== article.slug
  );

  const articleSchema = buildArticleSchema(
    article.title,
    article.description,
    `/navigation/${slug}/`
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
        category="navigation"
        sameCategoryArticles={sameCategoryArticles}
      />
    </>
  );
}
