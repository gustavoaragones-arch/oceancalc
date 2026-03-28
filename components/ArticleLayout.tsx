import type { ArticleEntry } from "@/lib/types";
import { FAQ } from "./FAQ";
import { RelatedTools } from "./RelatedTools";
import { TopicExplorer } from "./TopicExplorer";
import { ArticleContentWithLinks } from "./ArticleContentWithLinks";
import { Breadcrumbs, BreadcrumbSchema } from "./Breadcrumbs";
import { AuthorPublisher } from "./AuthorPublisher";

export interface RelatedTool {
  slug: string;
  title: string;
}

export interface TopicLink {
  slug: string;
  title: string;
  category: string;
}

interface ArticleLayoutProps {
  article: ArticleEntry;
  relatedTools: RelatedTool[];
  category: string;
  sameCategoryArticles?: TopicLink[];
  lastUpdated?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  navigation: "Navigation",
  "wind-waves": "Wind & Waves",
  "maritime-measurements": "Maritime Measurements",
  sailing: "Sailing",
};

export function ArticleLayout({
  article,
  relatedTools,
  category,
  sameCategoryArticles = [],
  lastUpdated,
}: ArticleLayoutProps) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: CATEGORY_LABELS[category] ?? category, href: `/${category}/` },
    { label: article.title },
  ];

  return (
    <article className="container-narrow py-8">
      <BreadcrumbSchema items={breadcrumbs} />
      <Breadcrumbs items={breadcrumbs} />

      <header className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3 text-balance">
          {article.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed text-balance">
          {article.description}
        </p>
        <AuthorPublisher lastUpdated={lastUpdated} className="mt-2" />
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <ArticleContentWithLinks content={article.content} />
      </div>

      <RelatedTools tools={relatedTools} title="Related Tools" />

      {sameCategoryArticles.length > 0 && (
        <TopicExplorer
          topicLabel={CATEGORY_LABELS[category] ?? category}
          links={sameCategoryArticles}
          currentSlug={article.slug}
        />
      )}

      {article.faq.length > 0 && <FAQ items={article.faq} />}
    </article>
  );
}
